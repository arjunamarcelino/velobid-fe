"use client"

import { motion } from "framer-motion"
import { Shield, Users, Zap } from "lucide-react"
import { Card, CardBody, CardHeader } from "@heroui/card"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Decentralized & Secure",
      description:
        "Built on blockchain technology to ensure transparency, immutability, and security for all auction transactions.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "User Centric System",
      description:
        "Designed with users in mind, offering intuitive interfaces and seamless experiences for both buyers and sellers.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Upgradable & Future Proof",
      description:
        "Modular architecture that can evolve with technology advancements and adapt to changing market needs.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container px-4">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">Key Features</h2>
          <p className="text-muted-foreground">
            Our platform is built with cutting-edge technology to provide a secure, user-friendly, and future-proof
            auction experience.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 bg-card">
                <CardHeader>
                    <div className="flex flex-col gap-1">
                        <div className="mb-4">{feature.icon}</div>
                        <h1 className="text-xl font-semibold">{feature.title}</h1>
                    </div>
                </CardHeader>
                <CardBody>
                  <p className="text-base">{feature.description}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

