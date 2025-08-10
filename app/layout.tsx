// app/layout.tsx
import '../styles/globals.css';

export const metadata = {
  title: 'RealEstate GenAI',
  description: 'Perplexity-style real estate search',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className="bg-[#FFFCF5] text-[#0B0B0B] antialiased">
        {children}
      </body>
    </html>
  );
}