import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { ComparisonResult } from "./ComparisonResult";
import { analyzeABTest } from "@/services/geminiService";
import { ArrowLeft } from "lucide-react";
import { useCredits } from "@/contexts/CreditsContext";

interface ABTestVariation {
  image?: File;
  text: string;
}

export const ABTestingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [variationA, setVariationA] = useState<ABTestVariation>({ text: "" });
  const [variationB, setVariationB] = useState<ABTestVariation>({ text: "" });
  const [showResults, setShowResults] = useState(false);
  const { useCredit } = useCredits();

  const handleImageUpload = (variation: "A" | "B") => (file: File) => {
    if (variation === "A") {
      setVariationA({ ...variationA, image: file });
    } else {
      setVariationB({ ...variationB, image: file });
    }
    toast.success(`Image uploaded for Variation ${variation}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check and use a credit before proceeding
      if (!useCredit()) {
        toast.error("No credits remaining");
        return;
      }

      const result = await analyzeABTest(variationA, variationB);
      setResults(result);
      setShowResults(true);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error analyzing variations:", error);
      toast.error("Failed to analyze variations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setShowResults(false);
    setResults(null);
    setVariationA({ text: "" });
    setVariationB({ text: "" });
  };

  if (showResults && results) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={handleRestart}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Start Over
          </Button>
        </div>
        <ComparisonResult analysis={results} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Variation A</h3>
            <div className="space-y-2">
              <Label>Upload Image (Optional)</Label>
              <ImageUpload onImageUpload={handleImageUpload("A")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textA">Copy Text</Label>
              <Textarea
                id="textA"
                value={variationA.text}
                onChange={(e) => setVariationA({ ...variationA, text: e.target.value })}
                placeholder="Enter the copy text for Variation A"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Variation B</h3>
            <div className="space-y-2">
              <Label>Upload Image (Optional)</Label>
              <ImageUpload onImageUpload={handleImageUpload("B")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textB">Copy Text</Label>
              <Textarea
                id="textB"
                value={variationB.text}
                onChange={(e) => setVariationB({ ...variationB, text: e.target.value })}
                placeholder="Enter the copy text for Variation B"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </Card>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Compare Variations"}
      </Button>
    </form>
  );
};