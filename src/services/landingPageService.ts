import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCt-KOMsVnxcUToFVGpbAAgnusgEiyYS9w");

// Helper function to check credits before making API calls
const checkCreditsAndGetModel = () => {
  // Get credits context from sessionStorage and IP
  const ip = sessionStorage.getItem('current_ip');
  if (!ip) {
    throw new Error('IP address not found');
  }
  
  const credits = sessionStorage.getItem(`credits_${ip}`);
  const remainingCredits = credits ? parseInt(credits) : 0;
  
  if (remainingCredits <= 0) {
    throw new Error('No credits remaining');
  }
  
  // Reduce credits by 1
  sessionStorage.setItem(`credits_${ip}`, (remainingCredits - 1).toString());
  
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};

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
  const model = checkCreditsAndGetModel();

  const prompt = `Create landing page copy for ${request.productName} with the following details:

Product/Service: ${request.productName}
Industry: ${request.industry}
Target Audience: ${request.targetAudience}
Tone: ${request.tone}
Unique Selling Points: ${request.uniqueSellingPoints}
Key Features: ${request.keyFeatures}
Additional Context: ${request.additionalContext || "N/A"}

Generate clear, concise, and engaging copy for each section. The copy should be direct and focused on conversion. Format the response in clear sections:

1. HERO SECTION
- One powerful headline that captures the main value proposition
- One supporting subheadline that expands on the benefit
- One clear call-to-action

2. FEATURES & BENEFITS
- Three key features with their corresponding benefits
- Focus on how these solve user problems

3. SOCIAL PROOF
- One testimonial template
- Key statistics or achievements

4. PRODUCT DETAILS
- Clear product description
- Main technical specifications or service details
- Pricing statement (if applicable)

5. CALL TO ACTION
- Final compelling statement
- Action-oriented button text

Keep the copy concise, impactful, and focused on the value proposition. Use the ${request.tone.toLowerCase()} tone throughout.`;

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
          "Call to Action"
        ];
        
        return {
          title: sectionTitles[index],
          content: section
            .split(/[-•]/)
            .map(item => item.trim())
            .filter(item => item.length > 0)
        };
      });

    return sections;
  } catch (error) {
    console.error("Error generating landing page copy:", error);
    throw new Error("Failed to generate landing page copy");
  }
};