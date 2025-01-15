import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CopyVariantProps {
  text: string;
  label?: string;
}

export const CopyVariant = ({ text, label }: CopyVariantProps) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="rounded-lg border bg-card p-4 flex justify-between items-start gap-4">
      <div className="flex-1">
        {label && (
          <span className="text-sm font-medium text-muted-foreground mb-1 block">
            {label}
          </span>
        )}
        <p className="text-card-foreground">{text}</p>
      </div>
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