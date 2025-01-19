import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Helmet } from 'react-helmet-async';
import { 
  SplitSquareVertical,
  Wand2,
  Type,
  FileX,
  Layout,
  LayoutTemplate
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
  },
  {
    title: "Hero Copy Generator",
    description: "Create compelling hero sections with headlines, taglines, and CTAs",
    icon: Layout,
    route: "/hero-copy"
  },
  {
    title: "Landing Page Generator",
    description: "Generate comprehensive copy for your entire landing page",
    icon: LayoutTemplate,
    route: "/landing-page"
  }
]

const Index = () => {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>UX Writing Tools - AI-Powered Copy Generation</title>
        <meta name="description" content="A collection of AI-powered tools to help you write better UX copy, including copy improvement, microcopy generation, and A/B testing tools." />
        <meta name="keywords" content="UX writing, AI copywriting, microcopy generator, UX tools, copy improvement" />
        <meta property="og:title" content="UX Writing Tools - AI-Powered Copy Generation" />
        <meta property="og:description" content="Transform your UX writing with our suite of AI-powered copywriting tools." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="w-full py-12 flex flex-col items-center">
        <div className="text-center mb-12 max-w-2xl px-4">
          <h1 className="text-4xl font-bold mb-4">UX Writing Tools</h1>
          <p className="text-lg text-muted-foreground">
            A collection of AI-powered tools to help you write better UX copy
          </p>
        </div>

        <div className="w-full px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {tools.map((tool) => (
              <Card key={tool.route} className="group hover:shadow-lg transition-all w-full max-w-sm">
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
      </div>
    </>
  )
}

export default Index
