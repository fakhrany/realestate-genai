import '@/styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Locale } from '@/lib/i18n/config';
export function generateStaticParams(){ return [{ locale:'en' }, { locale:'ar' }]; }
export default async function LocaleLayout({ children, params }:{ children: ReactNode; params:{ locale: Locale }}){
  const messages = await getMessages(); const dir = params.locale==='ar'?'rtl':'ltr';
  return (<html lang={params.locale} dir={dir}><body className="bg-[#FFFCF5] text-[#0B0B0B]"><NextIntlClientProvider messages={messages} locale={params.locale} timeZone="Africa/Cairo">{children}</NextIntlClientProvider></body></html>);
}
