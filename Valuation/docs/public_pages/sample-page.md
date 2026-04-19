import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChartBar, TrendingUp, FileText, Calculator } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-inter">
      {/* Hero Section with Animated Pattern */}
      <section className="relative text-center py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-700 to-indigo-900 animate-gradient-x"></div>
        <svg className="absolute inset-0 w-full h-full opacity-20 animate-float-pattern" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="valuationPattern" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="100" cy="100" r="2" fill="rgba(255,255,255,0.4)" />
              <path d="M0 100 Q100 0 200 100 T400 100" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="1" />
              <path d="M0 100 Q100 200 200 100 T400 100" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#valuationPattern)" />
        </svg>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-200 rounded-full shadow-lg shadow-cyan-400/40"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
                x: [Math.random() * 400 - 200, Math.random() * 400],
                y: [Math.random() * 400 - 200, Math.random() * 400]
              }}
              transition={{ repeat: Infinity, duration: 8 + Math.random() * 8, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-6xl font-bold mb-6 text-white drop-shadow-2xl">
            AI-Driven Business & Asset Valuation Platform
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-lg text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience next-gen valuation precision using QuantLib, deep-learning analytics, and real-time global market datasets.
          </motion.p>
          <div className="flex justify-center gap-5">
            <Button size="lg" className="bg-white text-blue-700 font-semibold hover:bg-blue-100 shadow-lg shadow-blue-300/40 transition-transform hover:scale-105">Get Free Valuation</Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600/50 backdrop-blur-sm">Explore Vetted Reports</Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-8 bg-white text-center max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-blue-700">About Epiidosis Valuation Portal</h2>
        <p className="text-lg text-slate-600 mb-12 leading-relaxed">
          Our platform empowers enterprises, startups, and investors with instant valuations powered by AI, ensuring compliance with International Valuation Standards (IVS 2024). We bring transparency, speed, and precision to financial decision-making.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[{
            title: 'IVS-Compliant', desc: 'We follow globally recognized valuation standards ensuring transparency and trust.'
          }, {
            title: 'Data Integration', desc: 'Seamless integration with live market data and curated financial APIs.'
          }, {
            title: 'AI-Enhanced Accuracy', desc: 'Combining deep-learning forecasts with quantitative models for unmatched precision.'
          }].map((a, i) => (
            <Card key={i} className="bg-white border border-slate-200 shadow-md rounded-2xl hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-semibold text-blue-700 mb-3">{a.title}</h3>
                <p className="text-slate-600 leading-relaxed">{a.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 text-center">
        <h2 className="text-4xl font-bold mb-10 text-blue-700">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[{
            step: '1', title: 'Input Details', desc: 'Enter company, financial, and growth details or upload your reports.'
          }, {
            step: '2', title: 'AI Calculation', desc: 'Our engine processes your data with QuantLib, DCF, and multiples analysis.'
          }, {
            step: '3', title: 'Instant Report', desc: 'Get a downloadable summary report with value range and confidence metrics.'
          }, {
            step: '4', title: 'Analyst Review', desc: 'Upgrade to a detailed vetted valuation signed by certified analysts.'
          }].map((h, i) => (
            <Card key={i} className="bg-white border border-slate-200 shadow-md rounded-xl hover:shadow-xl transition-all">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">{h.step}</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{h.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{h.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white text-center">
        <h2 className="text-4xl font-bold mb-12 text-blue-700">Choose Your Valuation Plan</h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[{
            name: 'Free Instant Valuation', price: '$0', features: ['Basic DCF & Multiple Valuation', 'Instant Downloadable Summary', 'Email Report Delivery', 'AI Confidence Metrics']
          }, {
            name: 'Vetted Analyst Valuation', price: '$1499', features: ['Certified Analyst Review', 'IVS-Compliant Detailed Report', 'Scenario & Sensitivity Charts', 'Investor-Ready Presentation']
          }].map((p, i) => (
            <Card key={i} className="border border-slate-200 shadow-md hover:shadow-xl rounded-2xl">
              <CardContent className="p-10 text-center">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">{p.name}</h3>
                <p className="text-5xl font-bold text-slate-800 mb-6">{p.price}</p>
                <ul className="space-y-3 mb-8 text-slate-600">
                  {p.features.map((f, j) => (<li key={j}>✔ {f}</li>))}
                </ul>
                <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold">Get Started</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 py-24 text-center text-white">
        <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Transform Your Valuation Workflow</h2>
        <p className="text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">Automate valuations, ensure compliance, and deliver investor-grade insights in minutes with our intelligent platform.</p>
        <Button size="lg" className="bg-white text-blue-700 font-semibold hover:bg-blue-100 shadow-lg shadow-blue-300/40 transition-transform hover:scale-105">Start Free Valuation</Button>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-500 text-sm bg-white border-t border-slate-200">
        © 2025 Epiidosis Valuation Portal • Powered by QuantLib & AI Precision.
      </footer>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease infinite;
        }
        @keyframes float-pattern {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-pattern {
          animation: float-pattern 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdvancedModulesAnimated() {
  const data = [
    { month: 'Jan', value: 25 },
    { month: 'Feb', value: 40 },
    { month: 'Mar', value: 35 },
    { month: 'Apr', value: 60 },
  ]
  const pieData = [
    { name: 'Business', value: 40 },
    { name: 'Real Estate', value: 25 },
    { name: 'Startup', value: 20 },
    { name: 'Machinery', value: 15 },
  ]
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8FAFF] to-[#E6F2FF] text-[#0F172A] font-inter overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="p-6 flex justify-between items-center bg-gradient-to-r from-[#0033A0] to-[#00BFFF] text-white shadow-lg">
        <h1 className="text-2xl font-raleway font-semibold">Epiidosis Valuation Portal — Advanced Modules</h1>
        <Button variant="secondary" className="bg-white text-[#0033A0] font-semibold">Logout</Button>
      </motion.header>

      {/* Parallax Gradient Overlay */}
      <motion.div style={{ y: y1 }} className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#00BFFF]/30 to-transparent blur-3xl -z-10" />

      {/* User Dashboard Section */}
      <section className="p-8 relative">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-raleway font-bold mb-4">User Dashboard (Saved Reports)</motion.h2>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {['Total Reports', 'Accuracy Avg %', 'In Progress', 'Last Downloaded'].map((label, i) => (
            <motion.div whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0,150,255,0.2)' }} key={i}>
              <Card className="transition-all">
                <CardContent className="p-4">
                  <p className="text-gray-500 text-sm">{label}</p>
                  <h3 className="text-2xl font-bold text-[#0033A0]">{Math.floor(Math.random() * 100)}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Card className="p-6">
              <h4 className="font-semibold mb-2 text-[#0033A0]">Valuations Over Time</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <Line type="monotone" dataKey="value" stroke="#00BFFF" strokeWidth={3} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Card className="p-6">
              <h4 className="font-semibold mb-2 text-[#0033A0]">Category Distribution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={70} fill="#00BFFF" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* API Marketplace Section */}
      <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="p-8 bg-gradient-to-r from-[#002B7F] to-[#00CFFF] text-white relative overflow-hidden">
        <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute top-0 left-1/3 w-1/3 h-1/3 bg-white/5 blur-3xl rounded-full" />
        <h2 className="text-3xl font-raleway font-bold mb-4">API Marketplace</h2>
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {[
            { api: '/v1/valuation/dcf', desc: 'Discounted Cash Flow endpoint', price: 'Free / Paid' },
            { api: '/v1/valuation/multiples', desc: 'Market Multiple pricing API', price: '$99/m' },
            { api: '/v1/valuation/reports', desc: 'Generate certified report', price: '$499/m' },
          ].map((a, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }}>
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-100">{a.api}</p>
                  <h3 className="text-lg font-semibold mb-2">{a.desc}</h3>
                  <p className="text-gray-200 mb-3">Pricing: {a.price}</p>
                  <Button variant="secondary" className="bg-white text-[#0033A0] font-semibold">Try It</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Multi-Currency Section */}
      <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="p-8 bg-white">
        <h2 className="text-3xl font-raleway font-bold mb-4 text-[#0033A0]">Multi-Currency Support</h2>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} className="flex flex-wrap items-center gap-4 mb-6">
          {['USD', 'AED', 'GBP', 'INR'].map((c, i) => (
            <motion.div key={i} whileHover={{ y: -4 }}>
              <Button className="bg-gradient-to-r from-[#0033A0] to-[#00BFFF] text-white shadow-lg">{c}</Button>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-gray-700 max-w-2xl">Switch seamlessly between global currencies. Values and prices update live via secure FX APIs (Fixer.io), ensuring real-time accuracy.</p>
      </motion.section>

      {/* Partner Portal Section */}
      <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="p-8 bg-gradient-to-b from-[#E6F2FF] to-white">
        <h2 className="text-3xl font-raleway font-bold mb-4 text-[#0033A0]">Partner Portal</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="p-6 border-blue-100 bg-white/90 hover:shadow-blue-100 transition-all">
              <h3 className="font-semibold text-lg mb-2">Firm Profile</h3>
              <p className="text-gray-600">Manage team members, upload your firm logo, customize your white-label valuation portal, and access all client reports securely.</p>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="p-6 border-blue-100 bg-white/90 hover:shadow-blue-100 transition-all">
              <h3 className="font-semibold text-lg mb-2">Revenue Dashboard</h3>
              <p className="text-gray-600 mb-4">Track valuation volume, calculate payout shares, and view partner analytics in your selected currency.</p>
              <Button className="bg-gradient-to-r from-[#0033A0] to-[#00BFFF] text-white hover:shadow-blue-300">Request Payout</Button>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} className="p-6 text-center text-gray-500 border-t bg-white/80 backdrop-blur-md">© 2025 Epiidosis Valuation Portal • Animated Advanced Modules Preview</motion.footer>
    </div>
  )
}
