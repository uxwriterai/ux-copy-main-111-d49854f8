import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w");

interface LandingPageRequest {
  productName: string;
  industry: string;
  targetAudience: string;
  tone: string;
  uniqueSellingPoints: string;
  keyFeatures: string;
  additionalContext?: string;
}

export const generateLandingPageCopy = async (request: LandingPageRequest) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate comprehensive landing page copy for ${request.productName} with the following details:

Product/Service: ${request.productName}
Industry: ${request.industry}
Target Audience: ${request.targetAudience}
Tone: ${request.tone}
Unique Selling Points: ${request.uniqueSellingPoints}
Key Features: ${request.keyFeatures}
Additional Context: ${request.additionalContext || "N/A"}

Please generate copy for each section of the landing page. For each section, provide multiple variations that are clear, engaging, and optimized for conversion. The copy should maintain a ${request.tone.toLowerCase()} tone throughout.

Format the response in clear sections:

1. HERO SECTION
- Main headline (attention-grabbing, focuses on primary value proposition)
- Subheadline (expands on the value proposition)
- Primary CTA
- Secondary CTA (if applicable)

2. FEATURES & BENEFITS
- Section headline
- Feature-benefit pairs (what it is and why it matters)
- Supporting copy highlighting unique selling points

3. SOCIAL PROOF
- Testimonial templates
- Trust indicators
- Statistics or achievements

4. PRODUCT DETAILS
- Section headline
- Product/service description
- Technical specifications (if applicable)
- Pricing copy (if applicable)

5. FAQ SECTION
- Common questions and answers
- Objection handling

6. CALL TO ACTION SECTION
- Final CTA headline
- Supporting copy
- Button text variations

7. FOOTER
- Company tagline
- Contact section copy
- Copyright notice
- Newsletter signup copy (if applicable)

For each section, provide 2-3 variations of the main copy elements. Focus on:
- Clear value proposition
- Benefit-driven language
- Action-oriented phrases
- Emotional triggers
- Trust-building elements

Use the unique selling points and key features provided to create compelling, specific copy that resonates with the target audience.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response into sections
    const sections = response
      .split(/\d+\.\s+[A-Z\s&]+/)
      .slice(1) // Remove empty first element
      .map((section, index) => {
        const sectionTitles = [
          "Hero Section",
          "Features & Benefits",
          "Social Proof",
          "Product Details",
          "FAQ Section",
          "Call to Action",
          "Footer",
        ];
        
        return {
          title: sectionTitles[index],
          content: section
            .split(/[-•]/)
            .map(item => item.trim())
            .filter(item => item.length > 0),
        };
      });

    return sections;
  } catch (error) {
    console.error("Error generating landing page copy:", error);
    throw new Error("Failed to generate landing page copy");
  }
};