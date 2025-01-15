import { useState } from "react";
import { Card } from "@/components/ui/card";
import { HeroForm } from "@/components/hero/HeroForm";
import { CopyVariant } from "@/components/microcopy/CopyVariant";
import { generateHeroCopy } from "@/services/heroService";
import { toast } from "sonner";

interface HeroCopyVariant {
  headline: string;
  tagline: string;
  cta: string;
}

const HeroCopyGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<HeroCopyVariant[]>([]);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const variants = await generateHeroCopy(formData);
      setGeneratedVariants(variants);
      toast.success("Hero copy generated successfully!");
    } catch (error) {
      console.error("Error generating hero copy:", error);
      toast.error("Failed to generate hero copy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Hero Copy Generator</h1>
            <p className="text-muted-foreground">
              Generate impactful headlines, taglines, and CTAs for your hero sections
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <HeroForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Generated Variants</h2>
                {generatedVariants.length > 0 ? (
                  <div className="space-y-8">
                    {generatedVariants.map((variant, index) => (
                      <div key={index} className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Variant {index + 1}
                          </h3>
                          <CopyVariant text={variant.headline} />
                          <CopyVariant text={variant.tagline} />
                          <CopyVariant text={variant.cta} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Generated hero copy variants will appear here
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

export default HeroCopyGenerator;