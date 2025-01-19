import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { generateMicrocopy } from "@/services/geminiService";
import { CopyVariant } from "@/components/microcopy/CopyVariant";
import { Helmet } from 'react-helmet-async';

type ElementType = 
  | "button"
  | "error"
  | "tooltip"
  | "form-label"
  | "modal"
  | "notification"
  | "onboarding"
  | "custom";

interface MicrocopyRequest {
  elementType: ElementType;
  customElementType?: string;
  context: string;
  tone: string;
  maxLength?: number;
  additionalNotes: string;
}

const ELEMENT_TYPES: { value: ElementType; label: string }[] = [
  { value: "button", label: "Button" },
  { value: "error", label: "Error Message" },
  { value: "tooltip", label: "Tooltip" },
  { value: "form-label", label: "Form Label/Help Text" },
  { value: "modal", label: "Modal/Dialog" },
  { value: "notification", label: "Notification" },
  { value: "onboarding", label: "Onboarding Message" },
  { value: "custom", label: "Custom Element" },
];

const TONES = [
  "Professional",
  "Friendly",
  "Technical",
  "Casual",
  "Formal",
  "Playful",
  "Empathetic",
];

const MicrocopyGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [request, setRequest] = useState<MicrocopyRequest>({
    elementType: "button",
    context: "",
    tone: "Professional",
    maxLength: undefined,
    additionalNotes: "",
  });
  const [generatedCopy, setGeneratedCopy] = useState<string[]>([]);
  const { toast: toastFn } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const variants = await generateMicrocopy(
        request.elementType,
        request.context,
        request.tone,
        request.maxLength,
        request.additionalNotes,
        request.customElementType
      );
      
      setGeneratedCopy(variants);
      toastFn({
        title: "Success",
        description: "Microcopy generated successfully!"
      });
    } catch (error) {
      console.error("Error generating microcopy:", error);
      toastFn({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate microcopy. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Microcopy Creator — 100% Free, No Email Required</title>
        <meta name="description" content="Create effective and concise microcopy for buttons, forms, and UI elements with this AI-powered tool. Free to use with no email required." />
        <meta name="keywords" content="Microcopy creation for UI, AI microcopy generator for UX, Generate effective button text with AI, UX-focused AI microcopy tools, Free AI tools for creating microcopy" />
        <meta property="og:title" content="AI Microcopy Creator — 100% Free, No Email Required" />
        <meta property="og:description" content="Create effective and concise microcopy for buttons, forms, and UI elements with this AI-powered tool. Free to use with no email required." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/microcopy" />
      </Helmet>

      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Microcopy Generator</h1>
              <p className="text-muted-foreground">
                Generate clear and effective microcopy for your UI elements
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="elementType">Element Type</Label>
                    <Select
                      value={request.elementType}
                      onValueChange={(value: ElementType) =>
                        setRequest(prev => ({ ...prev, elementType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select element type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ELEMENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {request.elementType === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="customElementType">Custom Element Type</Label>
                      <Input
                        id="customElementType"
                        placeholder="e.g., Progress Bar Label"
                        value={request.customElementType || ""}
                        onChange={e =>
                          setRequest(prev => ({
                            ...prev,
                            customElementType: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="context">Context</Label>
                    <Textarea
                      id="context"
                      placeholder="Describe the context and purpose of this element"
                      value={request.context}
                      onChange={e =>
                        setRequest(prev => ({ ...prev, context: e.target.value }))
                      }
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select
                      value={request.tone}
                      onValueChange={value =>
                        setRequest(prev => ({ ...prev, tone: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map(tone => (
                          <SelectItem key={tone} value={tone}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLength">Maximum Length (optional)</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      placeholder="e.g., 50 characters"
                      value={request.maxLength || ""}
                      onChange={e =>
                        setRequest(prev => ({
                          ...prev,
                          maxLength: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any specific requirements or preferences"
                      value={request.additionalNotes}
                      onChange={e =>
                        setRequest(prev => ({
                          ...prev,
                          additionalNotes: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Microcopy"}
                  </Button>
                </form>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Generated Variants</h2>
                  {generatedCopy.length > 0 ? (
                    <div className="space-y-4">
                      {generatedCopy.map((variant, index) => (
                        <CopyVariant key={index} text={variant} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Generated microcopy variants will appear here
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MicrocopyGenerator;
