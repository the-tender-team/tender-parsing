'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

type Section = {
  id: string
  icon: IconDefinition
  title: string
}

type Props = {
  sections: Section[]
}

export default function ScrollSpyIconTabs({ sections }: Props) {
  const [activeTab, setActiveTab] = useState<string>(sections[0]?.id || '')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id)
          break
        }
      }
    }

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: '-40% 0px -55% 0px', // центр экрана
      threshold: 0.1,
    })

    const elements = sections.map(s => document.getElementById(s.id)).filter(Boolean)

    elements.forEach(el => {
      if (el && observerRef.current) observerRef.current.observe(el)
    })

    return () => {
      elements.forEach(el => {
        if (el && observerRef.current) observerRef.current.unobserve(el)
      })
    }
  }, [sections])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="flex justify-center gap-4 py-4 bg-indigo-700 text-white sticky top-0 z-40">
      {sections.map(({ id, icon, title }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`p-2 pb-1 border-b-2 transition ${
              isActive ? 'border-white' : 'border-transparent text-indigo-200'
            }`}
            title={title}
            aria-label={title}
          >
            <FontAwesomeIcon icon={icon} className="text-xl" />
          </button>
        )
      })}
    </nav>
  )
}
