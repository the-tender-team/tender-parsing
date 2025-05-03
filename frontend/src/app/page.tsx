import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Roles from "@/components/Roles";
//import Table from "@/components/Table";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tender Parsing — поиск проблемных тендеров на сайтах госзакупок",
  description: "Веб-сервис для парсинга сайтов государственных закупок с целью отслеживания тендеров, в которых могут быть потенциальные проблемы",
};

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <Roles />
      {/*<Table />*/}
      <Footer />
    </>
  );
}
