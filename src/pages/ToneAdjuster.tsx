import { Button } from "@/components/ui/button"

export default function ToneAdjuster() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Microcopy Tone Adjuster</h1>
      <p className="text-muted-foreground mb-4">
        Adjust the tone of your microcopy to match your brand voice.
      </p>
      <Button>Adjust Tone</Button>
    </div>
  )
}