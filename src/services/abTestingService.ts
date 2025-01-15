import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w");

// Helper function to check credits before making API calls
const checkCreditsAndGetModel = () => {
  // Get credits context from sessionStorage and IP
  const ip = sessionStorage.getItem('current_ip');
  if (!ip) {
    throw new Error('IP address not found');
  }
  
  const credits = sessionStorage.getItem(`credits_${ip}`);
  const remainingCredits = credits ? parseInt(credits) : 0;
  
  if (remainingCredits <= 0) {
    throw new Error('No credits remaining');
  }
  
  // Reduce credits by 1
  sessionStorage.setItem(`credits_${ip}`, (remainingCredits - 1).toString());
  
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};

interface ABTestVariation {
  image?: File;
  text: string;
}

export const analyzeABTest = async (variationA: ABTestVariation, variationB: ABTestVariation) => {
  const model = checkCreditsAndGetModel();

  const prompt = `Analyze these two content variations and provide a detailed, structured comparison:

Variation A:
${variationA.text}

Variation B:
${variationB.text}

Please provide a comprehensive analysis in the following format:

# WINNER DECLARATION
[Clearly state which variation performs better and why in one sentence]

# SCORING
## Variation A
Clarity: [Score out of 100]
Engagement: [Score out of 100]
Relevance: [Score out of 100]
Readability: [Score out of 100]
Overall Score: [Average of above scores]

## Variation B
Clarity: [Score out of 100]
Engagement: [Score out of 100]
Relevance: [Score out of 100]
Readability: [Score out of 100]
Overall Score: [Average of above scores]

### Strengths
- [List key strengths of the winning variation]
- [Add more strengths]

### Weaknesses
- [List areas where the winning variation could improve]
- [Add more weaknesses]

## Clarity Analysis
[Detailed analysis of clarity differences between variations]

## Tone Analysis
[Compare tone and voice between variations]

## Engagement Analysis
[Analysis of user engagement potential]

## CTA Analysis
[Compare call-to-action effectiveness]

# OPTIMIZATION RECOMMENDATIONS
- [Specific, actionable suggestion for improvement]
- [Another specific suggestion]
- [Additional suggestions as needed]

Please be specific and actionable in your analysis.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};