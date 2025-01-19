import { ABTestingForm } from "@/components/ab-testing/ABTestingForm"
import { Helmet } from 'react-helmet-async';

const Generator = () => {
  return (
    <>
      <Helmet>
        <title>A/B Testing Copy Generator - UX Writing Tools</title>
        <meta name="description" content="Generate and compare A/B test variations for your UX copy with AI-powered insights and analysis." />
        <meta name="keywords" content="A/B testing, copy testing, UX writing, conversion optimization" />
        <meta property="og:title" content="A/B Testing Copy Generator - UX Writing Tools" />
        <meta property="og:description" content="Create and analyze A/B test variations for your UX copy." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/generator" />
      </Helmet>

      <div className="container max-w-6xl py-8">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold tracking-tight">A/B Testing Copy Generator</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Compare and evaluate design or copy variations with AI-powered insights
          </p>
        </div>
        <ABTestingForm />
      </div>
    </>
  )
}

export default Generator