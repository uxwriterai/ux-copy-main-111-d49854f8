import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WelcomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">8 credits unlocked!</DialogTitle>
          <DialogDescription className="text-center text-lg mt-4">
            Let's get started and make something awesome.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Let's go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}