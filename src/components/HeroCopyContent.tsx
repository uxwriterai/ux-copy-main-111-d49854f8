import { Helmet } from 'react-helmet-async';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, Target, Settings2, CheckCircle, Users, MessageSquare, Lightbulb, Upload } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export const HeroCopyContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>AI Hero Copy Generator — Create Compelling Headlines</title>
        <meta name="description" content="Generate attention-grabbing hero copy with AI. Create compelling headlines, taglines, and CTAs that drive action. Perfect for marketers and brand managers." />
        <meta name="keywords" content="hero copy generator, headline generator, tagline creator, CTA generator, marketing copy AI" />
        <meta property="og:title" content="AI Hero Copy Generator — Create Compelling Headlines" />
        <meta property="og:description" content="Generate attention-grabbing hero copy with AI. Create compelling headlines, taglines, and CTAs that drive action." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Hero Copy Generator — Create Compelling Headlines" />
        <meta name="twitter:description" content="Generate attention-grabbing hero copy with AI. Perfect for marketers and brand managers." />
      </Helmet>

      <div className="container space-y-12 py-12">
        {/* Main Title and Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Hero Copy Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Write hero copy that grabs attention and drives action
          </p>
        </div>

        {/* Introduction */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground">
            Your hero copy is the first impression your users have of your brand or campaign. Make it count with the Hero Copy Generator – an AI-powered tool that helps you craft compelling headlines, taglines, and CTAs that stand out. Whether you're promoting a product, service, or campaign, this tool ensures your messaging is impactful and aligned with your goals.
          </p>
        </section>

        {/* Why Choose Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Why Choose Our Hero Copy Generator?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Lightbulb className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Generate Attention-Grabbing Headlines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Save time and deliver powerful messaging. The AI-Powered Hero Copy Generator creates optimized copy that captures your audience's attention.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Target className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Tailored to Your Brand</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  From SaaS to e-commerce, this tool adapts to your industry and target audience, delivering copy that aligns with your brand.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Achieve Marketing Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Whether your focus is on conversions, engagement, or building brand awareness, the tool generates copy that delivers results.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Features That Set Our Hero Copy Generator Apart</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: "Customizable Context", description: "Define your product, service, or campaign and let the AI craft relevant copy." },
              { icon: Target, title: "Industry-Specific Copy", description: "Select your industry to ensure the messaging resonates with your audience." },
              { icon: Settings2, title: "Brand Tone Alignment", description: "From professional to playful, choose a tone that matches your brand." },
              { icon: Lightbulb, title: "Goal-Oriented Suggestions", description: "Get copy tailored to your primary marketing objectives." },
              { icon: Users, title: "Target Audience Precision", description: "Refine your copy to connect with your audience's needs." }
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
          <h2 className="text-3xl font-bold text-center">How the Hero Copy Generator Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: "Describe Your Context", description: "Provide details about your product, service, or campaign." },
              { icon: Settings2, title: "Define Parameters", description: "Choose your industry, brand tone, and target audience." },
              { icon: Lightbulb, title: "Generate and Review", description: "Get AI-powered suggestions for headlines and CTAs." },
              { icon: CheckCircle, title: "Implement and Convert", description: "Use the optimized copy in your marketing materials." }
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
              { icon: Users, title: "Marketers", description: "Generate attention-grabbing copy for campaigns and landing pages." },
              { icon: Target, title: "Brand Managers", description: "Ensure consistent messaging across all platforms." },
              { icon: Lightbulb, title: "Product Owners", description: "Promote your offerings with compelling hero copy." },
              { icon: MessageSquare, title: "Designers", description: "Pair stunning designs with engaging messaging." }
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
              <AccordionTrigger>What is the Hero Copy Generator?</AccordionTrigger>
              <AccordionContent>
                It's an AI-powered tool that generates headlines, taglines, and CTAs for marketing and promotional materials.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How does this tool help with conversions?</AccordionTrigger>
              <AccordionContent>
                By tailoring copy to your target audience, brand tone, and marketing goals, it ensures messaging that drives action.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I use this for multiple industries?</AccordionTrigger>
              <AccordionContent>
                Yes, the tool is versatile and works across all industries, from SaaS to retail.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Does it support tone customization?</AccordionTrigger>
              <AccordionContent>
                Absolutely! You can choose a tone that aligns with your brand personality and audience expectations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Is this tool beginner-friendly?</AccordionTrigger>
              <AccordionContent>
                Yes, its intuitive interface makes it accessible for both beginners and experts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Crafting Impactful Hero Copy Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to make a lasting impression? The Hero Copy Generator takes the guesswork out of writing and delivers hero copy that resonates with your audience. Try it now and elevate your marketing materials with ease!
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={scrollToTop}
          >
            Generate Hero Copy Now
            <ArrowUp className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </div>
    </>
  );
};