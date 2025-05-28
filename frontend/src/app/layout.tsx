import { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { NotificationProvider } from "@/libs/NotificationProvider"
import { AuthProvider } from "@/context/AuthProvider"
import { UserProvider } from "@/context/UserProvider"
import { AdminProvider } from "@/context/AdminProvider"
import { ParserProvider } from '@/context/ParserProvider'

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
              <AdminProvider>
                <ParserProvider>
                  {children}
                </ParserProvider>
              </AdminProvider>
            </UserProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
