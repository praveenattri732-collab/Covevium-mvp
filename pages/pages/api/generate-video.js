import { generateScript, generateTTS } from '../../lib/openai'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { productUrl, userEmail } = req.body
    let title = productUrl
    let desc = ''
    try {
      const resp = await fetch(productUrl)
      const html = await resp.text()
      const mTitle = html.match(/<title>(.*?)<\/title>/i)
      title = mTitle ? mTitle[1] : productUrl
      const mDesc = html.match(/<meta name="description" content="(.*?)"/i)
      desc = mDesc ? mDesc[1] : ''
    } catch(e) {}
    // add small randomness to prompt to ensure slight uniqueness each run
    const tone = ['energetic','casual','dramatic'][Math.floor(Math.random()*3)]
    const scriptRaw = await generateScript(`${title} (tone: ${tone})`, desc)
    const tts = await generateTTS(scriptRaw)
    const { data, error } = await supabase.from('videos').insert([{
      user_email: userEmail,
      product_url: productUrl,
      script_text: scriptRaw,
      audio_url: tts.audio_url,
      video_url: null,
      status: 'ready'
    }]).select().single()
    const placeholderVideo = process.env.PLACEHOLDER_VIDEO_URL || 'https://filesamples.com/samples/video/mp4/sample_640x360.mp4'
    await supabase.from('videos').update({ video_url: placeholderVideo, status: 'done' }).eq('id', data.id)
    res.status(200).json({ success: true, id: data.id, script: scriptRaw, audio_url: tts.audio_url, video_url: placeholderVideo })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
}
