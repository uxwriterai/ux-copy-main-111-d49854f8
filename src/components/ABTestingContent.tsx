import { Helmet } from 'react-helmet-async';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, Upload, Target, Brain, Users, Rocket, CheckCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export const ABTestingContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>A/B Testing Copy Generator — Compare UI Text Variations</title>
        <meta name="description" content="Compare and optimize your UI text variations with AI-powered insights. Make data-driven decisions for better user experiences. Free A/B testing tool for UX writers." />
        <meta name="keywords" content="A/B testing, UX copy testing, UI text comparison, A/B test generator, UX writing tools" />
        <meta property="og:title" content="A/B Testing Copy Generator — Compare UI Text Variations" />
        <meta property="og:description" content="Compare and optimize your UI text variations with AI-powered insights. Make data-driven decisions for better user experiences." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="A/B Testing Copy Generator — Compare UI Text Variations" />
        <meta name="twitter:description" content="Compare and optimize your UI text variations with AI-powered insights. Perfect for designers and content creators." />
      </Helmet>

      <div className="space-y-12 py-12">
        {/* Main Title and Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            A/B Testing Copy Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Test and refine your UI text variations with confidence
          </p>
        </div>

        {/* Introduction */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground">
            In the fast-evolving world of UI/UX design, choosing the right words or layout can make all the difference. Introducing the A/B Testing Copy Generator – a powerful AI-driven tool that helps you test and refine your UI text or design variations with confidence. Whether you're comparing button text, headlines, or entire layouts, this tool provides actionable insights to make data-backed decisions effortlessly.
          </p>
        </section>

        {/* Why Choose Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Why Choose Our A/B Testing Copy Generator?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Brain className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Evaluate and Improve with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stop second-guessing your copy or design choices. The AI-Powered A/B Testing Tool compares your variations and provides feedback that is clear, concise, and tailored to user experience goals.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Target className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Make Data-Driven Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Eliminate subjective choices. Use actionable insights from the A/B Testing Copy Generator to select the variation that performs best.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Rocket className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Optimize User Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ensure every word on your interface works towards engaging and converting users. From error messages to CTAs, this tool refines your UX writing for maximum impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Features That Set Our A/B Testing Copy Generator Apart</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: "Upload and Analyze Variations", description: "Drag and drop your UI screenshots or enter your copy for two versions you want to test." },
              { icon: Brain, title: "AI-Powered Insights", description: "Compare Variations A and B with AI-generated suggestions for clarity, effectiveness, and alignment with user goals." },
              { icon: Target, title: "Customizable Evaluation", description: "Set your parameters—tone, audience, emotional response, and goals—to get personalized recommendations." },
              { icon: Users, title: "User-Centric Feedback", description: "Receive actionable insights on how each variation resonates with your target audience." },
              { icon: CheckCircle, title: "Focus on Accessibility", description: "Ensure both variations meet accessibility standards, offering inclusivity for all users." }
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
          <h2 className="text-3xl font-bold text-center">How the A/B Testing Copy Generator Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: "Upload Variations", description: "Easily drag and drop screenshots or enter the text for both Variation A and Variation B." },
              { icon: Target, title: "Define Your Goals", description: "Set the purpose of the test, target audience, and emotional tone to guide the evaluation." },
              { icon: Brain, title: "Analyze with AI", description: "Let the tool provide insights into which variation better aligns with your UX goals." },
              { icon: CheckCircle, title: "Implement the Best Option", description: "Choose the winning variation and integrate it into your design for better user engagement." }
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
              { icon: Users, title: "UI/UX Designers", description: "Test variations of your microcopy, headlines, and CTAs to ensure they hit the mark." },
              { icon: Target, title: "Product Managers", description: "Evaluate messaging strategies and refine them for maximum impact." },
              { icon: Rocket, title: "Marketers", description: "Optimize campaign elements like landing pages, ad copy, and email subject lines." },
              { icon: Brain, title: "Developers", description: "Collaborate with content teams to implement the most effective UI text effortlessly." }
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
              <AccordionTrigger>What is the A/B Testing Copy Generator?</AccordionTrigger>
              <AccordionContent>
                It's an AI-powered tool designed to compare two UI text or design variations for usability and effectiveness.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How does the tool evaluate variations?</AccordionTrigger>
              <AccordionContent>
                The AI analyzes variations based on user goals, audience, tone, and clarity, offering actionable suggestions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I use this tool for visuals and text together?</AccordionTrigger>
              <AccordionContent>
                Yes, you can upload UI screenshots or just compare text-based copy variations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is the tool suitable for non-technical users?</AccordionTrigger>
              <AccordionContent>
                Absolutely. Its intuitive interface makes it accessible for anyone, regardless of technical expertise.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Does it support accessibility standards?</AccordionTrigger>
              <AccordionContent>
                Yes, the tool ensures that all variations adhere to accessibility best practices.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Comparing Variations Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to refine your user interface and elevate user experiences? The A/B Testing Copy Generator helps you make informed, data-driven decisions for better results. Test, compare, and implement the best option today!
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={scrollToTop}
          >
            Compare Your Variations Now
            <ArrowUp className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </div>
    </>
  );
};