import "./globals.css"

import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { baseUrl } from "@/lib/sitemap"
import { cn } from "@/lib/utils"
import { GameOfLifeLayout } from "@/components/game-of-life-layout"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "dclark.dev",
    template: "%s | dclark.dev",
  },
  description: "I'm Devin Clark. Web developer and tech enthusiast.",
  openGraph: {
    title: "dclark.dev",
    description: "I'm Devin Clark. Web developer and tech enthusiast.",
    url: baseUrl,
    siteName: "dclark.dev",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "A randomly generated Game of Life pattern with the text dclark.dev",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dclark.dev",
    description: "I'm Devin Clark. Web developer and tech enthusiast.",
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "text-black bg-white dark:text-white dark:bg-black",
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased">
        <main className="flex-auto min-w-0 flex flex-col">
          <GameOfLifeLayout>{children}</GameOfLifeLayout>
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
