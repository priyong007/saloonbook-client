import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
// import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: {
    default: "SalonBook",
    template: "%s | SalonBook",
  },
  description: "Book salon and barber services near you.",
}

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            {/* <SiteHeader /> */}
            <main className="flex-1">
              {children}
              <Toaster/>
              </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
