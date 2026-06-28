import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import IntroProvider from '@/components/providers/IntroProvider';
import LenisProvider from '@/components/providers/LenisProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const baseUrl = 'https://ayushpandey.dev';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Ayush Pandey | Full Stack Engineer',
    template: '%s | Ayush Pandey',
  },
  description:
    'Full Stack Engineer. Building products that matter. Specializing in Next.js, TypeScript, and distributed systems.',
  keywords: [
    'Ayush Pandey',
    'Full Stack Engineer',
    'Next.js Developer',
    'TypeScript',
    'Web Development',
    'Software Engineer',
  ],
  authors: [{ name: 'Ayush Pandey' }],
  creator: 'Ayush Pandey',
  openGraph: {
    title: 'Ayush Pandey | Full Stack Engineer',
    description:
      'Full Stack Engineer. Building products that matter.',
    url: baseUrl,
    siteName: 'Ayush Pandey Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayush Pandey | Full Stack Engineer',
    description:
      'Full Stack Engineer. Building products that matter.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ayush Pandey',
  url: baseUrl,
  jobTitle: 'Full Stack Engineer',
  knowsAbout: [
    'Full Stack Engineering',
    'Artificial Intelligence',
    'Next.js',
    'TypeScript',
    'React',
    'Node.js',
    'Distributed Systems',
  ],
  sameAs: [
    'https://github.com/AyushPandey218',
    'https://linkedin.com/in/ayushpandey0618',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-black text-white antialiased selection:bg-accent/30 selection:text-white">
        <LenisProvider>
          <IntroProvider>{children}</IntroProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
