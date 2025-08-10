'use client';
import { useEffect, useState } from 'react'; import AdminShell from '@/components/admin/AdminShell'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { Button } from '@/components/ui/button'; import { Input } from '@/components/ui/input'; import { z } from 'zod'; import { useForm } from 'react-hook-form'; import { zodResolver } from '@hookform/resolvers/zod';
const DevSchema=z.object({ name:z.string().min(1), logo:z.string().url().optional().or(z.literal('')), country:z.string().optional(), website:z.string().url().optional().or(z.literal('')) }); type Dev=z.infer<typeof DevSchema>&{ id?:string }; enum Loading{ Idle, Submitting }
export default function Page(){ const [items,setItems]=useState<Dev[]>([]); const [loading,setLoading]=useState<Loading>(Loading.Idle); const form=useForm<Dev>({ resolver:zodResolver(DevSchema), defaultValues:{ name:'' } });
  async function load(){ setItems(await fetch('/api/developers').then(r=>r.json())); } useEffect(()=>{ load(); },[]);
  async function onSubmit(values:Dev){ setLoading(Loading.Submitting); await fetch('/api/developers',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(values)}); form.reset({ name:'' }); await load(); setLoading(Loading.Idle); }
  async function remove(id?:string){ if(!id) return; await fetch(`/api/developers/${id}`,{ method:'DELETE' }); await load(); }
  return (<AdminShell><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card><CardHeader><CardTitle>Add Developer</CardTitle></CardHeader><CardContent className="space-y-3"><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Input placeholder="Name" {...form.register('name')} /><Input placeholder="Logo URL (optional)" {...form.register('logo')} /><Input placeholder="Country (optional)" {...form.register('country')} /><Input placeholder="Website (optional)" {...form.register('website')} />
      <Button type="submit" disabled={loading===Loading.Submitting}>{loading===Loading.Submitting?'Adding…':'Add Developer'}</Button></form></CardContent></Card>
    <Card><CardHeader><CardTitle>All Developers</CardTitle></CardHeader><CardContent><div className="divide-y">{items.map(d=>(<div key={d.id} className="py-3 flex items-center justify-between"><div><div className="font-medium">{d.name}</div><div className="text-xs text-neutral-600">{d.website||'—'}</div></div><Button variant="destructive" onClick={()=>remove(d.id)}>Delete</Button></div>))}</div></CardContent></Card>
  </div></AdminShell>); }
