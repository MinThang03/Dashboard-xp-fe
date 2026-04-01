import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Grotesk, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const officerSans = Space_Grotesk({ subsets: ["latin"], variable: '--font-officer' });
const officerDisplay = Fraunces({ subsets: ["latin"], variable: '--font-officer-display' });

export const metadata: Metadata = {
  title: 'Smart Dashboard Dashboard',
  description: 'Hệ thống Bảng điều khiển & Trợ lý AI cho UBND xã/phường',
  generator: 'v0.app',
  icons: {
    icon: '/ics-icon.png',
    apple: '/ics-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${officerSans.variable} ${officerDisplay.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
