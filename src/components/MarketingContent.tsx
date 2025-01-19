import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp } from "lucide-react";

export const MarketingContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 py-12">
      {/* Introduction */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-lg text-muted-foreground">
          In today's fast-paced digital world, crafting user experiences that captivate and guide users seamlessly is more important than ever. Introducing the AI UX Copywriting Tool – your ultimate solution for refining user interface text with precision, speed, and creativity. This AI-driven platform empowers designers, developers, and marketers to create user-friendly, impactful, and goal-oriented UX content effortlessly.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Why Choose Our AI UX Copywriting Tool?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
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
            { title: "Upload and Analyze Screenshots", description: "Upload your UI designs directly to our tool and let the AI work its magic." },
            { title: "Customizable Tone and Voice", description: "Whether you want to sound professional, friendly, or playful, our AI adapts to your desired tone." },
            { title: "Goal-Oriented Suggestions", description: "Define the purpose of your screen and ensure your copy aligns perfectly with your goals." },
            { title: "Real-Time Feedback", description: "Get instant insights and actionable feedback on your UI text." },
            { title: "Optimized for Accessibility", description: "Ensure your text meets accessibility standards, making your interface inclusive." }
          ].map((feature, index) => (
            <Card key={index}>
              <CardHeader>
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
            { title: "Upload Your UI Screenshot", description: "Easily drag and drop your design file into the tool." },
            { title: "Define Your Parameters", description: "Set your target audience, emotional tone, and desired goals." },
            { title: "Get AI-Powered Insights", description: "Receive refined copy suggestions tailored to your needs." },
            { title: "Implement and Test", description: "Integrate the optimized text and improve your UX." }
          ].map((step, index) => (
            <Card key={index}>
              <CardHeader>
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
            onClick={scrollToTop}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
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
            { title: "UI/UX Designers", description: "Simplify the process of creating effective microcopy." },
            { title: "Product Managers", description: "Ensure that your product messaging aligns with user needs." },
            { title: "Marketers", description: "Craft compelling CTAs that drive action." },
            { title: "Developers", description: "Improve clarity and usability without becoming a wordsmith." }
          ].map((role, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{role.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Start Optimizing Your UX Text Today</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ready to elevate your user experience? Transform how you approach UX writing with the AI UX Copywriting Tool. Start refining your interface text today and watch your conversions soar!
        </p>
        <Button 
          size="lg" 
          onClick={scrollToTop}
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
        >
          Analyze Your UI Copy Now
          <ArrowUp className="ml-2 h-4 w-4" />
        </Button>
      </section>
    </div>
  );
};