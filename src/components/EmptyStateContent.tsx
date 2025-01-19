import { Helmet } from 'react-helmet-async';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, Upload, Settings2, Target, MessageSquare, Users, Lightbulb, CheckCircle, Sliders, Goal } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export const EmptyStateContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Empty State Message Generator — Create Clear, Actionable Empty States</title>
        <meta name="description" content="Craft thoughtful empty state messages with AI-generated text. Create clear, empathetic, and actionable empty state messages that align with your brand voice." />
        <meta name="keywords" content="empty state generator, UI empty states, UX writing, empty state messages, AI copywriting" />
        <meta property="og:title" content="Empty State Message Generator — Create Clear, Actionable Empty States" />
        <meta property="og:description" content="Craft thoughtful empty state messages with AI-generated text. Perfect for designers, developers, and product teams." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Empty State Message Generator — Create Clear, Actionable Empty States" />
        <meta name="twitter:description" content="Craft thoughtful empty state messages with AI-generated text. Create clear, empathetic messages." />
      </Helmet>

      <div className="container space-y-12 py-12">
        {/* Main Title and Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Empty State Message Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Craft thoughtful empty state messages with AI-generated text
          </p>
        </div>

        {/* Introduction */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground">
            Empty states are an important part of user experience, offering guidance when users encounter no data, errors, or onboarding steps. Our AI-powered tool helps you create clear, empathetic, and actionable empty state messages that align with your brand voice.
          </p>
        </section>

        {/* Why Choose Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Why Choose Our Empty State Message Generator?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Lightbulb className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Guide Users Effectively with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Empty states don't have to feel empty. Use our AI-Powered Generator to create messages that reassure users and help them take the next step.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Clear and Actionable Messaging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Empty state messages are more than placeholders. This tool helps you craft text that's not just informative but also actionable.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Target className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Tailored to Your Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Define your element type, purpose, tone, and context to generate empty state messages that fit seamlessly into your interface.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Features That Set Our Empty State Generator Apart</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Settings2, title: "Element-Specific Options", description: "Choose the type of element to ensure relevant suggestions." },
              { icon: Sliders, title: "Context-Based Customization", description: "Describe the purpose of your empty state for perfectly tailored text." },
              { icon: Goal, title: "Brand Tone Alignment", description: "Select your desired tone to maintain a consistent brand voice." },
              { icon: CheckCircle, title: "Multiple Variants", description: "Receive multiple versions to pick the one that resonates most." },
              { icon: Target, title: "Actionable Suggestions", description: "Provide users with clear next steps within the empty state message." }
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
          <h2 className="text-3xl font-bold text-center">How the Empty State Generator Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Settings2, title: "Select Element Type", description: "Define the type of empty state you need." },
              { icon: Upload, title: "Provide Context", description: "Describe the situation or purpose." },
              { icon: Target, title: "Choose Your Brand Tone", description: "Select the tone that matches your brand." },
              { icon: CheckCircle, title: "Generate and Refine", description: "Get tailored messages and pick the best one." }
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
              { icon: Users, title: "UI/UX Designers", description: "Simplify the process of writing thoughtful empty state messages." },
              { icon: Target, title: "Product Managers", description: "Ensure all product states are user-friendly and aligned with goals." },
              { icon: MessageSquare, title: "Marketers", description: "Create messages that support user retention in all scenarios." },
              { icon: Settings2, title: "Developers", description: "Implement pre-approved empty state messages seamlessly." }
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
              <AccordionTrigger>What is the Empty State Message Generator?</AccordionTrigger>
              <AccordionContent>
                It's an AI-powered tool that helps create clear and actionable empty state messages for any UI element.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How does it generate empty state messages?</AccordionTrigger>
              <AccordionContent>
                The tool uses your input—such as element type, context, and tone—to generate tailored and user-focused messages.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I customize the tone and style of the messages?</AccordionTrigger>
              <AccordionContent>
                Yes, you can select from multiple tones to match your brand's voice and style preferences.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Does the tool support accessibility best practices?</AccordionTrigger>
              <AccordionContent>
                Absolutely. The tool ensures all messages are clear, inclusive, and actionable for every user.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What kinds of empty states can this tool handle?</AccordionTrigger>
              <AccordionContent>
                From onboarding flows and error pages to empty search results, this tool is versatile enough for all scenarios.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Crafting Helpful Empty States Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't let empty states become missed opportunities. The Empty State Message Generator ensures every interaction is clear, empathetic, and actionable.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={scrollToTop}
          >
            Generate Empty State Copy Now
            <ArrowUp className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </div>
    </>
  );
};