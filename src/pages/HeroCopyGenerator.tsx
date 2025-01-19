import { useState } from "react";
import { Card } from "@/components/ui/card";
import { HeroForm } from "@/components/hero/HeroForm";
import { CopyVariant } from "@/components/microcopy/CopyVariant";
import { generateHeroCopy } from "@/services/heroService";
import { toast } from "sonner";
import { Helmet } from 'react-helmet-async';
import { HeroCopyContent } from "@/components/HeroCopyContent";

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
    <>
      <Helmet>
        <title>Hero Section Copy Generator — 100% Free, No Email Required</title>
        <meta name="description" content="Generate captivating hero section copy with AI. Create impactful headlines, taglines, and CTAs to boost conversions. Free and easy to use, no email required." />
        <meta name="keywords" content="Hero section copy generator, AI tools for hero headlines, Generate CTAs for hero sections, UX hero text creation tools, Free AI tools for hero copywriting" />
        <meta property="og:title" content="Hero Section Copy Generator — 100% Free, No Email Required" />
        <meta property="og:description" content="Generate captivating hero section copy with AI. Create impactful headlines, taglines, and CTAs to boost conversions. Free and easy to use, no email required." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/hero-copy" />
      </Helmet>

      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-6xl">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">Hero Copy Generator</h1>
              <p className="text-muted-foreground">
                Generate captivating hero section copy with AI
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
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Variant {index + 1}
                          </h3>
                          <div className="space-y-2">
                            <CopyVariant text={variant.headline} label="Headline" />
                            <CopyVariant text={variant.tagline} label="Tagline" />
                            <CopyVariant text={variant.cta} label="CTA" />
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
      
      <HeroCopyContent />
    </>
  );
};

export default HeroCopyGenerator;