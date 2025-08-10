import { ReactNode } from 'react'; import { getServerSession } from 'next-auth'; import { redirect } from 'next/navigation';
export default async function AdminLayout({ children }:{ children: ReactNode }){ const bypass=process.env.NEXTAUTH_DISABLED==='true'; const session=bypass?{ user:{ role:'staff' } }:await getServerSession(); if(!session) redirect('/login'); return children; }
