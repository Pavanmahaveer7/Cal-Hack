'use client'
import React, {createContext, useContext, useRef, useState} from 'react'
import type { VoiceController, VoiceEvents, Intent } from '@/types/voice'

const Ctx = createContext<VoiceController | null>(null)
export const useVoice = () => {
  const ctx = useContext(Ctx); if(!ctx) throw new Error('VoiceProvider missing'); return ctx
}

function toIntent(text:string): Intent {
  const t = text.toLowerCase().trim()
  if (/^(next|skip|go on)$/.test(t)) return {type:'COMMAND', name:'NEXT'}
  if (/^(hint|help)$/.test(t))      return {type:'COMMAND', name:'HINT'}
  if (/^(repeat|again)$/.test(t))   return {type:'COMMAND', name:'REPEAT'}
  if (/^(close|exit|quit)$/.test(t))return {type:'COMMAND', name:'CLOSE'}
  if (/reason(ing)?|extra help/.test(t)) return {type:'COMMAND', name:'HELP'}
  return {type:'ANSWER', text}
}

export default function VoiceProviderMock({children}:{children:React.ReactNode}) {
  const handlers = useRef<Record<VoiceEvents, ((p:any)=>void)[]>>({
    TRANSCRIPT_READY:[], INTENT:[], IDLE_TIMEOUT:[], EXTRA_HELP_REQUESTED:[], APP_CLOSE_REQUESTED:[]
  })
  const [lastSpoken, setLastSpoken] = useState<string>('')

  const api: VoiceController = {
    async speak(text){ setLastSpoken(text); /* no-op in mock */ },
    async listenOnce(){ return new Promise(res=>{
      // mock: resolve when user types in the floating input
      const listener = (e:CustomEvent) => { res(String(e.detail || '')); window.removeEventListener('mock-voice', listener as any) }
      window.addEventListener('mock-voice', listener as any)
    })},
    on(ev, fn){ handlers.current[ev].push(fn) },
    off(ev, fn){ handlers.current[ev] = handlers.current[ev].filter(h=>h!==fn) }
  }

  // Expose a tiny overlay for quick manual input
  return (
    <Ctx.Provider value={api}>
      {children}
      <div style={{position:'fixed',bottom:12,right:12,background:'#111',color:'#fff',padding:12,borderRadius:12}}>
        <div style={{fontSize:12,opacity:.7}}>Mock Voice</div>
        <div style={{maxWidth:260,whiteSpace:'pre-wrap'}}>{lastSpoken}</div>
        <input aria-label="Mock transcript" placeholder="type transcript and press Enter"
          onKeyDown={(e)=>{ if(e.key==='Enter'){ const text=(e.target as HTMLInputElement).value; (e.target as HTMLInputElement).value=''
            const intent = toIntent(text)
            handlers.current.TRANSCRIPT_READY.forEach(h=>h(text))
            handlers.current.INTENT.forEach(h=>h(intent))
            window.dispatchEvent(new CustomEvent('mock-voice', {detail:text}))
          }}}
          style={{marginTop:8,width:'100%',color:'#000'}} />
      </div>
    </Ctx.Provider>
  )
}
