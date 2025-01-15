import { Button } from "@/components/ui/button"

export default function Analysis() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">UX Copy Analysis</h1>
      <p className="text-muted-foreground mb-4">
        Analyze your UX copy for clarity, consistency, and effectiveness.
      </p>
      <Button>Start Analysis</Button>
    </div>
  )
}