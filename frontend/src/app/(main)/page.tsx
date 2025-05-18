'use client'

import Header from "@/components/Header"
import Hero from "@/app/(main)/components/Hero"
import HowItWorks from "@/app/(main)/components/HowItWorks"
import Roles from "@/app/(main)/components/Roles"
import TableAble from "@/app/(main)/components/TableAble"
import TableDisable from "@/app/(main)/components/TableDisable"
import Footer from "@/components/Footer"
import { useAuth } from '@/context/AuthProvider'


export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Roles />
        {isAuthenticated ? <TableAble /> : <TableDisable />}
      </main>
      <Footer />
    </>
  )
}