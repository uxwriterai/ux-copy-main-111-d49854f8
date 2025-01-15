import { Button } from "@/components/ui/button"

export default function Generator() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">A/B Testing Generator</h1>
      <p className="text-muted-foreground mb-4">
        Generate A/B test variations for your UX copy.
      </p>
      <Button>Generate Variations</Button>
    </div>
  )
}