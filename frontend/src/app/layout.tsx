import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import '@fortawesome/fontawesome-free/css/all.min.css'
import { NotificationProvider } from "@/libs/NotificationProvider"
import { AuthProvider } from "@/context/AuthProvider"
import { Metadata } from "next"

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
        <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
