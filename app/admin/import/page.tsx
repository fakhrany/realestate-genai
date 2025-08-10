'use client';
import { useRef, useState } from 'react'; import AdminShell from '@/components/admin/AdminShell'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { Button } from '@/components/ui/button';
export default function Page(){ const inputRef=useRef<HTMLInputElement|null>(null); const [result,setResult]=useState<string>('');
  async function handleFile(f:File){ const data=new FormData(); data.append('file', f); const res=await fetch('/api/import/units',{ method:'POST', body:data }); const json=await res.json(); setResult(JSON.stringify(json,null,2)); }
  return (<AdminShell><Card><CardHeader><CardTitle>Bulk CSV Import — Units</CardTitle></CardHeader><CardContent className="space-y-3">
    <div className="flex items-center gap-3"><input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) handleFile(f); }} /><Button onClick={()=>inputRef.current?.click()}>Choose CSV</Button><Button variant="secondary" asChild><a href="/examples/units-sample.csv" download>Download sample</a></Button></div>
    {result && <pre className="text-xs bg-white p-3 border border-amber-200 rounded max-h-80 overflow-auto">{result}</pre>}
    <p className="text-sm text-neutral-600">CSV headers: projectId,type,bedrooms,bathrooms,sizeSqm,priceEgp,priceUsd,currency,availability,floor,view</p>
  </CardContent></Card></AdminShell>); }
