"use client"

import { motion } from "framer-motion"

export default function TechStackSection() {
  const technologies = [
    { name: "Ethereum", icon: "🔷" },
    { name: "Solidity", icon: "📝" },
    { name: "IPFS", icon: "📦" },
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "TypeScript", icon: "🔷" },
  ]

  return (
    <section id="tech" className="py-20">
      <div className="container px-4">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">Technology Stack</h2>
          <p className="text-muted-foreground">
            Built with the latest and most reliable technologies to ensure performance, security, and scalability.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-4">
                {tech.icon}
              </div>
              <h3 className="font-medium">{tech.name}</h3>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 p-8 rounded-xl bg-muted/50 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl flex-shrink-0">
              🔒
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Security First Approach</h3>
              <p className="text-muted-foreground">
                Our platform undergoes regular security audits and implements industry best practices to ensure your
                assets and data are always protected.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

