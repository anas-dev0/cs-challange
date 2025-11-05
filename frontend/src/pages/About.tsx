import React from 'react'
import { FaHandshake, FaShieldAlt, FaBolt, FaCompass, FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export default function About() {
  return (
    <div className="relative min-h-screen">
      {/* Background handled globally by BackgroundShader */}

      {/* Header */}
      <section className="container pt-16 pb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
        >
          <span className="text-gradient">About UtopiaHire</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg max-w-2xl mx-auto text-[#D1D5DB]"
        >
          We help candidates practice smarter interviews with AI guidance, actionable feedback, and career-ready tools.
        </motion.p>
      </section>

      {/* Mission + Values */}
      <section className="container grid md:grid-cols-2 gap-10 items-center pb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-2 md:order-1"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="leading-relaxed text-[#D1D5DB]">
            Interviews can be stressful and unpredictable. We believe preparation should be accessible, personalized, and measurable.
            UtopiaHire simulates real-world interviews, provides immediate feedback, and guides your improvement over time.
          </p>
          <ul className="mt-6 space-y-3 text-foreground">
            <li className="flex items-center gap-2"><FaCheckCircle className="text-primary" /> AI-driven interview practice</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-primary" /> Actionable, structured feedback</li>
            <li className="flex items-center gap-2"><FaCheckCircle className="text-primary" /> Career tools across your journey</li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-1 md:order-2"
        >
          <div className="rounded-3xl p-8 shadow-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/30 border border-primary/30 shadow-lg flex items-center justify-center"
              >
                <FaCheckCircle className="text-4xl text-primary/70" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-32 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/30 shadow-lg flex items-center justify-center"
              >
                <FaBolt className="text-4xl text-primary/70" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-32 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/25 border border-primary/30 shadow-lg flex items-center justify-center"
              >
                <FaShieldAlt className="text-4xl text-primary/70" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/30 border border-primary/30 shadow-lg flex items-center justify-center"
              >
                <FaCompass className="text-4xl text-primary/70" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pillars */}
      <section className="container pb-20">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-foreground mb-6 text-center"
        >
          What sets us apart
        </motion.h3>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="group bg-card rounded-2xl p-8 border border-border hover:border-primary shadow-sm hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaBolt className="text-primary" />
            </div>
            <h4 className="font-semibold text-card-foreground mb-2">Instant feedback</h4>
            <p className="text-muted-foreground">Actionable insights after each answer to help you iterate quickly.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="group bg-card rounded-2xl p-8 border border-border hover:border-primary shadow-sm hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaShieldAlt className="text-primary" />
            </div>
            <h4 className="font-semibold text-card-foreground mb-2">Realistic practice</h4>
            <p className="text-muted-foreground">Simulations mirror real interview flows and difficulty levels.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="group bg-card rounded-2xl p-8 border border-border hover:border-primary shadow-sm hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaCompass className="text-primary" />
            </div>
            <h4 className="font-semibold text-card-foreground mb-2">Guided growth</h4>
            <p className="text-muted-foreground">Structured paths so you always know your next step to improve.</p>
          </motion.div>
        </div>
      </section>

      {/* Microservices overview */}
      <section className="container pb-24">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-foreground mb-6 text-center"
        >
          Tools you'll access after sign-in
        </motion.h3>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-6 bg-card border border-primary/20 shadow-md hover:shadow-xl transition-all"
          >
            <h4 className="font-semibold text-card-foreground mb-2">AI Interviewer</h4>
            <p className="text-muted-foreground">Practice behavioral and technical interviews with instant feedback.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl p-6 bg-card border border-primary/20 shadow-md hover:shadow-xl transition-all"
          >
            <h4 className="font-semibold text-card-foreground mb-2">CV Reviewer & Enhancer</h4>
            <p className="text-muted-foreground">Get suggestions to improve clarity, impact and keyword alignment.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl p-6 bg-card border border-primary/20 shadow-md hover:shadow-xl transition-all"
          >
            <h4 className="font-semibold text-card-foreground mb-2">Job Matcher</h4>
            <p className="text-muted-foreground">Match your profile with relevant roles and get tailored preparation.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
