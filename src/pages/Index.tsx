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
    title: "UX Copy Enhancer",
    description: "Transform your UI text with AI-powered suggestions",
    icon: Wand2,
    route: "/copy-improver"
  },
  {
    title: "Microcopy Creator",
    description: "Generate clear and effective microcopy for UI elements",
    icon: Type,
    route: "/microcopy"
  },
  {
    title: "A/B Copy Test Generator",
    description: "Generate A/B test variations for your UX copy",
    icon: SplitSquareVertical,
    route: "/generator"
  },
  {
    title: "Empty State Builder",
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
        <title>UX Writing AI Tools — Free Copy Generators for UX Writers</title>
        <meta name="description" content="Discover the ultimate suite of UX writing AI tools to improve copy, create microcopy, optimize A/B tests, and design landing pages. 100% free, no email required." />
        <meta name="keywords" content="UX writing tools, AI UX writing generators, Free UX copywriting tools, AI-powered UX copy tools, Microcopy generators for UX, Free UX tools for designers" />
        <meta property="og:title" content="UX Writing AI Tools — Free Copy Generators for UX Writers" />
        <meta property="og:description" content="Discover the ultimate suite of UX writing AI tools to improve copy, create microcopy, optimize A/B tests, and design landing pages. 100% free, no email required." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="w-full py-12 flex flex-col items-center">
        <div className="text-center mb-12 max-w-2xl px-4">
          <h1 className="text-4xl font-bold mb-4">The Ultimate Free Tools for UX Writing</h1>
          <p className="text-lg text-muted-foreground">
            AI-powered tools to help you write better UX copy effortlessly.
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
