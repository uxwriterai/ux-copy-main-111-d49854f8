import { ABTestingForm } from "@/components/ab-testing/ABTestingForm";

const Generator = () => {
  return (
    <div className="container max-w-6xl py-8">
      <div className="text-left mb-8">
        <h1 className="text-4xl font-bold text-foreground">A/B Testing Copy Generator</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Compare and evaluate design or copy variations with AI-powered insights
        </p>
      </div>
      <ABTestingForm />
    </div>
  );
};

export default Generator;