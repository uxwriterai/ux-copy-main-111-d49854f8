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
  LayoutTemplate,
  Palette,
  PenTool,
  Target,
  Users
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const tools = [
  {
    title: "UX Copy Enhancer",
    description: "Let AI help you refine your words for better user experiences",
    icon: Wand2,
    route: "/copy-improver"
  },
  {
    title: "Microcopy Creator",
    description: "Write concise, effective text for buttons, forms, and menus with ease",
    icon: Type,
    route: "/microcopy"
  },
  {
    title: "A/B Copy Test Generator",
    description: "Easily generate A/B test variations to optimize your content",
    icon: SplitSquareVertical,
    route: "/generator"
  },
  {
    title: "Empty State Builder",
    description: "Guide your users with clear, thoughtful AI-generated text",
    icon: FileX,
    route: "/empty-state"
  },
  {
    title: "Hero Copy Generator",
    description: "Generate headlines, taglines, and CTAs that grab attention",
    icon: Layout,
    route: "/hero-copy"
  },
  {
    title: "Landing Page Generator",
    description: "Create engaging copy for your landing page in just a few clicks",
    icon: LayoutTemplate,
    route: "/landing-page"
  }
]

const faqs = [
  {
    question: "What are UX Writing Tools?",
    answer: "UX Writing Tools are AI-powered platforms designed to help you create clear, concise, and engaging copy for your user interface. These tools improve user experience by refining text across apps, websites, and other digital platforms."
  },
  {
    question: "How do AI-powered UX Writing Tools work?",
    answer: "Our tools leverage advanced AI algorithms to analyze your existing text, suggest improvements, or generate new copy tailored to your specific needs."
  },
  {
    question: "Can I customize the copy generated by these tools?",
    answer: "Absolutely! While our tools provide optimized suggestions, you can edit and adapt the copy to align with your brand's tone and style."
  },
  {
    question: "Are these tools beginner-friendly?",
    answer: "Yes! Our intuitive interface and step-by-step guidance make it easy for anyone to create professional-quality UX copy."
  },
  {
    question: "Are the tools free to use?",
    answer: "Some tools may offer free versions, while others provide premium features for advanced needs. Check each tool's details for pricing information."
  },
  {
    question: "How can these tools help improve my conversion rates?",
    answer: "By optimizing your UX copy for clarity, engagement, and actionability, our tools help you create a seamless user journey, leading to higher conversions."
  }
]

const audiences = [
  {
    title: "UX Designers",
    description: "Looking to enhance their projects with polished, effective copy.",
    icon: Palette,
  },
  {
    title: "Content Writers",
    description: "Seeking assistance in crafting user-focused text.",
    icon: PenTool,
  },
  {
    title: "Marketers",
    description: "Aiming to optimize conversions through data-backed copy.",
    icon: Target,
  },
  {
    title: "Product Teams",
    description: "That need consistent messaging across digital experiences.",
    icon: Users,
  },
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
          <h1 className="text-4xl font-bold mb-4">Ultimate Free Tools for UX Writing</h1>
          <p className="text-lg text-muted-foreground">
            A collection of AI-powered tools to help you write better UX copy
          </p>
        </div>

        <div className="w-full px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {tools.map((tool) => (
              <Card 
                key={tool.route} 
                className="group hover:shadow-lg transition-all duration-300 w-full max-w-sm hover:scale-105 cursor-pointer animate-tilt"
                onClick={() => navigate(tool.route)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                  >
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-24 mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">Who Are These Tools For?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {audiences.map((audience, index) => (
                <Card 
                  key={index}
                  className="group hover:bg-primary/5 cursor-default border-0 shadow-none"
                >
                  <CardHeader>
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <audience.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{audience.title}</CardTitle>
                        <CardDescription>
                          {audience.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-24 max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">FAQs About Our UX Writing Tools</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index