import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ContextForm, type ContextData } from '@/components/ContextForm';
import { Suggestions, type Suggestion } from '@/components/Suggestions';
import { toast } from 'sonner';

const GEMINI_API_KEY = 'AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    toast.success('Image uploaded successfully');
  };

  const analyzeUIWithGemini = async (image: File, context: ContextData) => {
    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(image);
      });

      // Prepare the prompt
      const prompt = `
        Analyze this UI screenshot and provide UX copy improvement suggestions.
        Context:
        - Purpose: ${context.purpose}
        - Target Audience: ${context.audience}
        - Desired Tone: ${context.tone}
        - Emotional Goal: ${context.emotionalGoal}
        - Constraints: ${context.constraints}
        - Additional Details: ${context.additionalDetails}

        Please identify key text elements and suggest improvements that:
        1. Enhance clarity and user understanding
        2. Match the desired tone and voice
        3. Achieve the emotional response goal
        4. Stay within any specified constraints
        
        For each element, provide:
        - The element type (e.g., heading, button, label)
        - The original text
        - Improved version
        - Brief explanation of the improvement
      `;

      // Make API call to Gemini
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
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
      
      // Parse the response and extract suggestions
      const suggestionsFromResponse = data.candidates[0].content.parts[0].text
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => {
          // Simple parsing logic - you might need to adjust based on actual response format
          const parts = line.split('-').map(p => p.trim());
          return {
            element: parts[0] || "Unknown",
            original: parts[1] || "",
            improved: parts[2] || "",
            explanation: parts[3] || ""
          };
        })
        .filter((s: Suggestion) => s.element && s.improved);

      setSuggestions(suggestionsFromResponse);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing UI:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze UI. Please try again.');
    }
  };

  const handleContextSubmit = async (contextData: ContextData) => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsLoading(true);
    await analyzeUIWithGemini(uploadedImage, contextData);
    setIsLoading(false);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ImageUpload onImageUpload={handleImageUpload} />
            <ContextForm onSubmit={handleContextSubmit} isLoading={isLoading} />
          </div>
          <div className="space-y-8">
            <Suggestions suggestions={suggestions} onFeedback={handleFeedback} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;