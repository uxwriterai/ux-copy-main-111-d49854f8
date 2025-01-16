import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCredits } from "@/contexts/CreditsContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { supabase } from "@/integrations/supabase/client";
import { improveCopy } from "@/services/geminiService";
import { CopyVariant } from "@/components/microcopy/CopyVariant";

const CopyImprover = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [improvedText, setImprovedText] = useState("");
  const { useCredit, credits } = useCredits();
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const improved = await improveCopy(inputText);
      setImprovedText(improved);
      toast.success("Copy improved successfully!");
    } catch (error) {
      console.error("Error improving copy:", error);
      toast.error("Failed to improve copy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Copy Improver</h1>
          <p className="text-muted-foreground">
            Enhance your copy with AI-powered suggestions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inputText">Original Copy</Label>
                <Textarea
                  id="inputText"
                  placeholder="Enter the text you want to improve..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Improving..." : "Improve Copy"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Improved Version</h2>
              {improvedText ? (
                <CopyVariant text={improvedText} />
              ) : (
                <p className="text-muted-foreground">
                  Improved copy will appear here
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
  );
};

export default CopyImprover;