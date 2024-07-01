import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';
import PlausibleProvider from 'next-plausible';

const inter = Inter({ subsets: ['latin'] });

let title = 'AceGPT - Generate Practice Exams';
let description =
  "Have an upcoming test? Input or paste your problems and we'll make it easier or harder for you! It's that simple.";
let url = 'https://www.acegpt.io';
let ogimage = '/acegptlogo.svg';
let sitename = 'acegpt.io';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: '/acegptlogo.svg', // Update this line with the provided icon
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/next.svg" type="image/svg+xml" />{' '}
        {/* Update the icon link */}
        <PlausibleProvider domain="acegpt.io" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
