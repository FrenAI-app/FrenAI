

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Efficient base64 conversion for large audio files
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192; // Process in smaller chunks
  let result = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    result += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(result);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice } = await req.json()

    console.log('TTS request received:', { text: text?.substring(0, 50) + '...', voice })

    if (!text) {
      throw new Error('Text is required')
    }

    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured')
    }

    // Use ElevenLabs API for high-quality voice
    const voiceId = getVoiceId(voice)
    console.log('Using voice ID:', voiceId)

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.7,
          style: 0.0,
          use_speaker_boost: true
        },
      }),
    })

    console.log('ElevenLabs response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('ElevenLabs API error:', errorData)
      throw new Error(`ElevenLabs API error: ${errorData}`)
    }

    // Convert audio buffer to base64 using efficient method
    const arrayBuffer = await response.arrayBuffer()
    const base64Audio = arrayBufferToBase64(arrayBuffer)

    console.log('Successfully generated audio, size:', arrayBuffer.byteLength)

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('TTS function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

// Helper function to get ElevenLabs voice ID based on name
function getVoiceId(voice: string = 'FrenDefault'): string {
  const voiceMap: Record<string, string> = {
    'FrenDefault': 'WAYsiv3Yudejrr5Di4lf', // New default voice
    'FrenOld': 'tVkOo4DLgZb89qB0x4qP', // Previous voice
    'Roger': 'CwhRBWXzGAHq8TQ4Fs17',
    'Aria': '9BWtsMINqrJLrRacOk9x',
    'Sarah': 'EXAVITQu4vr4xnSDxMaL',
    'Laura': 'FGY2WhTYpPnrIDTdsKH5',
    'Charlie': 'IKne3meq5aSn9XLyUdCD',
    'George': 'JBFqnCBsd6RMkjVDRZzb',
    'Callum': 'N2lVS1w4EtoT3dr4eOWO',
    'River': 'SAz9YHcvj6GT2YYXdXww',
    'Liam': 'TX3LPaxmHKxFdv7VOQHJ',
    'Charlotte': 'XB0fDUnXU5powFXDhCwa',
  }
  
  return voiceMap[voice] || voiceMap['FrenDefault'] // Default to new voice
}
