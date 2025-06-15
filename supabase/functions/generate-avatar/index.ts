
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, style } = await req.json()
    
    if (!prompt) {
      throw new Error('No prompt provided')
    }

    // Enhanced prompt validation
    if (prompt.trim().length < 10) {
      throw new Error('Please provide a more detailed description (at least 10 characters)')
    }

    // Check for nonsensical prompts
    const words = prompt.trim().split(/\s+/)
    if (words.length < 3) {
      throw new Error('Please provide a more detailed description with at least 3 words')
    }

    // Check for potentially problematic short prompts that xAI might reject
    const shortProblematicPhrases = ['generate', 'create', 'make', 'fren', 'space fren']
    const trimmedPrompt = prompt.trim().toLowerCase()
    if (shortProblematicPhrases.some(phrase => trimmedPrompt === phrase || trimmedPrompt === `generate ${phrase}` || trimmedPrompt === `create ${phrase}`)) {
      throw new Error('Please provide a more specific description. For example: "A friendly space explorer duck wearing a shiny astronaut helmet with golden feathers and a bright smile"')
    }

    // Base duck characteristics from the reference image
    const baseDuckStyle = 'cute cartoon duck character with bright yellow body, large friendly black eyes with white highlights, orange beak, small orange webbed feet, cheerful expression, simple clean art style'
    
    let detailedPrompt = ''
    
    if (style === 'pixel') {
      detailedPrompt = `Create a pixel art style avatar featuring a ${baseDuckStyle}, incorporating these specific features: ${prompt}. Style: 16-bit pixel art, limited color palette, clear pixel edges, retro game character aesthetic, blocky but recognizable features.`
    } else if (style === 'anime') {
      detailedPrompt = `Create an anime-style character avatar featuring a ${baseDuckStyle}, incorporating these specific features: ${prompt}. Style: anime art style, large expressive eyes, vibrant colors, clean lines, cute kawaii appearance, detailed shading.`
    } else if (style === 'realistic') {
      detailedPrompt = `Create a semi-realistic digital art avatar featuring a ${baseDuckStyle}, incorporating these specific features: ${prompt}. Style: detailed digital illustration, natural lighting, professional art quality while maintaining cute cartoon appeal.`
    } else {
      // Default style
      detailedPrompt = `Create a cute cartoon avatar featuring a ${baseDuckStyle}, incorporating these specific features: ${prompt}. Style: vibrant colors, high contrast, friendly appearance, clean digital art illustration.`
    }

    // Check if XAI_API_KEY is available
    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    if (!xaiApiKey) {
      throw new Error('xAI API key not configured. Please contact support.')
    }

    console.log('Calling xAI API with enhanced prompt:', detailedPrompt);

    // Call xAI's image generation API with only supported parameters
    const response = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${xaiApiKey}`,
      },
      body: JSON.stringify({
        model: "flux-1.1-pro",
        prompt: detailedPrompt,
        response_format: "b64_json"
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('xAI API error:', response.status, errorData);
      
      // Provide user-friendly error messages based on xAI's response
      if (response.status === 400) {
        if (errorData?.error?.type === 'image_generation_user_error') {
          throw new Error('Your description needs to be more specific and detailed. Please describe exactly what you want your avatar to look like, including colors, clothing, accessories, and personality traits.')
        }
        throw new Error('Invalid request. Please try a more detailed and specific description.')
      } else if (response.status === 401) {
        throw new Error('API authentication failed. Please contact support.')
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.')
      } else if (response.status >= 500) {
        throw new Error('xAI service is temporarily unavailable. Please try again later.')
      } else {
        throw new Error(`Image generation failed (${response.status}). Please try again with a more detailed description.`)
      }
    }

    const data = await response.json()
    
    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response from image generation service. Please try again.')
    }
    
    // Return the base64 encoded image data
    return new Response(
      JSON.stringify({ 
        image: `data:image/png;base64,${data.data[0].b64_json}`,
        prompt: detailedPrompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating avatar:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
