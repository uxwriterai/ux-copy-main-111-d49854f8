import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w");

export const generateEmptyState = async (
  elementType: string,
  context: string,
  tone: string,
  customElementType?: string,
  additionalNotes?: string,
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate 3 different pairs of empty state messages and CTAs for a ${elementType === 'custom' ? customElementType : elementType} with the following details:
Context: ${context}
Tone: ${tone}
${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Please provide 3 pairs of empty state messages and their corresponding CTAs that:
1. Are appropriate for the element type
2. Match the specified tone
3. Consider the given context
4. Are user-friendly and empathetic
5. Help users understand why they're seeing an empty state
6. Guide users on what to do next

Format your response as a numbered list with exactly 3 pairs, one per line:
1. Message: [First message] | CTA: [First CTA]
2. Message: [Second message] | CTA: [Second CTA]
3. Message: [Third message] | CTA: [Third CTA]`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // Parse the response into separate variants with messages and CTAs
  const variants = response
    .split('\n')
    .filter(line => line.trim().match(/^\d\./))
    .map(line => {
      const [message, cta] = line
        .replace(/^\d\.\s*/, '')
        .split('|')
        .map(part => {
          return part
            .replace(/Message:\s*/, '')
            .replace(/CTA:\s*/, '')
            .trim();
        });
      return { message, cta };
    });

  return variants;
};