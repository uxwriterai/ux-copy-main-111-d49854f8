import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ContextForm, type ContextData } from '@/components/ContextForm';
import { Suggestions, type Suggestion } from '@/components/Suggestions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const GEMINI_API_KEY = 'AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w';
const MAX_SUGGESTIONS = 15;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success('Image uploaded successfully');
  };

  const parseGeminiResponse = (text: string): Suggestion[] => {
    try {
      // Split the response into lines and filter out empty lines
      const lines = text.split('\n').filter(line => line.trim());
      
      // Find lines that look like complete JSON objects
      const jsonLines = lines.filter(line => 
        (line.trim().startsWith('{') && line.trim().endsWith('}')) ||
        (line.trim().startsWith('{') && line.trim().endsWith('},'))
      );

      // Parse each JSON line and validate the structure
      const parsedSuggestions = jsonLines.map(line => {
        try {
          // Remove trailing comma if present
          const cleanLine = line.trim().endsWith(',') 
            ? line.slice(0, -1) 
            : line;
          
          const suggestion = JSON.parse(cleanLine);
          
          // Validate the suggestion structure
          if (!suggestion.element || 
              !suggestion.position?.x || 
              !suggestion.position?.y || 
              !suggestion.original || 
              !suggestion.improved || 
              !suggestion.explanation) {
            console.log('Invalid suggestion structure:', suggestion);
            return null;
          }

          // Ensure position values are within bounds
          return {
            ...suggestion,
            position: {
              x: Math.min(100, Math.max(0, suggestion.position.x)),
              y: Math.min(100, Math.max(0, suggestion.position.y))
            }
          };
        } catch (e) {
          console.log('Failed to parse suggestion line:', line, e);
          return null;
        }
      }).filter((s): s is Suggestion => s !== null);

      console.log('Successfully parsed suggestions:', parsedSuggestions);
      return parsedSuggestions.slice(0, MAX_SUGGESTIONS);
    } catch (e) {
      console.error('Error parsing Gemini response:', e);
      return [];
    }
  };

  const analyzeUIWithGemini = async (image: File, context: ContextData) => {
    try {
      if (image.size > 4 * 1024 * 1024) {
        throw new Error('Image size must be less than 4MB');
      }

      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

      const prompt = `
        Analyze this UI screenshot and provide up to ${MAX_SUGGESTIONS} UX copy improvement suggestions.
        Focus on these key aspects:

        1. CLARITY
        - How effectively does the UI communicate its purpose?
        - Is the language clear, concise, and unambiguous?
        - Are technical terms explained when necessary?

        2. VISUAL HIERARCHY
        - Are elements arranged logically?
        - Does the text sizing and placement guide users naturally?
        - Is important information prominently displayed?

        3. TONE CONSISTENCY
        - Does the copy align with the specified tone: ${context.tone}?
        - Is the emotional goal of ${context.emotionalGoal} effectively achieved?
        - Is the language appropriate for ${context.audience}?

        4. ACCESSIBILITY
        - Is the copy inclusive and welcoming?
        - Are instructions clear and actionable?
        - Is the language simple enough for the target audience?

        5. ACTIONABILITY
        - Are calls-to-action (CTAs) clear and compelling?
        - Do buttons and links clearly indicate their purpose?
        - Is feedback and guidance provided when needed?

        Context:
        - Purpose: ${context.purpose}
        - Target Audience: ${context.audience}
        - Desired Tone: ${context.tone}
        - Emotional Goal: ${context.emotionalGoal}
        - Constraints: ${context.constraints}
        - Additional Details: ${context.additionalDetails}

        For each UI element that needs improvement, provide:
        1. Precise element location (x,y coordinates as percentages of image dimensions)
        2. Element type (e.g., heading, button, label)
        3. Original text content
        4. Improved version that addresses the above aspects
        5. Brief explanation of why the improvement helps

        Format each suggestion as a complete, valid JSON object on a single line:
        {"element": "element type", "position": {"x": number, "y": number}, "original": "original text", "improved": "improved text", "explanation": "brief explanation"}

        Ensure each suggestion is a complete JSON object on its own line.
        All coordinates must be percentages between 0-100.
        Focus on impactful improvements that align with the provided context.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }, {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image.split(',')[1]
                }
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Failed to analyze image'}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      const suggestionsText = data.candidates[0].content.parts[0].text;
      console.log('Raw Gemini response:', suggestionsText);
      
      const parsedSuggestions = parseGeminiResponse(suggestionsText);
      
      if (parsedSuggestions.length === 0) {
        throw new Error('No valid suggestions could be parsed from the response');
      }

      setSuggestions(parsedSuggestions);
      setShowResults(true);
      toast.success(`Analysis complete! Found ${parsedSuggestions.length} suggestions.`);
    } catch (error) {
      console.error('Error analyzing UI:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze UI');
      throw error;
    }
  };

  const handleContextSubmit = async (contextData: ContextData) => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsLoading(true);
    try {
      await analyzeUIWithGemini(uploadedImage, contextData);
    } catch (error) {
      console.error('Error in handleContextSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setShowResults(false);
    setSuggestions([]);
    setUploadedImage(null);
    setImagePreviewUrl(null);
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('UX Copy Improvement Suggestions', 14, 15);
      
      // Add context info
      doc.setFontSize(10);
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 25);
      
      // Prepare table data
      const tableData = suggestions.map((suggestion, index) => [
        index + 1,
        suggestion.element,
        suggestion.original,
        suggestion.improved,
        suggestion.explanation
      ]);
      
      // Add table
      autoTable(doc, {
        head: [['#', 'Element', 'Original Text', 'Improved Text', 'Explanation']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 45 },
          3: { cellWidth: 45 },
          4: { cellWidth: 65 }
        },
        headStyles: { fillColor: [41, 37, 36] }
      });
      
      // Save PDF
      doc.save('ux-copy-improvements.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleFeedback = (index: number, isPositive: boolean) => {
    toast.success(isPositive ? 'Thanks for the positive feedback!' : 'Thanks for the feedback. We\'ll improve our suggestions.');
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container max-w-6xl py-12">
        <div className="flex justify-center items-center mb-8 text-center">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-4">UX Copy Improver</h1>
            <p className="text-lg text-muted-foreground">
              Transform your UI text with AI-powered suggestions
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {suggestions.length > 0 ? `${suggestions.length} suggestions generated` : ''}
            </p>
          </div>
        </div>

        {!showResults ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <ImageUpload onImageUpload={handleImageUpload} />
            <ContextForm onSubmit={handleContextSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
              <Button 
                variant="outline" 
                onClick={handleRestart}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Start Over
              </Button>
              {suggestions.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              )}
            </div>
            <Suggestions 
              suggestions={suggestions} 
              onFeedback={handleFeedback}
              imageUrl={imagePreviewUrl}
            />
            
            {suggestions.length > 0 && (
              <div className="mt-8 rounded-lg border bg-card">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Improvement Details</h2>
                </div>
                <div className="p-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead className="w-32">Element</TableHead>
                        <TableHead>Original Text</TableHead>
                        <TableHead>Improved Text</TableHead>
                        <TableHead className="w-64">Explanation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suggestions.map((suggestion, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{suggestion.element}</TableCell>
                          <TableCell>{suggestion.original}</TableCell>
                          <TableCell className="font-medium text-primary">
                            {suggestion.improved}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {suggestion.explanation}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
