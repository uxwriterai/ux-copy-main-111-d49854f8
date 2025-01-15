import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const PURPOSES = [
  "User Onboarding",
  "Navigation Menu",
  "Settings Panel",
  "Dashboard",
  "Form Interface",
  "Error Messages",
  "Custom"
];

const TONES = [
  "Professional",
  "Friendly",
  "Playful",
  "Technical",
  "Casual",
  "Formal",
  "Custom"
];

const EMOTIONAL_GOALS = [
  "Motivating",
  "Reassuring",
  "Engaging",
  "Empowering",
  "Calming",
  "Exciting",
  "Custom"
];

const AUDIENCES = [
  "Tech-savvy Users",
  "Beginners",
  "Business Professionals",
  "Creative Professionals",
  "Students",
  "Seniors",
  "Custom"
];

export const ContextForm = ({ onSubmit, isLoading }: ContextFormProps) => {
  const [formData, setFormData] = useState<ContextData>({
    purpose: '',
    audience: '',
    tone: '',
    emotionalGoal: '',
    constraints: '',
    additionalDetails: '',
  });
  const [showCustomInputs, setShowCustomInputs] = useState({
    purpose: false,
    audience: false,
    tone: false,
    emotionalGoal: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSelectChange = (value: string, field: keyof typeof showCustomInputs) => {
    if (value === 'Custom') {
      setShowCustomInputs(prev => ({ ...prev, [field]: true }));
      setFormData(prev => ({ ...prev, [field]: '' }));
    } else {
      setShowCustomInputs(prev => ({ ...prev, [field]: false }));
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
      <div className="space-y-4">
        <Label htmlFor="purpose" className="text-gray-300">Purpose of UI Screen</Label>
        <Select onValueChange={(value) => handleSelectChange(value, 'purpose')}>
          <SelectTrigger className="bg-[#252A3D] border-gray-700 text-white">
            <SelectValue placeholder="Select purpose..." />
          </SelectTrigger>
          <SelectContent className="bg-[#252A3D] border-gray-700">
            {PURPOSES.map((purpose) => (
              <SelectItem key={purpose} value={purpose} className="text-gray-200 hover:bg-gray-700">
                {purpose}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showCustomInputs.purpose && (
          <Input
            name="purpose"
            placeholder="Enter custom purpose..."
            value={formData.purpose}
            onChange={handleInputChange}
            className="mt-2 bg-[#252A3D] border-gray-700 text-white placeholder:text-gray-500"
          />
        )}
      </div>

      {/* Repeat similar styling for other form groups */}
        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience</Label>
          <Select onValueChange={(value) => handleSelectChange(value, 'audience')}>
            <SelectTrigger>
              <SelectValue placeholder="Select audience..." />
            </SelectTrigger>
            <SelectContent>
              {AUDIENCES.map((audience) => (
                <SelectItem key={audience} value={audience}>
                  {audience}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showCustomInputs.audience && (
            <Input
              name="audience"
              placeholder="Enter custom audience..."
              value={formData.audience}
              onChange={handleInputChange}
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Desired Tone & Voice</Label>
          <Select onValueChange={(value) => handleSelectChange(value, 'tone')}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone..." />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showCustomInputs.tone && (
            <Input
              name="tone"
              placeholder="Enter custom tone..."
              value={formData.tone}
              onChange={handleInputChange}
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emotionalGoal">Emotional Response Goal</Label>
          <Select onValueChange={(value) => handleSelectChange(value, 'emotionalGoal')}>
            <SelectTrigger>
              <SelectValue placeholder="Select emotional goal..." />
            </SelectTrigger>
            <SelectContent>
              {EMOTIONAL_GOALS.map((goal) => (
                <SelectItem key={goal} value={goal}>
                  {goal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showCustomInputs.emotionalGoal && (
            <Input
              name="emotionalGoal"
              placeholder="Enter custom emotional goal..."
              value={formData.emotionalGoal}
              onChange={handleInputChange}
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="constraints">Constraints</Label>
          <Input
            id="constraints"
            name="constraints"
            placeholder="e.g., Max 50 characters for buttons"
            value={formData.constraints}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalDetails">Additional Details</Label>
          <Textarea
            id="additionalDetails"
            name="additionalDetails"
            placeholder="Any other specific requirements or context"
            value={formData.additionalDetails}
            onChange={handleInputChange}
            className="h-24"
          />
        </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Generate UX Copy'}
      </Button>
    </form>
  );
};
