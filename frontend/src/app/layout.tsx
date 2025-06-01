import { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { NotificationProvider } from "@/providers/NotificationProvider"
import { AuthProvider } from "@/providers/AuthProvider"
import { UserProvider } from "@/providers/UserProvider"
import { ControlProvider } from "@/providers/ControlProvider"
import { ParserProvider } from '@/providers/ParserProvider'
import { TenderProvider } from '@/providers/TenderProvider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: 'Tender Parsing',
  description: 'Tender Parsing - ваш надежный помощник в поиске и анализе тендеров.'
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          <AuthProvider>
            <UserProvider>
              <ControlProvider>
                <ParserProvider>
                  <TenderProvider>
                    {children}
                  </TenderProvider>
                </ParserProvider>
              </ControlProvider>
            </UserProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
