import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { HeroForm } from "@/components/hero/HeroForm";
import { CopyVariant } from "@/components/microcopy/CopyVariant";
import { generateHeroCopy } from "@/services/heroService";
import { toast } from "sonner";
import { useCredits } from "@/contexts/CreditsContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface HeroCopyVariant {
  headline: string;
  tagline: string;
  cta: string;
}

const HeroCopyGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<HeroCopyVariant[]>([]);
  const { useCredit, credits } = useCredits();
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (credits <= 0 && !session) {
        setShowCreditsDialog(true);
        return;
      }

      if (credits <= 0) {
        toast.error("No credits remaining");
        return;
      }

      // Check and use a credit before proceeding
      if (!await useCredit()) {
        toast.error("No credits remaining");
        return;
      }

      setIsLoading(true);
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
    <div className="min-h-screen bg-background py-8">
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

          <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Unlock 5x More Credits</DialogTitle>
                <DialogDescription className="pt-2">
                  You've used all your free credits! Sign up now to get:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>5x more credits to generate content</li>
                    <li>Priority support</li>
                  </ul>
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowCreditsDialog(false)}>
                  Maybe later
                </Button>
                <Button onClick={() => {
                  setShowCreditsDialog(false);
                  setShowAuthDialog(true);
                }}>
                  Sign up
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <AuthDialog 
            open={showAuthDialog} 
            onOpenChange={setShowAuthDialog} 
          />
        </div>
      </div>
    </div>
  );
};

export default HeroCopyGenerator;