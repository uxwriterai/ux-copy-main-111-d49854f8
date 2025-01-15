import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { 
  SplitSquareVertical,
  Wand2,
  Type,
  FileX
} from "lucide-react"

const tools = [
  {
    title: "UX Copy Improver",
    description: "Transform your UI text with AI-powered suggestions",
    icon: Wand2,
    route: "/copy-improver"
  },
  {
    title: "Microcopy Generator",
    description: "Generate clear and effective microcopy for UI elements",
    icon: Type,
    route: "/microcopy"
  },
  {
    title: "A/B Testing Generator",
    description: "Generate A/B test variations for your UX copy",
    icon: SplitSquareVertical,
    route: "/generator"
  },
  {
    title: "Empty State Generator",
    description: "Create engaging empty state messages that guide users",
    icon: FileX,
    route: "/empty-state"
  }
]

const Index = () => {
  const navigate = useNavigate()

  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">UX Writing Tools</h1>
        <p className="text-lg text-muted-foreground">
          A collection of AI-powered tools to help you write better UX copy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.route} className="group hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <tool.icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {tool.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={() => navigate(tool.route)}
              >
                Open Tool
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Index