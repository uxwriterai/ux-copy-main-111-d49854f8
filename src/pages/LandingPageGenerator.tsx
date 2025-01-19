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
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateLandingPageCopy } from "@/services/landingPageService";
import { LandingPageResult } from "@/components/landing-page/LandingPageResult";
import { Helmet } from 'react-helmet-async';

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Education",
  "E-commerce",
  "Finance",
  "Real Estate",
  "Marketing",
  "Entertainment",
  "Food & Beverage",
  "Travel",
  "Fitness",
  "Professional Services"
];

const TARGET_AUDIENCES = [
  "Young Adults (18-24)",
  "Professionals (25-34)",
  "Mid-Career (35-44)",
  "Established (45-54)",
  "Senior (55+)",
  "All Ages"
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

const LandingPageGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sections, setSections] = useState([]);
  const { toast } = useToast();
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const generatedSections = await generateLandingPageCopy(formData);
      setSections(generatedSections);
      setShowResults(true);
      toast({
        title: "Success",
        description: "Landing page copy generated successfully!",
      });
    } catch (error) {
      console.error("Error generating landing page copy:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate landing page copy. Please try again.",
      });
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

  if (showResults) {
    return <LandingPageResult sections={sections} onRestart={handleRestart} />;
  }

  return (
    <>
      <Helmet>
        <title>Landing Page Copy Generator — 100% Free, No Email Required</title>
        <meta name="description" content="Generate high-quality landing page copy with AI. Build engaging headlines, descriptions, and CTAs effortlessly. Free and no signup needed." />
        <meta name="keywords" content="Landing page text generator, AI tools for landing page copywriting, Create landing page CTAs with AI, Optimize landing pages with AI text tools, Free landing page copywriting tools" />
        <meta property="og:title" content="Landing Page Copy Generator — 100% Free, No Email Required" />
        <meta property="og:description" content="Generate high-quality landing page copy with AI. Build engaging headlines, descriptions, and CTAs effortlessly. Free and no signup needed." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/landing-page" />
      </Helmet>

      <div className="container max-w-6xl py-8">
        <div className="space-y-6">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Build a Landing Page That Converts
            </h1>
            <p className="text-muted-foreground">
              Create engaging copy for your landing page in just a few clicks
            </p>
          </div>

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
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => handleSelectChange("industry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) => handleSelectChange("targetAudience", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_AUDIENCES.map((audience) => (
                        <SelectItem key={audience} value={audience}>
                          {audience}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tone">Brand Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => handleSelectChange("tone", value)}
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
        </div>
      </div>
    </>
  );
};

export default LandingPageGenerator;
