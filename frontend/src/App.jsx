import React, { useState, useEffect, useRef } from 'react'

export default function App(){
  const [lang, setLang] = useState('en')
  const [messages, setMessages] = useState([
    {role:'bot', text: `Welcome to CampusConnect — choose a topic or ask anything!`, id:0}
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(()=>{ messagesEndRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages])

  async function sendMessage(text){
    if(!text) return
    const userMsg = {role:'user', text, id: Date.now()}
    setMessages(m=>[...m, userMsg])
    setInput('')
    setLoading(true)
    try{
      const resp = await fetch('/api/chat', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({message:text, lang})
      })
      const data = await resp.json()
      const botMsg = {role:'bot', text: data.reply || 'Sorry, could not fetch answer.' , id: Date.now()+1}
      setMessages(m=>[...m, botMsg])
    }catch(err){
      setMessages(m=>[...m, {role:'bot', text:'Error connecting to server.' , id:Date.now()}])
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-4 flex flex-col h-[80vh]">
        <div className="flex-1 overflow-y-auto p-2">
          {messages.map(m=>(
            <div key={m.id} className={m.role==='user'? 'text-right':'text-left'}>
              <div className={m.role==='user'?'bg-indigo-600 text-white inline-block p-2 rounded-lg m-1':'bg-slate-200 inline-block p-2 rounded-lg m-1'}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-2 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') sendMessage(input)}} className="flex-1 p-2 border rounded" placeholder="Ask CampusConnect..." />
          <button onClick={()=>sendMessage(input)} className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  )
}