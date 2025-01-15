import { Button } from "@/components/ui/button"

export default function ErrorEnhancer() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Error Message Enhancer</h1>
      <p className="text-muted-foreground mb-4">
        Make your error messages more helpful and user-friendly.
      </p>
      <Button>Enhance Messages</Button>
    </div>
  )
}