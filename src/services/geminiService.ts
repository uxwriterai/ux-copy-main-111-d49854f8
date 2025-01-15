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

    const prompt = `Analyze these two content variations and provide a detailed comparison:

Variation A:
${variationA.text}

Variation B:
${variationB.text}

Please evaluate both variations based on:
1. Clarity and Readability
2. Engagement and Appeal
3. Effectiveness for Target Audience
4. Call-to-Action Strength
5. Overall Impact

For each variation, provide:
1. A score out of 10 for each criterion
2. Specific strengths and weaknesses
3. Suggested improvements

Finally, recommend which variation is better and explain why.

Format your response in a clear, structured way with headings and bullet points.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error in analyzeABTest:", error);
    throw new Error("Failed to analyze A/B test variations");
  }
};
