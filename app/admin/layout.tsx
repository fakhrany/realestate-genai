// app/admin/layout.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function AdminLayout(
  { children }: { children: ReactNode }
): Promise<JSX.Element> {
  const bypass = process.env.NEXTAUTH_DISABLED === 'true';

  // If bypassing auth, fake a minimal "session" object.
  const session = bypass
    ? ({ user: { role: 'staff' } } as any)
    : await getServerSession();

  if (!session) {
    redirect('/login');
  }

  // Explicitly return a JSX.Element to avoid TS recursive type issue.
  return <>{children}</>;
}