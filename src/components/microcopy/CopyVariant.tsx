import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CopyVariantProps {
  text: string
}

export const CopyVariant = ({ text }: CopyVariantProps) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="rounded-lg border bg-card p-4 flex justify-between items-start gap-4">
      <p className="text-card-foreground flex-1">{text}</p>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="shrink-0"
      >
        <Copy className="h-4 w-4" />
        <span className="sr-only">Copy to clipboard</span>
      </Button>
    </div>
  )
}