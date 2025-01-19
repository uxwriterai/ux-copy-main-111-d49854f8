import { Helmet } from 'react-helmet-async';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowUp, Upload, Settings2, Target, Clock, Users, Lightbulb, CheckCircle, Sliders, MessageSquare, Code } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export const LandingPageContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Landing Page Copy Generator — Create Converting Copy</title>
        <meta name="description" content="Create engaging landing page copy in minutes. AI-powered tool for crafting professional, conversion-focused content." />
        <meta name="keywords" content="landing page generator, copy generator, AI copywriting, landing page content creator" />
        <meta property="og:title" content="Landing Page Copy Generator — Create Converting Copy" />
        <meta property="og:description" content="Create engaging landing page copy in minutes. AI-powered tool for crafting professional, conversion-focused content." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Landing Page Copy Generator — Create Converting Copy" />
        <meta name="twitter:description" content="Create engaging landing page copy in minutes. AI-powered tool for crafting professional, conversion-focused content." />
      </Helmet>

      <div className="container space-y-12 py-12">
        {/* Main Title and Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Landing Page Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Create engaging copy for your landing page in just a few clicks
          </p>
        </div>

        {/* Introduction */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground">
            Your landing page is the cornerstone of your online presence. With the Landing Page Generator, you can craft professional, persuasive, and conversion-focused copy effortlessly. This AI-powered tool simplifies the process of writing landing page content, helping you attract, engage, and convert your target audience—all while staying true to your brand voice.
          </p>
        </section>

        {/* Why Choose Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Why Choose Our Landing Page Generator?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Lightbulb className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Effortlessly Create High-Converting Landing Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Skip the lengthy brainstorming sessions and let the AI-Powered Landing Page Generator deliver compelling copy tailored to your goals.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Target className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Tailored to Your Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Choose your industry, target audience, and brand tone to ensure the messaging resonates with your ideal customers.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Highlight What Makes You Unique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Showcase your unique selling points and key features with polished, professional copy that stands out.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Features That Set Our Landing Page Generator Apart</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Industry-Specific Messaging", description: "Select your industry to ensure your landing page copy aligns with market trends." },
              { icon: Sliders, title: "Customizable Brand Tone", description: "Whether professional, casual, or playful, the tool adapts to your brand personality." },
              { icon: CheckCircle, title: "Highlight USPs", description: "Clearly communicate what sets your product or service apart." },
              { icon: MessageSquare, title: "Key Feature Integration", description: "Emphasize core features in a way that appeals to your audience." },
              { icon: Settings2, title: "Contextual Customization", description: "Provide additional context for personalized, impactful copy." }
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
          <h2 className="text-3xl font-bold text-center">How the Landing Page Generator Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: "Enter Product Details", description: "Provide your product or service details to get started." },
              { icon: Settings2, title: "Define Parameters", description: "Select industry, audience, tone, and key selling points." },
              { icon: MessageSquare, title: "Generate Copy", description: "Receive professional, conversion-optimized content." },
              { icon: CheckCircle, title: "Refine and Publish", description: "Customize the generated copy and publish with confidence." }
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
              { icon: Users, title: "Marketers", description: "Streamline the creation of compelling landing pages that drive conversions." },
              { icon: Target, title: "Business Owners", description: "Quickly generate professional copy that highlights your brand's value." },
              { icon: Code, title: "Product Managers", description: "Effectively showcase product features and benefits to attract customers." },
              { icon: MessageSquare, title: "Freelancers", description: "Save time and effort when working on landing page projects." }
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
              <AccordionTrigger>What is the Landing Page Generator?</AccordionTrigger>
              <AccordionContent>
                It's an AI-powered tool designed to create engaging, conversion-focused landing page content effortlessly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Can I use this tool for different industries?</AccordionTrigger>
              <AccordionContent>
                Yes, the tool works across industries and adapts to your specific needs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How does it highlight my unique selling points?</AccordionTrigger>
              <AccordionContent>
                By analyzing the information you provide, the tool crafts copy that emphasizes what makes your product or service stand out.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is the generated content customizable?</AccordionTrigger>
              <AccordionContent>
                Absolutely! You can tweak the copy to ensure it aligns perfectly with your vision.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Does it support different brand tones?</AccordionTrigger>
              <AccordionContent>
                Yes, you can choose from a range of tones to reflect your brand's personality.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Creating Engaging Landing Pages Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your online presence? With the Landing Page Generator, you can craft professional, high-converting landing pages in no time.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={scrollToTop}
          >
            Generate Landing Page Copy Now
            <ArrowUp className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </div>
    </>
  );
};