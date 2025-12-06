import { useState } from 'react'

export default function Dashboard(){
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [resp, setResp] = useState(null)
  const generate = async ()=>{
    setResp({loading:true})
    const r = await fetch('/api/generate-video', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ productUrl: url, userEmail: email })
    })
    const j = await r.json()
    setResp(j)
  }
  return (
    <div style={{padding:30}}>
      <h2>Coevium — Create Video</h2>
      <input placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
      <br /><br />
      <input placeholder="Product URL" value={url} onChange={e=>setUrl(e.target.value)} style={{width:'60%'}} />
      <button onClick={generate}>Generate</button>

      <div style={{marginTop:20}}>
        {resp?.loading && <div>Generating…</div>}
        {resp?.script && <>
          <h3>Script (AI)</h3>
          <pre style={{whiteSpace:'pre-wrap'}}>{resp.script}</pre>
          <h3>Demo Video</h3>
          <video src={resp.video_url} controls width={360} />
        </>}
      </div>
    </div>
  )
}
