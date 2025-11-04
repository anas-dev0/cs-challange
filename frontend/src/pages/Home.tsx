import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import { FaRocket, FaBrain, FaChartLine, FaStar } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export default function Home() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('Home must be used within AuthProvider')
  }

  const { user, openAuthModal } = context

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background handled globally by BackgroundShader */}

      {/* Hero Section */}
      <section className="relative container pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md mb-6",
              "border-black/20 bg-white/10 hover:bg-black/20 transition-colors"
            )}
          >
            <FaRocket className="text-primary animate-bounce" />
            <span className="text-sm font-medium text-foreground" style={{ color: 'white' }}>AI-Powered Interview Practice</span>
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
          >
            <span className="text-gradient">Master Your Next Interview</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium"
          >
            Practice with AI-powered simulations, get instant feedback, and land your dream job with confidence.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 background-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Interview
              </Link>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('register')}
                  className="group relative px-8 py-4 background-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  <span className="relative z-10">Start Free Trial</span>
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-8 py-4 bg-card text-card-foreground font-semibold rounded-xl border-2 border-border hover:border-primary hover:text-primary shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Sign In
                </button>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div>
              <div className="text-3xl font-bold text-gradient">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Interviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">95%</div>
              <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container py-20">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-foreground mb-4"
          >
            Why Choose UtopiaHire?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Everything you need to ace your next interview
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 background-gradient rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaBrain className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">AI-Powered Feedback</h3>
              <p className="text-muted-foreground">Get instant, personalized feedback on your answers with actionable insights to improve.</p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="group relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 background-gradient rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaChartLine className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Track Progress</h3>
              <p className="text-muted-foreground">Monitor your improvement over time with detailed analytics and performance metrics.</p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="group relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 background-gradient rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaStar className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Real Scenarios</h3>
              <p className="text-muted-foreground">Practice with realistic interview scenarios from top companies across industries.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="background-gradient rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-300 text-2xl" />)}
          </div>
          <h3 className="text-3xl font-bold mb-4">Loved by thousands of job seekers</h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            "This platform helped me land my dream job at a FAANG company. The AI feedback was incredibly detailed!"
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full"></div>
            <div className="text-left">
              <div className="font-semibold">Sarah Chen</div>
              <div className="text-sm text-white/80">Software Engineer at Google</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative container py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-foreground mb-6"
        >
          Ready to ace your interview?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-muted-foreground mb-8"
        >
          Join thousands of successful candidates today
        </motion.p>
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/dashboard"
              className="inline-block px-10 py-5 background-gradient text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Interview
            </Link>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => openAuthModal('register')}
            className="px-10 py-5 background-gradient text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Get Started for Free
          </motion.button>
        )}
      </section>
    </div>
  )
}
