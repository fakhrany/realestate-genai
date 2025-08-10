'use client';
import { useState } from 'react'; import { signIn } from 'next-auth/react'; import { useTranslations } from 'next-intl';
export default function LoginPage(){ const t=useTranslations(); const [email,setEmail]=useState('staff@yourcompany.com'); const [password,setPassword]=useState('admin');
  return (<div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
    <div className="p-10 flex flex-col justify-center bg-[#FFFCF5]"><h1 className="font-serif text-5xl mb-3">{t('login.hero')}</h1><p className="text-neutral-700 text-lg">{t('login.sub')}</p></div>
    <div className="p-8 flex items-center justify-center bg-white"><div className="w-full max-w-sm rounded-2xl border border-amber-200 bg-[#FFFCF5] p-6 shadow-sm space-y-3">
      <button className="w-full bg-[#F59E0B] text-black rounded-xl px-4 py-2 text-sm" onClick={()=>signIn('credentials',{ email, password, callbackUrl:'/admin' })}>{t('login.google')}</button>
      <div className="my-2 text-center text-sm text-neutral-500">or</div>
      <div className="space-y-2"><input className="w-full border border-amber-200 rounded px-3 py-2 text-sm" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /><input className="w-full border border-amber-200 rounded px-3 py-2 text-sm" type="password" placeholder="password (admin)" value={password} onChange={e=>setPassword(e.target.value)} /><button className="w-full border border-amber-200 bg-white rounded-xl px-4 py-2 text-sm" onClick={()=>signIn('credentials',{ email, password, callbackUrl:'/admin' })}>{t('login.email')}</button></div>
    </div></div></div>);
}
