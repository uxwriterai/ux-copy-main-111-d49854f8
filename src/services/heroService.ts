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

Context: ${formData.context}
Industry: ${formData.industry}
Brand Tone: ${formData.tone}
Primary Goal: ${formData.goal}
Target Audience: ${formData.targetAudience}
${formData.additionalNotes ? `Additional Notes: ${formData.additionalNotes}` : ''}

Guidelines for each variant:

HEADLINE (6-12 words):
- Must be clear, concise, and benefit-driven
- Focus on the primary value proposition
- Use emotional triggers when appropriate
- Avoid jargon or complex language
- Consider these formulas:
  * "Achieve [Desired Outcome] Without [Pain Point]"
  * "The [Adjective] Way to [Benefit]"
  * "Discover How to [Key Result] in [Timeframe]"

TAGLINE (10-15 words):
- Expand on the headline's promise
- Address specific pain points
- Include social proof or authority indicators when relevant
- Keep it actionable and solution-focused
- Must complement the headline without repeating it

CTA (2-5 words):
- Start with action verbs
- Create urgency or exclusivity
- Match the user's journey stage
- Be specific and value-focused
- Must be compelling and clear

Each variant should:
1. Be unique in approach but consistent in message
2. Match the specified brand tone
3. Speak directly to the target audience
4. Support the primary business goal
5. Be immediately clear and impactful

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