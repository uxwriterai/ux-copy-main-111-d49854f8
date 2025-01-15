import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w");

interface HeroCopyVariant {
  headline: string;
  tagline: string;
  cta: string;
}

export const generateHeroCopy = async (formData: any): Promise<HeroCopyVariant[]> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Create 3 compelling hero section copy variants based on the following details:

CONTEXT ANALYSIS:
Industry: ${formData.industry}
Target Audience: ${formData.targetAudience}
Brand Tone: ${formData.tone}
Primary Goal: ${formData.goal}
Context Details: ${formData.context}
${formData.additionalNotes ? `Additional Requirements: ${formData.additionalNotes}` : ''}

Format your response exactly like this, with no markdown formatting:
Variant 1
Headline: [Headline text]
Tagline: [Tagline text]
CTA: [CTA text]

Variant 2
Headline: [Headline text]
Tagline: [Tagline text]
CTA: [CTA text]

Variant 3
Headline: [Headline text]
Tagline: [Tagline text]
CTA: [CTA text]`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response into separate variants
    const variants = response
      .split(/Variant \d+/)
      .filter(block => block.trim())
      .map(block => {
        const lines = block.trim().split('\n');
        const headlineMatch = lines[0].match(/Headline:\s*(.*)/);
        const taglineMatch = lines[1].match(/Tagline:\s*(.*)/);
        const ctaMatch = lines[2].match(/CTA:\s*(.*)/);
        
        return {
          headline: headlineMatch ? headlineMatch[1].trim() : '',
          tagline: taglineMatch ? taglineMatch[1].trim() : '',
          cta: ctaMatch ? ctaMatch[1].trim() : '',
        };
      });

    return variants;
  } catch (error) {
    console.error("Error in generateHeroCopy:", error);
    throw error;
  }
};