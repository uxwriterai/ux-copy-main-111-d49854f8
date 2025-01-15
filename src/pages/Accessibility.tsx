import { Button } from "@/components/ui/button"

export default function Accessibility() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Accessibility Checker</h1>
      <p className="text-muted-foreground mb-4">
        Check your copy for accessibility and inclusivity.
      </p>
      <Button>Check Accessibility</Button>
    </div>
  )
}