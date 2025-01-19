import { Helmet } from 'react-helmet-async';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, Upload, Settings2, Target, Clock, Users, Lightbulb, CheckCircle, Sliders, MessageSquare, Code } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export const MicrocopyContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>AI Microcopy Generator — Create Perfect UI Text</title>
        <meta name="description" content="Create perfect microcopy for buttons, forms, and menus in seconds. AI-powered tool for crafting concise, impactful UI text." />
        <meta name="keywords" content="microcopy generator, UI text creator, button text generator, form label generator, menu text creator" />
        <meta property="og:title" content="AI Microcopy Generator — Create Perfect UI Text" />
        <meta property="og:description" content="Create perfect microcopy for buttons, forms, and menus in seconds. AI-powered tool for crafting concise, impactful UI text." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Microcopy Generator — Create Perfect UI Text" />
        <meta name="twitter:description" content="Create perfect microcopy for buttons, forms, and menus in seconds. AI-powered tool for crafting concise, impactful UI text." />
      </Helmet>

      <div className="space-y-12 py-12">
        {/* Main Title and Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Microcopy Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Create perfect microcopy for buttons, forms, and menus in seconds
          </p>
        </div>

        {/* Introduction */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground">
            Crafting concise and impactful microcopy is critical for guiding users and creating seamless digital experiences. Introducing the Microcopy Generator – an AI-powered tool designed to help you write effective and engaging microcopy effortlessly. From buttons to forms and menus, this tool ensures every word enhances usability and supports your UX goals.
          </p>
        </section>

        {/* Why Choose Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Why Choose Our Microcopy Generator?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Lightbulb className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Write Perfect Microcopy Instantly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Skip the brainstorming and get straight to impactful results. The AI-Powered Microcopy Generator uses advanced algorithms to create concise, actionable text.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Optimize UX Writing with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Good microcopy makes the difference between confusion and clarity. This tool ensures your microcopy communicates the right message.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Target className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Tailored to Your Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Define your audience, purpose, tone, and emotional goals to create microcopy that truly resonates with users.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Features That Set Our Microcopy Generator Apart</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: "Screenshot Upload", description: "Upload your UI design and let the AI analyze your requirements." },
              { icon: Sliders, title: "Customizable Tone", description: "Whether you need a professional, casual, or playful tone, the AI adapts to your needs." },
              { icon: Target, title: "Emotional Goal Alignment", description: "Define how you want users to feel and create microcopy that achieves this." },
              { icon: Clock, title: "Character Limit Constraints", description: "Specify limits to ensure your text fits perfectly within your UI design." },
              { icon: CheckCircle, title: "Real-Time Analysis", description: "Receive instant feedback and actionable suggestions for refining your microcopy." }
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">How the Microcopy Generator Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: "Upload Your UI Screenshot", description: "Drag and drop your design into the tool for instant analysis." },
              { icon: Settings2, title: "Define Your Parameters", description: "Set your goals, audience, and tone preferences." },
              { icon: Target, title: "Generate and Refine", description: "Let AI create impactful microcopy that matches your needs." },
              { icon: CheckCircle, title: "Implement with Confidence", description: "Use the generated text directly in your UI." }
            ].map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <step.icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Step {index + 1}: {step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={scrollToTop}
            >
              Try Now for FREE
              <ArrowUp className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Who is it for */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Who Is This Tool For?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Users, title: "UI/UX Designers", description: "Simplify the process of writing impactful microcopy." },
              { icon: Target, title: "Product Managers", description: "Ensure product communication is clear and aligned with goals." },
              { icon: MessageSquare, title: "Marketers", description: "Create engaging microcopy that drives action." },
              { icon: Code, title: "Developers", description: "Integrate pre-approved, optimized text effortlessly." }
            ].map((role, index) => (
              <Card key={index}>
                <CardHeader>
                  <role.icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{role.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the Microcopy Generator?</AccordionTrigger>
              <AccordionContent>
                It's an AI-powered tool that helps create concise, effective text for buttons, forms, and other UI elements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How does this tool optimize UX writing with AI?</AccordionTrigger>
              <AccordionContent>
                By analyzing user goals, audience needs, and tone preferences to create tailored, user-friendly microcopy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I set character limits for my microcopy?</AccordionTrigger>
              <AccordionContent>
                Yes, you can specify constraints to ensure the text fits perfectly within your UI design.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is this tool suitable for all industries?</AccordionTrigger>
              <AccordionContent>
                Absolutely. The tool is versatile and works for any project that requires clear, impactful microcopy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Does it support accessibility best practices?</AccordionTrigger>
              <AccordionContent>
                Yes, the tool ensures your microcopy aligns with accessibility standards.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Creating Impactful Microcopy Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to elevate your user experience with perfectly crafted microcopy? The Microcopy Generator streamlines your UX writing process, helping you create text that resonates and performs.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={scrollToTop}
          >
            Analyze Your UI Copy Now
            <ArrowUp className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </div>
    </>
  );
};