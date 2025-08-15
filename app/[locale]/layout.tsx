// app/[locale]/layout.tsx
import type {ReactNode} from 'react';
import '../globals.css'; // <-- correct path (there is no ../styles/globals.css)

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export const metadata = {
  title: 'RealEstate GenAI',
  description: 'Perplexity-style real estate search'
};

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = params;

  // Load messages for the current locale (uses next-intl + your middleware)
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// Pre-generate the two locales
export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'ar'}];
}