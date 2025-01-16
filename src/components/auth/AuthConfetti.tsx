import Confetti from 'react-confetti'
import { createPortal } from 'react-dom'

interface AuthConfettiProps {
  show: boolean
  onComplete: () => void
}

export function AuthConfetti({ show, onComplete }: AuthConfettiProps) {
  if (!show) return null

  return createPortal(
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      zIndex: 2147483647
    }}>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
        onConfettiComplete={() => {
          console.log("Confetti animation completed")
          onComplete()
        }}
      />
    </div>,
    document.body
  )
}