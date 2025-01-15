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
import { generateLandingPageCopy } from "@/services/landingPageService";
import { CopyVariant } from "@/components/microcopy/CopyVariant";
import { ArrowLeft } from "lucide-react";

interface LandingPageSection {
  title: string;
  content: string[];
}

const TONES = [
  "Professional",
  "Friendly",
  "Technical",
  "Casual",
  "Formal",
  "Playful",
  "Empathetic",
];

const LandingPageGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sections, setSections] = useState<LandingPageSection[]>([]);
  const [formData, setFormData] = useState({
    productName: "",
    industry: "",
    targetAudience: "",
    tone: "Professional",
    uniqueSellingPoints: "",
    keyFeatures: "",
    additionalContext: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tone: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const generatedSections = await generateLandingPageCopy(formData);
      setSections(generatedSections);
      setShowResults(true);
      toast.success("Landing page copy generated successfully!");
    } catch (error) {
      console.error("Error generating landing page copy:", error);
      toast.error("Failed to generate landing page copy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setShowResults(false);
    setSections([]);
    setFormData({
      productName: "",
      industry: "",
      targetAudience: "",
      tone: "Professional",
      uniqueSellingPoints: "",
      keyFeatures: "",
      additionalContext: "",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Landing Page Copy Generator
            </h1>
            <p className="text-muted-foreground">
              Generate compelling copy for every section of your landing page
            </p>
          </div>

          {!showResults ? (
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product/Service Name</Label>
                    <Input
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="e.g., TaskMaster Pro"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g., Project Management Software"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      placeholder="e.g., Small Business Owners and Freelancers"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tone">Brand Tone</Label>
                    <Select
                      value={formData.tone}
                      onValueChange={handleToneChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="uniqueSellingPoints">
                      Unique Selling Points
                    </Label>
                    <Textarea
                      id="uniqueSellingPoints"
                      name="uniqueSellingPoints"
                      value={formData.uniqueSellingPoints}
                      onChange={handleInputChange}
                      placeholder="What makes your product/service unique?"
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="keyFeatures">Key Features</Label>
                    <Textarea
                      id="keyFeatures"
                      name="keyFeatures"
                      value={formData.keyFeatures}
                      onChange={handleInputChange}
                      placeholder="List the main features of your product/service"
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalContext">
                      Additional Context (Optional)
                    </Label>
                    <Textarea
                      id="additionalContext"
                      name="additionalContext"
                      value={formData.additionalContext}
                      onChange={handleInputChange}
                      placeholder="Any other details that might help generate better copy"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Landing Page Copy"}
                </Button>
              </form>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleRestart}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Start Over
                </Button>
              </div>

              {sections.map((section, index) => (
                <Card key={index} className="p-6">
                  <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                  <div className="space-y-4">
                    {section.content.map((content, contentIndex) => (
                      <CopyVariant
                        key={contentIndex}
                        text={content}
                      />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPageGenerator;