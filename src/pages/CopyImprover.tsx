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
import { ImageUpload } from "@/components/ImageUpload";
import { ContextForm, ContextData } from "@/components/ContextForm";
import { Suggestions, Suggestion } from "@/components/Suggestions";

const CopyImprover = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [improvedText, setImprovedText] = useState("");
  const { useCredit, credits } = useCredits();
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleContextSubmit = async (contextData: ContextData) => {
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

      if (!uploadedImage) {
        toast.error("Please upload an image first");
        return;
      }

      setIsLoading(true);

      // Mock suggestions for now - you'll need to implement the actual analysis
      const mockSuggestions: Suggestion[] = [
        {
          element: "Header Text",
          original: "Welcome to our app",
          improved: "Get Started in Seconds",
          explanation: "More action-oriented and engaging",
          position: { x: 50, y: 20 }
        },
        {
          element: "Button Text",
          original: "Submit",
          improved: "Create Account",
          explanation: "Clearer call to action",
          position: { x: 50, y: 80 }
        }
      ];

      if (!await useCredit()) {
        toast.error("Failed to use credit");
        return;
      }

      setSuggestions(mockSuggestions);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextImprovement = async (e: React.FormEvent) => {
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

      if (!await useCredit()) {
        toast.error("Failed to use credit");
        return;
      }

      setIsLoading(true);
      const improved = await improveCopy(inputText);
      setImprovedText(improved);
      toast.success("Copy improved successfully!");
    } catch (error) {
      console.error("Error improving copy:", error);
      toast.error("Failed to improve copy");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (index: number, isPositive: boolean) => {
    toast.success(`Thank you for your ${isPositive ? 'positive' : 'negative'} feedback!`);
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
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Image Analysis</h2>
              <ImageUpload onImageUpload={handleImageUpload} />
              {uploadedImage && (
                <ContextForm onSubmit={handleContextSubmit} isLoading={isLoading} />
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Text Improvement</h2>
              <form onSubmit={handleTextImprovement} className="space-y-4">
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
              {improvedText && <CopyVariant text={improvedText} />}
            </div>
          </Card>
        </div>

        {uploadedImage && suggestions.length > 0 && (
          <Card className="p-6">
            <Suggestions
              suggestions={suggestions}
              onFeedback={handleFeedback}
              imageUrl={uploadedImage}
            />
          </Card>
        )}

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