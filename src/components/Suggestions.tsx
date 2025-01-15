import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import * as markerjs2 from 'markerjs2';
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
  const imageRef = useRef<HTMLImageElement>(null);
  const markerAreaRef = useRef<markerjs2.MarkerArea | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageRef.current || !imageUrl || !isImageLoaded || !suggestions.length) return;

    const markerArea = new markerjs2.MarkerArea(imageRef.current);
    markerAreaRef.current = markerArea;

    markerArea.renderAtNaturalSize = true;
    markerArea.renderImageType = 'image/png';
    markerArea.settings.displayMode = markerjs2.DisplayMode.Preview;

    // Show marker area first
    markerArea.show();

    // After showing, create and add markers
    suggestions.forEach((suggestion, index) => {
      // Create a marker with the correct constructor signature
      const marker = new markerjs2.CalloutMarker();
      
      // Calculate position in pixels
      const rect = imageRef.current!.getBoundingClientRect();
      const xPos = (suggestion.position.x / 100) * rect.width;
      const yPos = (suggestion.position.y / 100) * rect.height;

      // Set marker properties using the marker's state
      marker.state = {
        ...marker.state,
        width: 100,
        height: 100,
        left: xPos - 50,
        top: yPos - 50,
        text: `${index + 1}`,
      };
      
      // Add marker to the marker area's markers array
      markerArea.addMarkerToState(marker);
    });

    // Add click handlers to markers
    const markerElements = document.querySelectorAll('.markerjs-marker');
    markerElements.forEach((element, index) => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        const popoverTrigger = document.querySelector(`[data-suggestion-index="${index}"]`);
        if (popoverTrigger) {
          (popoverTrigger as HTMLElement).click();
        }
      });
    });

    return () => {
      if (markerAreaRef.current) {
        markerAreaRef.current.close();
      }
    };
  }, [suggestions, imageUrl, isImageLoaded]);

  if (!suggestions.length || !imageUrl) {
    return null;
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative border rounded-lg overflow-hidden bg-white shadow-md">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Uploaded UI"
          className="w-full h-auto"
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {suggestions.map((suggestion, index) => (
          <Popover key={index}>
            <PopoverTrigger asChild>
              <div data-suggestion-index={index} className="hidden">
                {index + 1}
              </div>
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
  );
};