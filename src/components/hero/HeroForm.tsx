import { useState } from 'react';
import { Card } from '@/components/ui/card';
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

interface HeroFormData {
  context: string;
  industry: string;
  tone: string;
  goal: string;
  targetAudience: string;
  additionalNotes: string;
}

interface HeroFormProps {
  onSubmit: (data: HeroFormData) => void;
  isLoading: boolean;
}

const INDUSTRIES = [
  "E-commerce",
  "SaaS",
  "Portfolio",
  "Marketing Agency",
  "Education",
  "Healthcare",
  "Real Estate",
  "Custom"
];

const TONES = [
  "Professional",
  "Playful",
  "Inspirational",
  "Bold",
  "Minimalist",
  "Friendly",
  "Custom"
];

const GOALS = [
  "Drive Sign-ups",
  "Showcase Product",
  "Build Brand Awareness",
  "Generate Leads",
  "Promote Event",
  "Increase Sales",
  "Custom"
];

const AUDIENCES = [
  "Business Professionals",
  "Creative Professionals",
  "Students",
  "Tech-savvy Users",
  "General Consumers",
  "Enterprise Clients",
  "Custom"
];

export const HeroForm = ({ onSubmit, isLoading }: HeroFormProps) => {
  const [formData, setFormData] = useState<HeroFormData>({
    context: '',
    industry: '',
    tone: '',
    goal: '',
    targetAudience: '',
    additionalNotes: '',
  });

  const [showCustomInputs, setShowCustomInputs] = useState({
    industry: false,
    tone: false,
    goal: false,
    targetAudience: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="context">Context</Label>
        <Textarea
          id="context"
          name="context"
          placeholder="Describe your product, service, or campaign"
          value={formData.context}
          onChange={handleInputChange}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select onValueChange={(value) => handleSelectChange(value, 'industry')}>
          <SelectTrigger>
            <SelectValue placeholder="Select industry..." />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showCustomInputs.industry && (
          <Input
            name="industry"
            placeholder="Enter custom industry..."
            value={formData.industry}
            onChange={handleInputChange}
            className="mt-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Brand Tone</Label>
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
        <Label htmlFor="goal">Primary Goal</Label>
        <Select onValueChange={(value) => handleSelectChange(value, 'goal')}>
          <SelectTrigger>
            <SelectValue placeholder="Select goal..." />
          </SelectTrigger>
          <SelectContent>
            {GOALS.map((goal) => (
              <SelectItem key={goal} value={goal}>
                {goal}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showCustomInputs.goal && (
          <Input
            name="goal"
            placeholder="Enter custom goal..."
            value={formData.goal}
            onChange={handleInputChange}
            className="mt-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Select onValueChange={(value) => handleSelectChange(value, 'targetAudience')}>
          <SelectTrigger>
            <SelectValue placeholder="Select target audience..." />
          </SelectTrigger>
          <SelectContent>
            {AUDIENCES.map((audience) => (
              <SelectItem key={audience} value={audience}>
                {audience}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showCustomInputs.targetAudience && (
          <Input
            name="targetAudience"
            placeholder="Enter custom target audience..."
            value={formData.targetAudience}
            onChange={handleInputChange}
            className="mt-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          name="additionalNotes"
          placeholder="Any specific requirements or preferences"
          value={formData.additionalNotes}
          onChange={handleInputChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Hero Copy"}
      </Button>
    </form>
  );
};