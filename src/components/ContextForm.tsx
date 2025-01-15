import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export interface ContextData {
  purpose: string;
  audience: string;
  tone: string;
  emotionalGoal: string;
  constraints: string;
  additionalDetails: string;
}

interface ContextFormProps {
  onSubmit: (data: ContextData) => void;
  isLoading: boolean;
}

export const ContextForm = ({ onSubmit, isLoading }: ContextFormProps) => {
  const [formData, setFormData] = useState<ContextData>({
    purpose: '',
    audience: '',
    tone: '',
    emotionalGoal: '',
    constraints: '',
    additionalDetails: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose of UI Screen</Label>
          <Input
            id="purpose"
            name="purpose"
            placeholder="e.g., User onboarding, Navigation menu"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience</Label>
          <Input
            id="audience"
            name="audience"
            placeholder="e.g., Tech-savvy millennials"
            value={formData.audience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Desired Tone & Voice</Label>
          <Input
            id="tone"
            name="tone"
            placeholder="e.g., Professional, Friendly, Playful"
            value={formData.tone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emotionalGoal">Emotional Response Goal</Label>
          <Input
            id="emotionalGoal"
            name="emotionalGoal"
            placeholder="e.g., Motivating, Reassuring"
            value={formData.emotionalGoal}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="constraints">Constraints</Label>
          <Input
            id="constraints"
            name="constraints"
            placeholder="e.g., Max 50 characters for buttons"
            value={formData.constraints}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalDetails">Additional Details</Label>
          <Textarea
            id="additionalDetails"
            name="additionalDetails"
            placeholder="Any other specific requirements or context"
            value={formData.additionalDetails}
            onChange={handleChange}
            className="h-24"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze UI Copy'}
        </Button>
      </form>
    </Card>
  );
};