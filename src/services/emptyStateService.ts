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

  const prompt = `Generate 3 different variants of empty state copy for a ${elementType === 'custom' ? customElementType : elementType} with the following details:
Context: ${context}
Tone: ${tone}
${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Please provide 3 clear, concise, and effective empty state messages that:
1. Are appropriate for the element type
2. Match the specified tone
3. Consider the given context
4. Include a clear call-to-action when appropriate
5. Are user-friendly and empathetic
6. Help users understand why they're seeing an empty state
7. Guide users on what to do next

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