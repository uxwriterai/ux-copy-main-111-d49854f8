import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generateEmptyState } from "@/services/emptyStateService"
import { CopyVariant } from "@/components/microcopy/CopyVariant"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    try {
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
        </div>
      </div>
    </div>
  )
}

export default EmptyStateGenerator