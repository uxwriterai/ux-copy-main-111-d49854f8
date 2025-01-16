import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiApiKey } from "./creditsService";

let genAI: any = null;

async function initializeGenAI() {
  if (!genAI) {
    const apiKey = await getGeminiApiKey();
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export const generateMicrocopy = async (
  elementType: string,
  context: string,
  tone: string,
  maxLength?: number,
  additionalNotes?: string,
  customElementType?: string
) => {
  const model = (await initializeGenAI()).getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate 3 different variants of microcopy for a ${elementType === 'custom' ? customElementType : elementType} with the following details:
Context: ${context}
Tone: ${tone}
${maxLength ? `Maximum Length: ${maxLength} characters` : ''}
${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Please provide 3 clear, concise, and effective microcopy variants that:
1. Are appropriate for the element type
2. Match the specified tone
3. Consider the given context
4. Are user-friendly and accessible
5. ${maxLength ? `Stay within ${maxLength} characters` : 'Are concise'}

Format your response as a numbered list with exactly 3 variants, one per line:
1. [First variant]
2. [Second variant]
3. [Third variant]`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // Parse the response into separate variants
  const variants = response
    .split('\n')
    .filter(line => line.trim().match(/^\d\./))
    .map(line => line.replace(/^\d\.\s*/, '').trim());

  return variants;
};

export const analyzeABTest = async (variationA: any, variationB: any) => {
  const model = (await initializeGenAI()).getGenerativeModel({ model: "gemini-pro" });

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

export const improveCopy = async (inputText: string): Promise<string> => {
  console.log("Starting copy improvement for:", inputText);
  
  const model = (await initializeGenAI()).getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Improve the following copy to make it more engaging, clear, and effective while maintaining its core message:

${inputText}

Please provide one improved version that:
1. Enhances clarity and readability
2. Makes the message more compelling
3. Maintains the original tone and intent
4. Uses concise and impactful language

Return only the improved copy without any explanations or formatting.`;

  try {
    const result = await model.generateContent(prompt);
    const improvedText = result.response.text();
    console.log("Copy improvement completed:", improvedText);
    return improvedText;
  } catch (error) {
    console.error("Error improving copy:", error);
    throw error;
  }
};
