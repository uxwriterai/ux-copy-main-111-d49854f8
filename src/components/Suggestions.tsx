import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useRef } from 'react';
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
  onUpdatePosition?: (index: number, position: { x: number; y: number }) => void;
}

export const Suggestions = ({ suggestions, onFeedback, imageUrl, onUpdatePosition }: SuggestionsProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const [markerToPlace, setMarkerToPlace] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isPlacingMarker || markerToPlace === null || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    console.log(`Marker ${markerToPlace + 1} placed at:`, { x, y });

    if (onUpdatePosition) {
      onUpdatePosition(markerToPlace, { x, y });
    }

    setIsPlacingMarker(false);
    setMarkerToPlace(null);
  };

  const startPlacingMarker = (index: number) => {
    setIsPlacingMarker(true);
    setMarkerToPlace(index);
    setActiveIndex(null);
  };

  if (!suggestions.length || !imageUrl) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="relative border rounded-lg overflow-hidden bg-white shadow-md">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Uploaded UI"
          className={`w-full h-auto ${isPlacingMarker ? 'cursor-crosshair' : ''}`}
          onClick={handleImageClick}
        />
        
        {suggestions.map((suggestion, index) => (
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
                  left: `${suggestion.position.x}%`,
                  top: `${suggestion.position.y}%`,
                }}
              >
                {index + 1}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" side="right">
              <Card className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <h3 className="font-medium text-lg">{suggestion.element}</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startPlacingMarker(index)}
                    >
                      Reposition
                    </Button>
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
      {isPlacingMarker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg font-medium">Click on the image to place marker {markerToPlace! + 1}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                setIsPlacingMarker(false);
                setMarkerToPlace(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};