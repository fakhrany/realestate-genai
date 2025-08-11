// app/layout.tsx
import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'RealEstate GenAI',
  description: 'Perplexity-style real estate search'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="bg-[#FFFCF5] text-[#0B0B0B] antialiased">
        {children}
      </body>
    </html>
  );
}