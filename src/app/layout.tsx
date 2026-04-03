import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  title: 'BRAIN HEALTH - AI Medical Diagnostic Assistant',
  description: 'Operation HELIX-FT | Professional diagnostic support platform for healthcare professionals',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A1628" />
      </head>
      <body className="bg-[#0A1628] text-[#E8F4FD]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
