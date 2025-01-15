import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ContextForm, type ContextData } from '@/components/ContextForm';
import { Suggestions, type Suggestion } from '@/components/Suggestions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
        For each UI element, provide:
        1. Precise element location (x,y coordinates as percentages of the image dimensions, e.g. x: 45, y: 72)
        2. Element type (e.g., heading, button, label)
        3. Original text content
        4. Improved version of the text
        5. Brief explanation of why the improvement helps

        Context:
        - Purpose: ${context.purpose}
        - Target Audience: ${context.audience}
        - Desired Tone: ${context.tone}
        - Emotional Goal: ${context.emotionalGoal}
        - Constraints: ${context.constraints}
        - Additional Details: ${context.additionalDetails}

        Format each suggestion as a complete, valid JSON object on a single line:
        {"element": "element type", "position": {"x": number, "y": number}, "original": "original text", "improved": "improved text", "explanation": "brief explanation"}

        Ensure each suggestion is a complete JSON object on its own line.
        All coordinates must be percentages between 0-100.
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
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
              <Button 
                variant="outline" 
                onClick={handleRestart}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Start Over
              </Button>
            </div>
            <Suggestions 
              suggestions={suggestions} 
              onFeedback={handleFeedback}
              imageUrl={imagePreviewUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;