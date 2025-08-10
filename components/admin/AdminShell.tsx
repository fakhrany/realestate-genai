'use client';
import { PropsWithChildren } from 'react'; import Link from 'next/link'; import { Button } from '@/components/ui/button';
export default function AdminShell({ children }: PropsWithChildren){ return (<div className="min-h-screen bg-[#FFFCF5]">
  <header className="border-b border-amber-200 bg-white/70"><div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3"><h1 className="text-lg font-semibold">Admin</h1>
    <nav className="flex gap-2 text-sm"><Button variant="outline" asChild><Link href="/admin/developers">Developers</Link></Button><Button variant="outline" asChild><Link href="/admin/projects">Projects</Link></Button><Button variant="outline" asChild><Link href="/admin/units">Units</Link></Button><Button variant="outline" asChild><Link href="/admin/import">CSV Import</Link></Button></nav>
  </div></header><main className="mx-auto max-w-6xl p-6 space-y-6">{children}</main></div>); }
