import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ContextForm, type ContextData } from '@/components/ContextForm';
import { Suggestions, type Suggestion } from '@/components/Suggestions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Upload, Target, Zap, Users, Layout, Clock, TrendingUp, Repeat, Shield } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from 'react-helmet-async';

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
      const lines = text.split('\n').filter(line => line.trim());
      const jsonLines = lines.filter(line => 
        (line.trim().startsWith('{') && line.trim().endsWith('}')) ||
        (line.trim().startsWith('{') && line.trim().endsWith('},'))
      );

      const parsedSuggestions = jsonLines.map(line => {
        try {
          const cleanLine = line.trim().endsWith(',') 
            ? line.slice(0, -1) 
            : line;
          
          const suggestion = JSON.parse(cleanLine);
          
          if (!suggestion.element || 
              !suggestion.position?.x || 
              !suggestion.position?.y || 
              !suggestion.original || 
              !suggestion.improved || 
              !suggestion.explanation) {
            console.log('Invalid suggestion structure:', suggestion);
            return null;
          }

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

      // Get the API key from Supabase Edge Function
      const { data: { value: apiKey }, error: keyError } = await supabase
        .functions.invoke('get-gemini-key');

      if (keyError || !apiKey) {
        console.error('Error fetching API key:', keyError);
        throw new Error('Failed to get API key');
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
      
      doc.setFontSize(16);
      doc.text('UX Copy Improvement Suggestions', 14, 15);
      
      doc.setFontSize(10);
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 25);
      
      const tableData = suggestions.map((suggestion, index) => [
        index + 1,
        suggestion.element,
        suggestion.original,
        suggestion.improved,
        suggestion.explanation
      ]);
      
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>AI UX Copy Enhancer — 100% Free, No Email Required</title>
        <meta name="description" content="Refine and enhance your UX copy with AI-driven suggestions. Perfect for improving UI text and optimizing user experience. 100% free, no signup required." />
        <meta name="keywords" content="Enhance UX copy with AI, AI-powered UX text optimizer, Improve UI text with AI tools, UX writing AI copy improvement, Free UX copy enhancement tools" />
        <meta property="og:title" content="AI UX Copy Enhancer — 100% Free, No Email Required" />
        <meta property="og:description" content="Refine and enhance your UX copy with AI-driven suggestions. Perfect for improving UI text and optimizing user experience. 100% free, no signup required." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/copy-improver" />
      </Helmet>

      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="container max-w-6xl py-8">
          {!showResults ? (
            <div className="space-y-12">
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight">AI UX Copy Enhancer — 100% Free, No Email Required</h1>
                <p className="text-xl text-muted-foreground">
                  Refine and enhance your UX copy with AI-driven suggestions. Perfect for improving UI text and optimizing user experience.
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                <ImageUpload onImageUpload={handleImageUpload} />
                <ContextForm onSubmit={handleContextSubmit} isLoading={isLoading} />
              </div>

              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                </div>
                
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Upload Screenshot</h3>
                    <p className="text-sm text-muted-foreground">Drag and drop your design file</p>
                  </Card>
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-primary">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Define Parameters</h3>
                    <p className="text-sm text-muted-foreground">Set audience and tone</p>
                  </Card>
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-primary">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Get AI Insights</h3>
                    <p className="text-sm text-muted-foreground">Receive tailored suggestions</p>
                  </Card>
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-primary">4</span>
                    </div>
                    <h3 className="font-semibold mb-2">Implement</h3>
                    <p className="text-sm text-muted-foreground">Apply and test changes</p>
                  </Card>
                </div>
                <div className="text-center mt-8">
                  <Button 
                    size="lg" 
                    onClick={scrollToTop}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold"
                  >
                    Try Now — 100% Free, No Sign-up Required
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <Zap className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Improve UX Writing with AI</h3>
                  <p className="text-muted-foreground">Say goodbye to guesswork and manual iterations. Our AI-Powered UX Copy Tool leverages advanced algorithms for clear, concise content.</p>
                </Card>
                <Card className="p-6">
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Optimize User Experience</h3>
                  <p className="text-muted-foreground">Fine-tune every detail of your interface text to boost engagement, reduce friction, and drive conversions.</p>
                </Card>
                <Card className="p-6">
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tailored for Your Audience</h3>
                  <p className="text-muted-foreground">Define your target audience and goals, and get suggestions perfectly tailored to your specific needs.</p>
                </Card>
              </div>

              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Features That Set Us Apart</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Upload className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">Upload and Analyze Screenshots</h3>
                    <p className="text-muted-foreground">Upload your UI designs directly and let our AI work its magic on every element.</p>
                  </div>
                  <div className="space-y-4">
                    <Layout className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">Customizable Tone and Voice</h3>
                    <p className="text-muted-foreground">Adapt the copy to match your brand's unique voice and personality.</p>
                  </div>
                  <div className="space-y-4">
                    <Clock className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">Real-Time Feedback</h3>
                    <p className="text-muted-foreground">Get instant insights and actionable feedback on your UI text.</p>
                  </div>
                  <div className="space-y-4">
                    <Shield className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">Optimized for Accessibility</h3>
                    <p className="text-muted-foreground">Ensure your text meets accessibility standards for all users.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Who Is This Tool For?</h2>
                </div>
                
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">UI/UX Designers</h3>
                    <p className="text-sm text-muted-foreground">Simplify the process of creating effective microcopy.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">Product Managers</h3>
                    <p className="text-sm text-muted-foreground">Ensure that your product messaging aligns with user needs.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">Marketers</h3>
                    <p className="text-sm text-muted-foreground">Craft compelling CTAs that drive action.</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">Developers</h3>
                    <p className="text-sm text-muted-foreground">Improve clarity and usability without becoming a wordsmith.</p>
                  </Card>
                </div>
              </div>

              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">Ready to elevate your user experience?</h2>
                <p className="text-xl text-muted-foreground">Transform how you approach UX writing with our AI-powered tool.</p>
                <Button 
                  size="lg" 
                  onClick={scrollToTop}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold"
                >
                  Start Optimizing Your UX Text — It's Free!
                </Button>
              </div>
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
    </>
  );
};

export default Index;
