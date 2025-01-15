import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      const updateImageSize = () => {
        const rect = imageRef.current?.getBoundingClientRect();
        if (rect) {
          setImageSize({
            width: rect.width,
            height: rect.height,
          });
        }
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
    <div className="relative w-full">
      {imageUrl && (
        <div className="relative border rounded-lg overflow-hidden bg-white shadow-md">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Uploaded UI"
            className="w-full h-auto"
          />
          <div 
            ref={containerRef}
            className="absolute inset-0"
          >
            {suggestions.map((suggestion, index) => (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <button
                    className={`absolute p-2 w-6 h-6 flex items-center justify-center rounded-full 
                      bg-primary text-primary-foreground hover:bg-primary/90
                      shadow-lg cursor-pointer text-sm font-medium transform hover:scale-110 transition-all`}
                    style={{
                      left: `${suggestion.position.x}%`,
                      top: `${suggestion.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {index + 1}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" side="right">
                  <Card className="p-4">
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
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};