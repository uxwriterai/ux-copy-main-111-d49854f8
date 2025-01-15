import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ContextForm, type ContextData } from '@/components/ContextForm';
import { Suggestions, type Suggestion } from '@/components/Suggestions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const GEMINI_API_KEY = 'AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w';
const MAX_SUGGESTIONS = 15;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success('Image uploaded successfully');
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

        Format each suggestion exactly as:
        {
          "element": "element type",
          "position": {"x": number, "y": number},
          "original": "original text",
          "improved": "improved text",
          "explanation": "brief explanation"
        }

        Ensure coordinates are precise percentages between 0-100.
        Return exactly one JSON object per line.
        Validate all suggestions have all required fields.
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
      const parsedSuggestions = suggestionsText
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            const suggestion = JSON.parse(line);
            return {
              ...suggestion,
              position: {
                x: Math.min(100, Math.max(0, suggestion.position.x)),
                y: Math.min(100, Math.max(0, suggestion.position.y))
              }
            };
          } catch (e) {
            console.error('Failed to parse suggestion:', line);
            return null;
          }
        })
        .filter((s): s is Suggestion => 
          s !== null && 
          typeof s.element === 'string' &&
          typeof s.original === 'string' &&
          typeof s.improved === 'string' &&
          typeof s.explanation === 'string' &&
          typeof s.position?.x === 'number' &&
          typeof s.position?.y === 'number'
        )
        .slice(0, MAX_SUGGESTIONS);

      setSuggestions(parsedSuggestions);
      setShowResults(true);
      toast.success('Analysis complete!');
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
    <div className="min-h-screen bg-[#1A1F2C] dark:bg-[#1A1F2C] transition-colors duration-300">
      <div className="container max-w-6xl py-12 px-4">
        <div className="flex justify-between items-center mb-12">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-5xl font-bold text-white tracking-tight">
                Generate your next UX Copy
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-4 bg-transparent border-gray-700"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-lg text-gray-400 mt-2">
              Transform your UI text with AI-powered suggestions
            </p>
            {suggestions.length > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                {suggestions.length} suggestions generated so far.
              </p>
            )}
          </div>
        </div>

        {!showResults ? (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-[#1E2435] rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Give us the brief
                <span className="text-gray-400 font-normal">
                  (or write a few keywords or a brief).
                </span>
              </h2>
              <ImageUpload onImageUpload={handleImageUpload} />
              <ContextForm onSubmit={handleContextSubmit} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
              <Button 
                variant="outline" 
                onClick={handleRestart}
                className="flex items-center gap-2 bg-transparent border-gray-700 text-white hover:bg-gray-800"
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