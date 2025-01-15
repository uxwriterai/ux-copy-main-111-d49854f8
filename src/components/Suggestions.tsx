import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  console.log('Rendering suggestions with positions:', suggestions.map(s => s.position));

  if (!suggestions.length || !imageUrl) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="relative border rounded-lg overflow-hidden bg-white shadow-md">
        <img
          src={imageUrl}
          alt="Uploaded UI"
          className="w-full h-auto"
        />
        
        {suggestions.map((suggestion, index) => {
          // Ensure x and y are within bounds (0-100)
          const x = Math.max(0, Math.min(100, suggestion.position.x));
          const y = Math.max(0, Math.min(100, suggestion.position.y));
          
          console.log(`Marker ${index + 1} position:`, { x, y });

          return (
            <Popover 
              key={index}
              open={activeIndex === index}
              onOpenChange={(open) => setActiveIndex(open ? index : null)}
            >
              <PopoverTrigger asChild>
                <button
                  className={`absolute w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium 
                    transform -translate-x-1/2 -translate-y-1/2 hover:bg-primary/90 transition-colors
                    ${activeIndex === index ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
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
          );
        })}
      </div>
    </div>
  );
};