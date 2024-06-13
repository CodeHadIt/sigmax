import type { Metadata } from 'next';
import './global.css';
import localFont from 'next/font/local';
import Providers from './providers';
import { GoogleAnalytics } from '@next/third-parties/google'

const ibmFont = localFont({ src: '../fonts/ibm2.ttf' });

export const metadata: Metadata = {
  title: "OSX - Staking Terminal",
  description: "Welcome to the staking terminal.",
  icons: "/favicon.ico",
  openGraph: {
    url: "sitename",
    siteName: "sitename",
    type: "website",
    //edit previous 3 fields
    images: [
      {
        url: "/public/images/twittercard.png",
        secureUrl: "/public/images/twittercard.png",
        width: 1200,
        height: 630,
        alt: "OSX Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@OrdinalSigmaX",
    creator: "@OrdinalSigmaX",
    images: {
      url: "/public/images/twittercard.png",
      alt: "OSX Preview Image",
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
      {/* <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@OrdinalSigmaX" />
      <meta name="twitter:creator" content="@OrdinalSigmaX" />
      <meta name="twitter:title" content="RuneStake" />
      <meta name="twitter:description" content=" Stake Runes on Ordinals" />
      <meta name="twitter:image" content="/public/images/twittercard.png" /> */}
      <GoogleAnalytics gaId="G-N5B96BPFR1"></GoogleAnalytics>

      <body className={ibmFont.className}>
        <main className="container max-w-[1200px] pt-16">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
