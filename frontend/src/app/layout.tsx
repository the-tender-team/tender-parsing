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
  description: 'Сервис анализа проблемных тендеров на сайте госзакупок',
  
  // Иконки для разных платформ
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },

  // OpenGraph (для соцсетей: Facebook, LinkedIn, Telegram)
  openGraph: {
    title: 'Tender Parsing',
    description: 'Сервис анализа проблемных тендеров на сайте госзакупок',
    url: 'https://tender-parsing.ru',
    siteName: 'Tender Parsing',
    images: [
      {
        url: 'https://tender-parsing.ru/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Сервис анализа проблемных тендеров на сайте госзакупок',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },

  // Дополнительные мета-теги
  manifest: '/site.webmanifest',
  themeColor: '#ffffff',
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/android-chrome-192x192.png',
  }
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
