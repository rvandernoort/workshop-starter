import type { Metadata } from "next";
import { Geist_Mono, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { NavLinks } from "./_components/NavLinks";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["400"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HomeWizard",
  description: "Smart energy products for your home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${poppins.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="w-full bg-hw-header text-hw-off-white">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
            <span className="font-display text-lg font-semibold tracking-tight">
              Home<span className="hw-gradient-text">Wizard</span>
            </span>
            <NavLinks />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
