import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useCredits } from "@/contexts/CreditsContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generateEmptyState } from "@/services/emptyStateService"
import { CopyVariant } from "@/components/microcopy/CopyVariant"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AuthDialog } from "@/components/auth/AuthDialog"

const ELEMENT_TYPES = [
  "search",
  "list",
  "dashboard",
  "profile",
  "inbox",
  "custom"
] as const

const TONES = [
  "professional",
  "friendly",
  "playful",
  "empathetic",
  "minimal"
] as const

const EmptyStateGenerator = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [elementType, setElementType] = useState<string>("")
  const [customElementType, setCustomElementType] = useState("")
  const [context, setContext] = useState("")
  const [tone, setTone] = useState<string>("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [variants, setVariants] = useState<{ message: string; cta: string }[]>([])
  const [showCreditsDialog, setShowCreditsDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { useCredit, credits } = useCredits()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (credits <= 0) {
        setShowCreditsDialog(true)
        return
      }

      // Check and use a credit before proceeding
      if (!await useCredit()) {
        toast.error("No credits remaining")
        return
      }

      setIsLoading(true)
      const generatedVariants = await generateEmptyState(
        elementType,
        context,
        tone,
        customElementType,
        additionalNotes
      )
      setVariants(generatedVariants)
      toast.success("Empty state copy generated successfully!")
    } catch (error) {
      toast.error("Failed to generate empty state copy. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Empty State Generator</h1>
            <p className="text-muted-foreground">
              Generate clear and effective empty state messages with calls-to-action
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="elementType">Element Type</Label>
                  <Select
                    value={elementType}
                    onValueChange={setElementType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select element type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ELEMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {elementType === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customElementType">Custom Element Type</Label>
                    <Input
                      id="customElementType"
                      placeholder="e.g., Activity Feed"
                      value={customElementType}
                      onChange={(e) => setCustomElementType(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="context">Context</Label>
                  <Textarea
                    id="context"
                    placeholder="Describe the context and purpose of this empty state"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Brand Tone</Label>
                  <Select
                    value={tone}
                    onValueChange={setTone}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any specific requirements or preferences"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Empty State Copy"}
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Generated Variants</h2>
                {variants.length > 0 ? (
                  <div className="space-y-6">
                    {variants.map((variant, index) => (
                      <div key={index} className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Variant {index + 1}
                        </div>
                        <CopyVariant text={variant.message} />
                        <div className="text-sm font-medium text-muted-foreground mt-2">
                          Call-to-Action
                        </div>
                        <CopyVariant text={variant.cta} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Generated empty state messages will appear here
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
            view="sign_up"
          />
        </div>
      </div>
    </div>
  )
}

export default EmptyStateGenerator
