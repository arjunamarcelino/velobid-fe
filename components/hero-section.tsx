"use client"

import { motion } from "framer-motion"
import { Button } from "@heroui/button"
import Link from "next/link"

export default function HeroSection() {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Text animation for the title
  const words = "Decentralized Auctions Reimagined".split(" ")

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background -z-10" />

      {/* Animated shapes */}
      <div className="absolute inset-0 -z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 w-72 h-72"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: "blur(100px)",
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container px-4 py-24 md:py-32 lg:py-40">
        <motion.div className="max-w-3xl mx-auto text-center" variants={container} initial="hidden" animate="show">
          {/* Animated title */}
          <div className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <div className="flex flex-wrap justify-center gap-x-3">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.p className="mb-8 text-lg md:text-xl text-muted-foreground" variants={item}>
            The next generation blockchain auction platform that puts security, transparency, and user experience at the
            forefront.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={item}>
            <Button size="lg" className="font-medium">
                <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button size="lg" variant="bordered" className="font-medium">
              Learn More
            </Button>
          </motion.div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-xl shadow-2xl">
              <div className="bg-muted rounded-t-xl p-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="bg-card p-4 rounded-b-xl">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-semibold mb-2">AuctionChain Platform</div>
                    <p className="text-sm text-muted-foreground">Coming Q1 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

