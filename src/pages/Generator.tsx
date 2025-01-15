import { ABTestingForm } from "@/components/ab-testing/ABTestingForm";

const Generator = () => {
  return (
    <div className="container max-w-6xl py-12">
      <div className="flex justify-center items-center mb-8 text-center">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground">A/B Testing Copy Generator</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Compare and evaluate design or copy variations with AI-powered insights
          </p>
        </div>
      </div>
      <ABTestingForm />
    </div>
  );
};

export default Generator;