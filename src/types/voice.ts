 export type Intent =
  | { type:'ANSWER'; text:string }
  | { type:'COMMAND'; name:'NEXT'|'REPEAT'|'HINT'|'CLOSE'|'HELP' }

export type VoiceEvents =
  | 'TRANSCRIPT_READY'
  | 'INTENT'
  | 'IDLE_TIMEOUT'
  | 'EXTRA_HELP_REQUESTED'
  | 'APP_CLOSE_REQUESTED'

export interface VoiceController {
  speak(text:string): Promise<void>
  listenOnce(timeoutMs?:number): Promise<string|null>
  on(ev:VoiceEvents, fn:(p:any)=>void): void
  off(ev:VoiceEvents, fn:(p:any)=>void): void
}