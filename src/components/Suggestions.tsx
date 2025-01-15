import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Annotation from 'react-image-annotation';
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
  const [annotations, setAnnotations] = useState([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!suggestions || !suggestions.length) return;

    const newAnnotations = suggestions.map((suggestion, index) => ({
      geometry: {
        type: 'POINT',
        x: suggestion.position?.x / 100,
        y: suggestion.position?.y / 100,
      },
      data: {
        ...suggestion,
        index,
      }
    }));
    setAnnotations(newAnnotations);
  }, [suggestions]);

  const renderMarker = ({ geometry, data }: any) => {
    if (!geometry) return null;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className="absolute p-2 w-6 h-6 flex items-center justify-center rounded-full 
              bg-primary text-primary-foreground hover:bg-primary/90
              shadow-lg cursor-pointer text-sm font-medium transform hover:scale-110 transition-all"
            style={{
              position: 'absolute',
              left: `${geometry.x * 100}%`,
              top: `${geometry.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 50
            }}
          >
            {data.index + 1}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" side="right">
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                  {data.index + 1}
                </span>
                <h3 className="font-medium text-lg">{data.element}</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Original</p>
                  <p className="mt-1">{data.original}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Improved</p>
                  <p className="mt-1 text-primary font-medium">{data.improved}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{data.explanation}</p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFeedback(data.index, true)}
                  className="text-green-600 hover:text-green-700"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFeedback(data.index, false)}
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
  };

  if (!suggestions.length || !imageUrl) {
    return null;
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative border rounded-lg overflow-hidden bg-white shadow-md">
        <Annotation
          src={imageUrl}
          alt="Uploaded UI"
          annotations={annotations}
          type="POINT"
          renderContent={renderMarker}
          disableAnnotation
          disableOverlay
          disableSelect
        />
      </div>
    </div>
  );
};