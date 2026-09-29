
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HeaderConditional } from "@/components/custom/HeaderConditional";
import { Toaster } from "@/components/ui/sonner";
import { ThemeColor } from "@/components/custom/ThemeColor";
import { AccentProvider } from "@/components/custom/AccentProvider";
import { SITE_URL } from "@/constants";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lf = localFont({
  src:'../public/fonts/Virgil.woff2',
  variable:'--font-lf'
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    types: { "text/plain": [{ url: "/llms.txt", title: "LLM-readable profile" }] },
  },
  title: "< rudra >",
  description: "Rudra | Software Developer | Cyber Security Enthusiast | ML Enthusiast | Open-Source Contributor",
  other:{
    'Content-Security-Policy':"default-src 'self'; script-src 'none'; sandbox;"
  },
  openGraph:{
    title:"< rudra >",
    description: "Rudra | Software Developer | Cyber Security Enthusiast | ML Enthusiast | Open-Source Contributor",
    type:"website",
    siteName:"itz rudra",
    images:[
      {
        url:"/assets/preview.png",
        width:1200,
        height:630,
        alt:"< rudra >",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lf.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccentProvider>
            <ThemeColor />
            <HeaderConditional />
            {children}
            <Toaster />
          </AccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
