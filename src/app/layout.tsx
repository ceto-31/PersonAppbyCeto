import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { THEME_INIT_SCRIPT } from "@/lib/theme-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Person App",
  description:
    "Full-stack Person CRUD app built with Next.js, Prisma & Postgres",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Default to light; the inline script below overrides BEFORE first paint.
      className={`theme-light ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <NavBar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
