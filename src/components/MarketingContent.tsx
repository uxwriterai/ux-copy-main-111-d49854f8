import { Helmet } from 'react-helmet-async';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, Upload, Settings2, Target, BarChart, Clock, Users, Lightbulb, CheckCircle, Upload as UploadIcon, Sliders, Goal, Zap, Users as UsersIcon, Code, MessageSquare } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export const MarketingContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>AI UX Copy Enhancer — Optimize Your Interface Text</title>
        <meta name="description" content="Transform your UX writing with AI-powered suggestions. Get instant improvements for buttons, forms, and interface text. Perfect for designers, developers, and marketers." />
        <meta name="keywords" content="UX writing, AI copywriting, interface text, UX copy optimization, microcopy generator" />
        <meta property="og:title" content="AI UX Copy Enhancer — Optimize Your Interface Text" />
        <meta property="og:description" content="Transform your UX writing with AI-powered suggestions. Get instant improvements for buttons, forms, and interface text." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI UX Copy Enhancer — Optimize Your Interface Text" />
        <meta name="twitter:description" content="Transform your UX writing with AI-powered suggestions. Perfect for designers, developers, and marketers." />
      </Helmet>

      <div className="space-y-12 py-12">
        {/* Main Title and Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI UX Copy Enhancer
          </h1>
          <p className="text-xl text-muted-foreground">
            Let AI help you refine your words for better user experiences
          </p>
        </div>

        {/* Introduction */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground">
            In today's fast-paced digital world, crafting user experiences that captivate and guide users seamlessly is more important than ever. Introducing the AI UX Copywriting Tool – your ultimate solution for refining user interface text with precision, speed, and creativity. This AI-driven platform empowers designers, developers, and marketers to create user-friendly, impactful, and goal-oriented UX content effortlessly.
          </p>
        </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Why Choose Our AI UX Copywriting Tool?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Lightbulb className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Improve UX Writing with AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Say goodbye to guesswork and manual iterations. Our AI-Powered UX Copy Tool leverages advanced algorithms to analyze your existing text and provide actionable suggestions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Optimize User Experience Text</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Words matter in user interfaces. Whether you're working on a button, modal, or onboarding flow, the UX Text Refinement Tool helps you fine-tune every detail.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Tailored for Your Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No more one-size-fits-all solutions. Simply upload your UI screenshot, define your target audience, and set the tone and goals for your copy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Features That Set Our AI UX Copywriting Tool Apart</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: UploadIcon, title: "Upload and Analyze Screenshots", description: "Upload your UI designs directly to our tool and let the AI work its magic." },
            { icon: Sliders, title: "Customizable Tone and Voice", description: "Whether you want to sound professional, friendly, or playful, our AI adapts to your desired tone." },
            { icon: Target, title: "Goal-Oriented Suggestions", description: "Define the purpose of your screen and ensure your copy aligns perfectly with your goals." },
            { icon: Zap, title: "Real-Time Feedback", description: "Get instant insights and actionable feedback on your UI text." },
            { icon: CheckCircle, title: "Optimized for Accessibility", description: "Ensure your text meets accessibility standards, making your interface inclusive." }
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
        <h2 className="text-3xl font-bold text-center">How the UX Text Refinement Tool Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Upload, title: "Upload Your UI Screenshot", description: "Easily drag and drop your design file into the tool." },
            { icon: Settings2, title: "Define Your Parameters", description: "Set your target audience, emotional tone, and desired goals." },
            { icon: Target, title: "Get AI-Powered Insights", description: "Receive refined copy suggestions tailored to your needs." },
            { icon: CheckCircle, title: "Implement and Test", description: "Integrate the optimized text and improve your UX." }
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
            { icon: Users, title: "UI/UX Designers", description: "Simplify the process of creating effective microcopy." },
            { icon: Target, title: "Product Managers", description: "Ensure that your product messaging aligns with user needs." },
            { icon: BarChart, title: "Marketers", description: "Craft compelling CTAs that drive action." },
            { icon: Code, title: "Developers", description: "Improve clarity and usability without becoming a wordsmith." }
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
              <AccordionTrigger>What is the AI UX Copywriting Tool?</AccordionTrigger>
              <AccordionContent>
                It is an AI-powered platform designed to refine and optimize the text used in user interfaces, such as buttons, tooltips, and onboarding screens.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How does the tool improve UX writing with AI?</AccordionTrigger>
              <AccordionContent>
                By analyzing your UI screenshot and providing tailored suggestions based on your goals, audience, and desired tone.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I use this tool for different industries?</AccordionTrigger>
              <AccordionContent>
                Absolutely! Whether you're in e-commerce, SaaS, healthcare, or any other sector, the tool adapts to your unique requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is this tool suitable for non-designers?</AccordionTrigger>
              <AccordionContent>
                Yes, the tool is intuitive and easy to use, making it accessible for marketers, developers, and other professionals.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Does it support accessibility standards?</AccordionTrigger>
              <AccordionContent>
                Yes, the tool ensures that your copy is inclusive and accessible to all users.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Optimizing Your UX Text Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to elevate your user experience? Transform how you approach UX writing with the AI UX Copywriting Tool. Start refining your interface text today and watch your conversions soar!
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
