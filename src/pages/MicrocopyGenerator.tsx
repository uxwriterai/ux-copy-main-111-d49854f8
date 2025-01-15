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
  const [generatedCopy, setGeneratedCopy] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement API call to generate microcopy
      console.log("Generating microcopy with request:", request);
      
      // Temporary mock response
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockResponse = `Sample ${request.elementType} text in ${request.tone.toLowerCase()} tone`;
      
      setGeneratedCopy(mockResponse);
      toast.success("Microcopy generated successfully!");
    } catch (error) {
      console.error("Error generating microcopy:", error);
      toast.error("Failed to generate microcopy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-2">
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
                <h2 className="text-xl font-semibold">Generated Microcopy</h2>
                {generatedCopy ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-card-foreground">{generatedCopy}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCopy);
                        toast.success("Copied to clipboard!");
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Generated microcopy will appear here
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrocopyGenerator;