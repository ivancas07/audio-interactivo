import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Audio Interactivo",
  description: "Curso de diseño y desarrollo de audio interactivo",
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <Providers>
          <main className="flex-grow container mx-auto p-4 md:p-8">
            {children}
          </main>
          <footer className="p-4 border-t-2 border-current mt-12 text-center font-mono text-sm uppercase">
            Audio Interactivo
          </footer>
        </Providers>
      </body>
    </html>
  );
}
