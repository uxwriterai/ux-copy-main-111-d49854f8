import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export interface Suggestion {
  element: string;
  original: string;
  improved: string;
  explanation: string;
}

interface SuggestionsProps {
  suggestions: Suggestion[];
  onFeedback: (index: number, isPositive: boolean) => void;
}

export const Suggestions = ({ suggestions, onFeedback }: SuggestionsProps) => {
  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Copy Suggestions</h2>
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="p-4 animate-fadeIn">
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