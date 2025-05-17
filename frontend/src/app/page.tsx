import Header from "@/components/Header"
import Hero from "@/components/Hero"
import HowItWorks from "@/components/HowItWorks"
import Roles from "@/components/Roles"
import TableAble from "@/components/TableAble"
import TableDisable from "@/components/TableDisable"
import Footer from "@/components/Footer"
import { Metadata } from "next"
import { getUserFromBackend } from '@/libs/auth'

export const metadata: Metadata = {
  title: "Tender Parsing — поиск проблемных тендеров на сайтах госзакупок",
  description: "Веб-сервис для парсинга сайтов государственных закупок с целью отслеживания тендеров, в которых могут быть потенциальные проблемы"
}

export default async function Home() {
  const user = await getUserFromBackend()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Roles />
        {user ? (<TableAble />) : (<TableDisable />)}
      </main>
      <Footer />
    </>
  )
}
