import type { Metadata } from "next";
import "./global.css";
import localFont from "next/font/local";
import WalletConnectContextProvider from "@/contexts/WalletConnectContext";

const ibmFont = localFont({ src: "../fonts/ibm2.ttf" });

export const metadata: Metadata = {
  title: "OSX - Staking Terminal",
  description: "Welcome to the staking terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="scrollbar scrollbar-thumb-[#4446B1] scrollbar-track-transparent">
      <body className={ibmFont.className}>
        <WalletConnectContextProvider>
          <main className="container max-w-[1200px] pt-16">{children}</main>
        </WalletConnectContextProvider>
      </body>
    </html>
  );
}
