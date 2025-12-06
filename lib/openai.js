import fetch from 'node-fetch'

const OPENAI_KEY = process.env.OPENAI_API_KEY

export async function generateScript(productTitle, productDesc) {
  const prompt = `You are a short-form TikTok/Reels copywriter. Given product title and description, create 3 short viral scripts (20-35s) with hook, body, CTA. Output JSON array. Title: ${productTitle}. Description: ${productDesc}`
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.8
    })
  })
  const j = await res.json()
  return j.choices?.[0]?.message?.content || ''
}

export async function generateTTS(text) {
  // MVP placeholder: return text for client-side TTS fallback.
  // Later we will replace this with OpenAI / ElevenLabs TTS call and return an audio URL.
  return { audio_url: null, text }
}
