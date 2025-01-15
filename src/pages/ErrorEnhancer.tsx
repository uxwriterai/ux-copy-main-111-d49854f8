import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ErrorEnhancer = () => {
  const navigate = useNavigate()
  
  return (
    <div className="container max-w-6xl py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Error Message Enhancer</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Make your error messages more helpful and user-friendly
          </p>
        </div>
      </div>
      <div className="text-center text-muted-foreground py-12">
        Coming soon...
      </div>
    </div>
  )
}

export default ErrorEnhancer