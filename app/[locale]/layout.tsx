// app/[locale]/layout.tsx
import '../../styles/globals.css';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/request';

export const metadata = {
  title: 'RealEstate GenAI',
  description: 'Perplexity-style real estate search'
};

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: 'en' | 'ar' };
}) {
  const locale = params?.locale ?? 'en';
  const messages = await getMessages(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}