import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

export interface Suggestion {
  element: string;
  original: string;
  improved: string;
  explanation: string;
}

interface SuggestionsProps {
  suggestions: Suggestion[];
  onFeedback: (index: number, isPositive: boolean) => void;
  imageUrl?: string;
}

export const Suggestions = ({ suggestions, onFeedback, imageUrl }: SuggestionsProps) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Copy Suggestions</h2>
      
      {imageUrl && (
        <div className="relative border rounded-lg overflow-hidden">
          <img src={imageUrl} alt="Uploaded UI" className="w-full h-auto" />
          <div className="absolute inset-0">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className={`absolute p-2 rounded-full transition-all transform hover:scale-110
                  ${selectedSuggestion === index ? 'bg-primary text-white' : 'bg-white/80'}
                  shadow-lg cursor-pointer`}
                style={{
                  left: `${(index * 20) + 10}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setSelectedSuggestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className={`p-4 animate-fadeIn transition-all ${selectedSuggestion === index ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="space-y-2">
              <h3 className="font-medium text-lg">{suggestion.element}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Original</p>
                  <p className="mt-1">{suggestion.original}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Improved</p>
                  <p className="mt-1 text-primary">{suggestion.improved}</p>
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