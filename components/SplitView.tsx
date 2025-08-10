'use client';
import { useState } from 'react';
import { ChatPane } from '@/components/chat/ChatPane';
import InteractiveMap, { Pin } from '@/components/map/InteractiveMap';
import LocaleSwitcher from '@/components/Header/LocaleSwitcher';
export type AssistantPayload={ title:string; text:string; sources?:{ id:number; title:string }[] }; export type Msg={ role:'user'|'assistant'; content:string|AssistantPayload };
export default function SplitView({ locale }:{ locale:'en'|'ar' }){
  const [messages,setMessages]=useState<Msg[]>([]); const [pins,setPins]=useState<Pin[]>([]);
  async function handleSend(question:string, loc:string){ const userMsg:Msg={ role:'user', content:question }; setMessages(prev=>[...prev, userMsg]); const res=await fetch('/api/chat',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages:[...messages,userMsg], locale: loc })}); const data=await res.json(); const assistantMsg:Msg={ role:'assistant', content:data.answer as any }; setMessages(prev=>[...prev, assistantMsg]); setPins((data.pins as Pin[])||[]); }
  return (<div className="h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-[#FFFCF5]"><div className="h-full border-r border-amber-200"><div className="flex items-center justify-between p-4"><h1 className="text-xl font-semibold">{locale==='ar'?'ابحث عن مكانك':'Find your place'}</h1><LocaleSwitcher /></div><ChatPane messages={messages} onSend={handleSend} controlledLocale={locale} /></div><div className="h-full"><InteractiveMap pins={pins} /></div></div>);
}
