import type { Metadata } from 'next';
import './global.css';
import localFont from 'next/font/local';
import Providers from './providers';
import { GoogleAnalytics } from '@next/third-parties/google'

const ibmFont = localFont({ src: '../fonts/ibm2.ttf' });

export const metadata: Metadata = {
  title: "RuneStake by OrdinalSigmaX",
  description: "Bitcoin's First On-Chain Runes Staking Solution",
  icons: "/favicon.ico",
  openGraph: {
    url: "sitename",
    siteName: "sitename",
    type: "website",
    //edit previous 3 fields
    title: "RuneStake by OrdinalSigmaX",
    description: "Bitcoin's First On-Chain Runes Staking Solution",
    images: [
      {
        url: "https://runestake.io/images/twittercard.png",
        secureUrl: "/public/images/twittercard.png",
        width: 1200,
        height: 630,
        alt: "RuneStake by OrdinalSigmaX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@OrdinalSigmaX",
    creator: "@OrdinalSigmaX",
    title: "RuneStake by OrdinalSigmaX",
    description: "Bitcoin's First On-Chain Runes Staking Solution",
    images: {
      url: "https://runestake.io/images/twittercard.png",
      alt: "RuneStake by OrdinalSigmaX",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scrollbar scrollbar-thumb-[#4446B1] scrollbar-track-transparent"
    >

      <GoogleAnalytics gaId="G-N5B96BPFR1"></GoogleAnalytics>

      <body className={ibmFont.className}>
        <main className="container max-w-[1200px] pt-16">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
