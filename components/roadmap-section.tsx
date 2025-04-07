"use client"

import { motion } from "framer-motion"
import { Card, CardBody, CardHeader } from "@heroui/card"

export default function RoadmapSection() {
  const roadmapItems = [
    {
      quarter: "Q1 2025",
      title: "MVP Launch",
      description:
        "Initial platform launch with core auction functionality, wallet integration, and basic bidding features.",
    },
    {
      quarter: "Q2 2025",
      title: "Advanced Features",
      description: "Introduction of advanced bidding strategies, escrow services, and enhanced user profiles.",
    },
    {
      quarter: "Q3 2025",
      title: "Multi-Chain Expansion",
      description: "Expanding beyond Ethereum to support multiple blockchains and cross-chain auction capabilities.",
    },
    {
      quarter: "Q4 2025",
      title: "Full DAO Governance",
      description:
        "Transition to community governance with token holders voting on platform upgrades and fee structures.",
    },
  ]

  return (
    <section id="roadmap" className="py-20 bg-muted/30">
      <div className="container px-4">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">Roadmap</h2>
          <p className="text-muted-foreground">
            Our development plan for bringing AuctionChain to life and evolving it into the leading decentralized
            auction platform.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 relative">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`md:flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Circle on timeline */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary hidden md:block" />

                  {/* Empty space for alignment */}
                  <div className="md:w-1/2" />

                  {/* Card */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                    <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-medium text-primary mb-1">{item.quarter}</div>
                          <h1 className="text-xl font-semibold">{item.title}</h1>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4">Join Us on This Journey</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We`re building the future of decentralized auctions and we want you to be part of it. Stay updated with our
            progress and be the first to know about our launch.
          </p>
          <motion.button
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Waitlist
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

