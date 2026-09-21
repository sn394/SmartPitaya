import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, plantPart } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing ${plantPart} image for disease detection...`);

    const systemPrompt = `You are an expert agricultural AI specializing in dragon fruit (pitaya) plant disease detection. Analyze the provided image and identify any diseases or health issues.

Your response must be a valid JSON object with this exact structure:
{
  "isHealthy": boolean,
  "disease": string (disease name if detected, "Healthy" if no disease),
  "confidence": number (0-100),
  "severity": string ("None" | "Low" | "Moderate" | "High" | "Severe"),
  "symptoms": string[] (list of observed symptoms),
  "treatment": string[] (treatment steps if diseased),
  "prevention": string[] (prevention guidelines)
}

Common dragon fruit diseases include:
- Anthracnose (dark spots, sunken lesions)
- Stem rot (soft, water-soaked areas)
- Bacterial soft rot (foul smell, mushy tissue)
- Sunburn (bleached areas, dry patches)
- Cactus virus X (mottled patterns, stunted growth)
- Scale insects (white/brown bumps on stems)
- Mealybugs (white cottony masses)

If the image is not of a dragon fruit plant or is unclear, still provide your best assessment with lower confidence.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this dragon fruit ${plantPart.toLowerCase()} image for any diseases or health issues. Provide a detailed diagnosis in JSON format.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received successfully");
    
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No analysis result received" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON from the response (handle markdown code blocks)
    let result;
    try {
      // Remove markdown code blocks if present
      let jsonString = content;
      if (content.includes("```json")) {
        jsonString = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (content.includes("```")) {
        jsonString = content.replace(/```\n?/g, "");
      }
      result = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      // Return a fallback response
      result = {
        isHealthy: false,
        disease: "Analysis Inconclusive",
        confidence: 50,
        severity: "Unknown",
        symptoms: ["Unable to parse detailed analysis"],
        treatment: ["Please try again with a clearer image"],
        prevention: ["Ensure good image quality for accurate diagnosis"]
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-plant-disease function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
