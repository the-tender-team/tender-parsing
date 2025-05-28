'use client'

import Header from "@/components/Header"
import Hero from "@/app/(main)/components/Hero"
import HowItWorks from "@/app/(main)/components/HowItWorks"
import Roles from "@/app/(main)/components/Roles"
import Parsing from "@/app/(main)/components/Parsing/index"
import Footer from "@/components/Footer"
import { useAuth } from '@/context/AuthProvider'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Roles />
        <Parsing />
      </main>
      <Footer />
    </>
  )
}