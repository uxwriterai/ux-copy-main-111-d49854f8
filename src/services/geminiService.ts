import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w");

export const generateMicrocopy = async (
  elementType: string,
  context: string,
  tone: string,
  maxLength?: number,
  additionalNotes?: string,
  customElementType?: string
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
  } catch (error) {
    console.error("Error generating microcopy:", error);
    throw new Error("Failed to generate microcopy. Please try again.");
  }
};

interface ABTestVariation {
  image?: File;
  text: string;
}

export const analyzeABTest = async (variationA: ABTestVariation, variationB: ABTestVariation) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze these two content variations and provide a detailed, structured comparison:

Variation A:
${variationA.text}

Variation B:
${variationB.text}

Please provide a comprehensive analysis in the following format:

# WINNER DECLARATION
[Clearly state which variation performs better and why in one sentence]

# SCORING (Out of 100)
## Variation A
- Clarity: [Score]
- Engagement: [Score]
- Relevance: [Score]
- Readability: [Score]
- Overall Score: [Average of above scores]

## Variation B
- Clarity: [Score]
- Engagement: [Score]
- Relevance: [Score]
- Readability: [Score]
- Overall Score: [Average of above scores]

# DETAILED COMPARISON
## Clarity
[Compare how clear and understandable each variation is]

## Tone & Voice
[Compare the tone and voice of each variation]

## User Engagement
[Analyze which variation is more likely to engage users]

## Call-to-Action Effectiveness
[Compare the effectiveness of any calls to action]

# STRENGTHS
## Variation A
- [Bullet points of strengths]

## Variation B
- [Bullet points of strengths]

# AREAS FOR IMPROVEMENT
## Variation A
- [Specific suggestions for improvement]

## Variation B
- [Specific suggestions for improvement]

# OPTIMIZATION RECOMMENDATIONS
[3-5 actionable recommendations to improve the winning variation further]

Please format the response in a clear, structured way using markdown headings and bullet points.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error in analyzeABTest:", error);
    throw new Error("Failed to analyze A/B test variations");
  }
};