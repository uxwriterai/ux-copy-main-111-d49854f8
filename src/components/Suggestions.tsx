import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export interface Suggestion {
  element: string;
  original: string;
  improved: string;
  explanation: string;
  position: {
    x: number;
    y: number;
  };
}

interface SuggestionsProps {
  suggestions: Suggestion[];
  onFeedback: (index: number, isPositive: boolean) => void;
  imageUrl?: string | null;
}

export const Suggestions = ({ suggestions, onFeedback, imageUrl }: SuggestionsProps) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      const updateImageSize = () => {
        setImageSize({
          width: imageRef.current?.offsetWidth || 0,
          height: imageRef.current?.offsetHeight || 0,
        });
      };

      updateImageSize();
      window.addEventListener('resize', updateImageSize);
      return () => window.removeEventListener('resize', updateImageSize);
    }
  }, [imageUrl]);

  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative">
        {imageUrl && (
          <div className="sticky top-4">
            <div className="relative border rounded-lg overflow-hidden bg-white shadow-md">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Uploaded UI"
                className="w-full h-auto"
              />
              <div className="absolute inset-0">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={`absolute p-2 w-6 h-6 flex items-center justify-center rounded-full transition-all transform hover:scale-110
                      ${selectedSuggestion === index ? 'bg-primary text-white' : 'bg-white/90 border-2 border-primary text-primary'}
                      shadow-lg cursor-pointer text-sm font-medium`}
                    style={{
                      left: `${suggestion.position.x}%`,
                      top: `${suggestion.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => {
                      setSelectedSuggestion(index);
                      const element = document.getElementById(`suggestion-${index}`);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-4">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index}
            id={`suggestion-${index}`}
            className={`p-4 animate-fadeIn transition-all ${selectedSuggestion === index ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <h3 className="font-medium text-lg">{suggestion.element}</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Original</p>
                  <p className="mt-1">{suggestion.original}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Improved</p>
                  <p className="mt-1 text-primary font-medium">{suggestion.improved}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{suggestion.explanation}</p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFeedback(index, true)}
                  className="text-green-600 hover:text-green-700"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFeedback(index, false)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Not Helpful
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};