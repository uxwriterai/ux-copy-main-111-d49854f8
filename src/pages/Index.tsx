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

  const handleRestart = () => {
    setShowResults(false);
    setSuggestions([]);
    setUploadedImage(null);
    setImagePreviewUrl(null);
  };

const analyzeUIWithGemini = async (image: File, context: ContextData) => {
  try {
    const base64Image = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(image);
    });

    const prompt = `
      Analyze this UI screenshot and provide UX copy improvement suggestions. 
      
      IMPORTANT COORDINATE INSTRUCTIONS:
      - For each UI element, provide its exact position using x,y coordinates
      - Coordinates MUST be percentages between 0-100
      - (0,0) is top-left corner, (100,100) is bottom-right corner
      - Be extremely precise - measure the element's center point relative to the image dimensions
      - Validate that all coordinates are within 0-100 range
      - If an element appears to be outside these bounds, adjust to the nearest valid position

      Context:
      - Purpose: ${context.purpose}
      - Target Audience: ${context.audience}
      - Desired Tone: ${context.tone}
      - Emotional Goal: ${context.emotionalGoal}
      - Constraints: ${context.constraints}
      - Additional Details: ${context.additionalDetails}

      For each element that needs improvement, provide the response in this exact format:
      ELEMENT: [element type]
      POSITION: x:[number 0-100],y:[number 0-100]
      ORIGINAL: [current text]
      IMPROVED: [suggested text]
      EXPLANATION: [why this improves the UX]
      ---

      Please analyze the image and provide 3-5 suggestions in exactly this format.
      Double-check that all x,y values are between 0 and 100.
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
    console.log('Raw Gemini API Response:', data);

    // Parse and validate coordinates
    const suggestions = data.candidates[0].content.parts[0].text
      .split('---')
      .filter((block: string) => block.trim().length > 0)
      .map((block: string) => {
        const lines = block.trim().split('\n');
        
        // Extract and validate coordinates
        const positionLine = lines.find((line: string) => line.startsWith('POSITION:'))?.replace('POSITION:', '').trim() || '';
        const [xCoord, yCoord] = positionLine.split(',').map(coord => {
          const [axis, value] = coord.trim().split(':');
          const parsedValue = parseFloat(value);
          // Ensure coordinates are within bounds
          return Math.max(0, Math.min(100, parsedValue));
        });

        console.log('Parsed coordinates:', { x: xCoord, y: yCoord });

        return {
          element: lines.find((line: string) => line.startsWith('ELEMENT:'))?.replace('ELEMENT:', '').trim() || '',
          position: {
            x: xCoord,
            y: yCoord
          },
          original: lines.find((line: string) => line.startsWith('ORIGINAL:'))?.replace('ORIGINAL:', '').trim() || '',
          improved: lines.find((line: string) => line.startsWith('IMPROVED:'))?.replace('IMPROVED:', '').trim() || '',
          explanation: lines.find((line: string) => line.startsWith('EXPLANATION:'))?.replace('EXPLANATION:', '').trim() || ''
        };
      })
      .filter((s: Suggestion) => (
        s.element && 
        s.improved && 
        typeof s.position.x === 'number' && 
        typeof s.position.y === 'number' &&
        s.position.x >= 0 && 
        s.position.x <= 100 && 
        s.position.y >= 0 && 
        s.position.y <= 100
      ));

    console.log('Final validated suggestions:', suggestions);
    setSuggestions(suggestions);
    setShowResults(true);
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
