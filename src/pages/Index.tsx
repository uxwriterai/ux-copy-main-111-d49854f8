import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ContextForm, type ContextData } from '@/components/ContextForm';
import { Suggestions, type Suggestion } from '@/components/Suggestions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w';

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

  const analyzeUIWithGemini = async (image: File, context: ContextData) => {
    try {
      console.log('Starting image analysis...');
      
      if (image.size > 4 * 1024 * 1024) {
        throw new Error('Image size must be less than 4MB');
      }

      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

      console.log('Image converted to base64');

      const prompt = `
        You are a UX writing expert. Analyze this UI screenshot and provide precise suggestions for improving the copy.
        
        Instructions for analysis:
        1. Identify each text element in the UI
        2. For each element, provide:
           - The exact type of UI element (button, heading, label, etc.)
           - The exact original text as it appears
           - An improved version that matches the context
           - A brief explanation of why the improvement is better
           - The precise position of the element using percentages:
             * x: horizontal position from left (0-100)
             * y: vertical position from top (0-100)
             * Be extremely precise with coordinates
             * Measure from the center of the text element
             * Use the visible boundaries of the text

        Format each suggestion exactly like this, with the | separator:
        Element Type | Original Text | Improved Text | Explanation | x:42,y:73

        Context to consider:
        - Purpose: ${context.purpose}
        - Target Audience: ${context.audience}
        - Desired Tone: ${context.tone}
        - Emotional Goal: ${context.emotionalGoal}
        - Constraints: ${context.constraints}
        - Additional Details: ${context.additionalDetails}

        Important rules:
        1. Only suggest changes for actual text elements
        2. Preserve any technical terms or proper nouns
        3. Maintain consistent tone across suggestions
        4. Ensure coordinates are precise and within 0-100
        5. Verify each element actually exists in the UI
        6. Skip decorative or non-text elements
        7. Focus on meaningful improvements
        8. Keep improved text within any specified length constraints
      `;

      console.log('Sending request to Gemini API...');

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
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${errorData.error?.message || 'Failed to analyze image'}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      const suggestionsText = data.candidates[0].content.parts[0].text;
      console.log('Raw suggestions:', suggestionsText);

      // Enhanced parsing logic with validation
      const suggestionsFromResponse = suggestionsText
        .split('\n')
        .filter((line: string) => line.includes('|'))
        .map((line: string) => {
          const [element, original, improved, explanation, position] = line.split('|').map(p => p.trim());
          
          // Strict coordinate parsing with validation
          const coordinates = position.match(/x:(\d+\.?\d*),y:(\d+\.?\d*)/);
          if (!coordinates) {
            console.warn('Invalid position format:', position);
            return null;
          }

          const x = parseFloat(coordinates[1]);
          const y = parseFloat(coordinates[2]);

          // Validate all required fields and coordinate ranges
          if (!element || !original || !improved || !explanation || 
              isNaN(x) || isNaN(y) || 
              x < 0 || x > 100 || y < 0 || y > 100) {
            console.warn('Invalid suggestion data:', { element, original, improved, explanation, x, y });
            return null;
          }

          return {
            element,
            original,
            improved,
            explanation,
            position: { x, y }
          };
        })
        .filter((s): s is Suggestion => s !== null && 
          s.element !== '---' && 
          s.original !== '---' && 
          s.improved !== '---' && 
          s.explanation !== '---'
        );

      console.log('Processed suggestions:', suggestionsFromResponse);

      if (suggestionsFromResponse.length === 0) {
        throw new Error('No valid suggestions were generated');
      }

      setSuggestions(suggestionsFromResponse);
      setShowResults(true);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing UI:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze UI. Please try again.');
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">UX Copy Improver</h1>
          <p className="text-lg text-gray-600">
            Upload your UI screenshot and get AI-powered suggestions for better UX copy
          </p>
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