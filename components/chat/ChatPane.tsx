'use client';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button'; import { Input } from '@/components/ui/input';
type AssistantPayload={ title:string; text:string; sources?:{ id:number; title:string }[] }; export type Msg={ role:'user'|'assistant'; content:string|AssistantPayload };
export function ChatPane({ messages, onSend, controlledLocale, showLocaleSelector=false }:{ messages:Msg[]; onSend:(q:string, locale:string)=>void; controlledLocale?:'en'|'ar'; showLocaleSelector?:boolean; }){
  const [input,setInput]=useState(''); const [internalLocale,setInternalLocale]=useState<'en'|'ar'>('en');
  const locale=controlledLocale ?? internalLocale; const dir=locale==='ar'?'rtl':'ltr'; const placeholder=useMemo(()=> locale==='ar'?'اسأل عن المطورين أو المشاريع أو الوحدات…':'Ask anything about developers, projects, or units…',[locale]);
  return (<div className="flex flex-col h-full" style={{direction:dir}}>
    <div className="flex items-center justify-between p-2 border-b border-amber-200 bg-white/60"><div className="text-xs text-neutral-600">{locale==='ar'?'عربي (RTL)':'English (LTR)'}</div>
      {showLocaleSelector && !controlledLocale && (<select value={internalLocale} onChange={(e)=>setInternalLocale(e.target.value as any)} className="border border-amber-200 rounded px-2 py-1 text-sm bg-white"><option value="en">EN</option><option value="ar">AR</option></select>)}
    </div>
    <div className="flex-1 overflow-auto p-4 space-y-4">{messages.map((m,idx)=>(<div key={idx} className={m.role==='user'?'text-right':'text-left'}>
      {m.role==='user'?(<div className="inline-block px-4 py-2 rounded-xl bg-amber-100 max-w-[80%]">{m.content as string}</div>):(<div className="inline-block px-4 py-3 rounded-xl bg-white border border-amber-200 max-w-[90%]">
        {typeof m.content!=='string' && (<><div className="flex items-center justify-between gap-3"><h4 className="font-semibold text-sm md:text-base">{m.content.title}</h4><div className="flex items-center gap-1 rtl:space-x-reverse">{(m.content.sources||[]).map((s,i)=>(<span key={i} className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-amber-300 bg-[#FFFCF5] text-xs">[{i+1}]</span>))}</div></div>
        <p className="mt-2 text-sm text-neutral-700">{m.content.text}</p><details className="mt-2"><summary className="cursor-pointer text-sm underline">{locale==='ar'?'المصادر':'Sources'}</summary><ul className="mt-1 list-disc list-inside text-sm text-neutral-600">{(m.content.sources||[]).map((s,i)=>(<li key={i}>[{i+1}] {s.title}</li>))}</ul></details></>)}</div>)}</div>))}</div>
    <form onSubmit={(e)=>{ e.preventDefault(); if(!input.trim()) return; onSend(input, locale); setInput(''); }} className="flex p-4 border-t border-amber-200 gap-2 bg-white/60"><Input value={input} onChange={(e)=>setInput(e.target.value)} placeholder={placeholder} className="flex-1" /><Button type="submit">{locale==='ar'?'إرسال':'Send'}</Button></form>
  </div>);
}
