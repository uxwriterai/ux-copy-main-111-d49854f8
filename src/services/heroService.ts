import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w");

interface HeroCopyVariant {
  headline: string;
  tagline: string;
  cta: string;
}

export const generateHeroCopy = async (formData: any): Promise<HeroCopyVariant[]> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate 3 different variants of hero section copy with the following details:
Context: ${formData.context}
Industry: ${formData.industry}
Brand Tone: ${formData.tone}
Primary Goal: ${formData.goal}
Target Audience: ${formData.targetAudience}
${formData.additionalNotes ? `Additional Notes: ${formData.additionalNotes}` : ''}

For each variant, please provide:
1. A bold, attention-grabbing headline (max 10 words)
2. A supporting tagline that expands on the value proposition (max 15 words)
3. A clear, action-oriented CTA (max 5 words)

Please ensure each variant:
1. Aligns with the specified brand tone
2. Addresses the target audience effectively
3. Supports the primary goal
4. Is concise and impactful
5. Uses powerful and emotionally engaging language

Format your response exactly like this, without any asterisks or other formatting:
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
    console.log("Raw AI response:", response);
    
    // Parse the response into separate variants
    const variants = response
      .replace(/\*\*/g, '') // Remove any asterisks
      .split(/Variant \d+/)  // Split by "Variant X" pattern
      .filter(block => block.trim()) // Remove empty blocks
      .map(block => {
        const lines = block.trim().split('\n');
        return {
          headline: lines[0].replace('Headline:', '').trim(),
          tagline: lines[1].replace('Tagline:', '').trim(),
          cta: lines[2].replace('CTA:', '').trim(),
        };
      });

    console.log("Parsed variants:", variants);
    return variants;
  } catch (error) {
    console.error("Error in generateHeroCopy:", error);
    throw error;
  }
};