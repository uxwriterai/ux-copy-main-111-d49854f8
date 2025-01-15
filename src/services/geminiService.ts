import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w");

export const generateMicrocopy = async (
  elementType: string,
  context: string,
  tone: string,
  maxLength?: number,
  additionalNotes?: string
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate microcopy for a ${elementType} with the following details:
Context: ${context}
Tone: ${tone}
${maxLength ? `Maximum Length: ${maxLength} characters` : ''}
${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Please provide clear, concise, and effective microcopy that:
1. Is appropriate for the element type
2. Matches the specified tone
3. Considers the given context
4. Is user-friendly and accessible
5. ${maxLength ? `Stays within ${maxLength} characters` : 'Is concise'}

Return only the generated microcopy text, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating microcopy:", error);
    throw new Error("Failed to generate microcopy. Please try again.");
  }
};