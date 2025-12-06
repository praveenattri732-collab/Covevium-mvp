import Link from 'next/link'
export default function Home(){
  return (
    <div style={{fontFamily:'Inter, sans-serif', padding:40}}>
      <h1>Coevium — Create viral videos from product links</h1>
      <p>Fast MVP — Signup, paste product link, get AI script + demo video</p>
      <Link href="/dashboard"><button>Go to Dashboard</button></Link>
    </div>
  )
}
