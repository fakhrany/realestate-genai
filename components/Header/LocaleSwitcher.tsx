'use client';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/lib/i18n/config';
export default function LocaleSwitcher({ className='' }:{ className?:string }){
  const pathname=usePathname(); const router=useRouter();
  function switchLocale(){ const parts=pathname.split('/').filter(Boolean); const current=locales.includes(parts[0] as any)?(parts[0] as 'en'|'ar'):null; const next=current==='ar'?'en':'ar'; const rest=current?parts.slice(1):parts; const newPath=`/${next}/${rest.join('/')}`.replace(/\/$/,''); router.push(newPath||`/${next}`); }
  return <button onClick={switchLocale} className={`rounded-md border border-amber-200 bg-white px-3 py-1 text-xs ${className}`}>AR/EN</button>;
}
