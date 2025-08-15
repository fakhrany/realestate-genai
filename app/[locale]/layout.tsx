// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: 'en' | 'ar' };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  // Apply RTL visually for Arabic without touching the root <html>
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>{children}</div>
    </NextIntlClientProvider>
  );
}