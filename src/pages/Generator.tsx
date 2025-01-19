import { ABTestingForm } from "@/components/ab-testing/ABTestingForm"
import { ABTestingContent } from "@/components/ABTestingContent"
import { Helmet } from 'react-helmet-async';

const Generator = () => {
  return (
    <>
      <Helmet>
        <title>A/B Copy Test Generator — 100% Free, No Email Required</title>
        <meta name="description" content="Effortlessly generate A/B test variations for UX copy with AI. Optimize user interactions and improve conversions. 100% free, no signup needed." />
        <meta name="keywords" content="A/B testing tools for UX copy, AI-powered A/B test generator, Optimize UX copy with A/B tests, Conversion-focused A/B test tools, Free A/B test generators for UX" />
        <meta property="og:title" content="A/B Copy Test Generator — 100% Free, No Email Required" />
        <meta property="og:description" content="Effortlessly generate A/B test variations for UX copy with AI. Optimize user interactions and improve conversions. 100% free, no signup needed." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/generator" />
      </Helmet>

      <div className="container max-w-6xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">A/B Testing Copy Generator</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Compare and evaluate design or copy variations with AI-powered insights
          </p>
        </div>
        <ABTestingForm />
        <ABTestingContent />
      </div>
    </>
  )
}

export default Generator