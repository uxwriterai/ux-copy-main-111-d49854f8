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

Format your response as exactly 3 variants, with each variant containing a headline, tagline, and CTA, like this:
Variant 1:
Headline: [Headline text]
Tagline: [Tagline text]
CTA: [CTA text]

Variant 2:
Headline: [Headline text]
Tagline: [Tagline text]
CTA: [CTA text]

Variant 3:
Headline: [Headline text]
Tagline: [Tagline text]
CTA: [CTA text]`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log("Raw AI response:", response); // Debug log
    
    // Parse the response into separate variants
    const variants = response.split('\n\n')
      .filter(block => block.trim().startsWith('Variant'))
      .map(block => {
        const lines = block.split('\n');
        return {
          headline: lines[1].replace('Headline: ', '').trim(),
          tagline: lines[2].replace('Tagline: ', '').trim(),
          cta: lines[3].replace('CTA: ', '').trim(),
        };
      });

    console.log("Parsed variants:", variants); // Debug log
    return variants;
  } catch (error) {
    console.error("Error in generateHeroCopy:", error);
    throw error;
  }
};