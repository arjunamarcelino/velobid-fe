"use client"

import { useState, useEffect } from "react"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import TechStackSection from "@/components/tech-stack-section"
import RoadmapSection from "./roadmap-section"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <TechStackSection />
        <RoadmapSection />
      </main>
    </div>
  )
}

