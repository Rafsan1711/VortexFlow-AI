import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faChevronDown, 
  faBolt, 
  faBrain, 
  faLock, 
  faCode, 
  faSync, 
  faPalette, 
  faUserPlus, 
  faComments, 
  faStar,
  faCheck,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { 
  faTwitter, 
  faGithub, 
  faDiscord 
} from '@fortawesome/free-brands-svg-icons';

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0F]/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-auto py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <motion.div 
            className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl p-[2px] overflow-hidden shadow-[0_0_20px_rgba(0,212,255,0.3)] group-hover:shadow-[0_0_30px_rgba(123,97,255,0.5)] transition-shadow duration-500"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Animated Gradient Border */}
            <motion.div 
              className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_270deg,#00D4FF_360deg)] transform-gpu will-change-transform"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Static fallback border */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] opacity-50" />
            
            {/* Inner Container */}
            <div className="relative w-full h-full bg-[#0A0A0F] rounded-[14px] overflow-hidden flex items-center justify-center z-10">
              <img 
                src="/logo.png" 
                alt="VortexFlow Logo" 
                className="w-full h-full object-cover scale-110" 
                onError={(e) => e.currentTarget.src = 'https://placehold.co/128x128/00D4FF/FFFFFF?text=V'} 
              />
            </div>
          </motion.div>
          <span className="font-bold text-xl md:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">
            VortexFlow AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-[#9898B8] hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-[#9898B8] hover:text-white transition-colors flex items-center gap-2">
            Pricing
            <span className="px-2 py-0.5 rounded-full bg-[#1A1A24] border border-[#2A2A3A] text-[10px] text-[#00D4FF] uppercase tracking-wider">Free</span>
          </a>
          <Link to="/docs/about" className="text-sm font-medium text-[#9898B8] hover:text-white transition-colors">About</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth" className="text-sm font-medium text-white hover:text-[#00D4FF] transition-colors">Sign In</Link>
          <Link to="/auth" className="relative group px-5 py-2.5 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] transition-all duration-300 group-hover:opacity-90" />
            <div className="absolute inset-0 bg-[#FF6B35] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
            <span className="relative z-10 text-sm font-semibold text-white">Get Started Free</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 w-full bg-[#111118] border-b border-[#2A2A3A] p-6 flex flex-col gap-4"
        >
          <a href="#features" className="text-[#9898B8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#pricing" className="text-[#9898B8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          <Link to="/auth" className="text-[#9898B8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          <Link to="/auth" className="w-full py-3 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] rounded-lg text-center font-semibold text-white" onClick={() => setMobileMenuOpen(false)}>
            Get Started Free
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const headline = "The AI That Thinks With You";
  const words = headline.split(" ");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00D4FF]/10 rounded-full blur-[100px] md:blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow transform-gpu" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7B61FF]/10 rounded-full blur-[100px] md:blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse-slow transform-gpu" style={{ animationDelay: '1.5s' }} />

      {/* Headline */}
      <motion.h1 
        className="text-5xl md:text-7xl font-bold text-center leading-tight mb-6 max-w-4xl flex flex-wrap justify-center gap-x-4 gap-y-2 will-change-transform"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
            className={`transform-gpu ${word === "Thinks" ? "bg-clip-text text-transparent bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] animate-pulse" : ""}`}
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subheadline */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg md:text-xl text-[#9898B8] text-center max-w-2xl mb-10 leading-relaxed"
      >
        VortexFlow AI brings you next-generation conversations — intelligent, fast, and beautifully designed. Start for free, no credit card needed.
      </motion.p>

      {/* CTAs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 mb-20"
      >
        <Link to="/auth" className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-semibold shadow-lg shadow-[#00D4FF]/20 hover:shadow-[#00D4FF]/40 transition-all hover:scale-105 active:scale-95">
          Start Chatting Free <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
        <a href="#how-it-works" className="px-8 py-4 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] text-white font-medium hover:bg-[#22222E] transition-colors">
          See How It Works
        </a>
      </motion.div>

      {/* Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 40, rotateX: 5, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 60 }}
        className="relative w-full max-w-4xl rounded-2xl border border-[#2A2A3A] bg-[#111118]/80 backdrop-blur-md md:backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transform-gpu will-change-transform"
        style={{ perspective: 1000 }}
      >
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="transform-gpu will-change-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 to-[#7B61FF]/5 pointer-events-none" />
          
          {/* Mockup Header */}
          <div className="h-12 border-b border-[#2A2A3A] flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF4D6A]" />
            <div className="w-3 h-3 rounded-full bg-[#FFB830]" />
            <div className="w-3 h-3 rounded-full bg-[#00E5A0]" />
          </div>

          {/* Mockup Body */}
          <div className="p-8 space-y-6">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-[#22222E] text-[#F0F0FF] px-6 py-3 rounded-2xl rounded-tr-sm max-w-md shadow-md">
                <p>Can you help me design a system architecture for a real-time chat app?</p>
              </div>
            </div>

            {/* AI Message */}
            <div className="flex justify-start gap-4">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[1.5px] shadow-[0_0_10px_rgba(0,212,255,0.3)] shrink-0">
                <div className="w-full h-full bg-[#0A0A0F] rounded-[6.5px] overflow-hidden flex items-center justify-center">
                  <img src="/logo.png" alt="VF" className="w-full h-full object-cover scale-110" />
                </div>
              </div>
              <div className="space-y-2 max-w-2xl">
                <div className="bg-gradient-to-br from-[#00D4FF]/10 to-[#7B61FF]/10 border border-[#00D4FF]/20 text-[#F0F0FF] px-6 py-4 rounded-2xl rounded-tl-sm shadow-md">
                  <p className="mb-3">Absolutely. Here's a high-level architecture for a scalable real-time chat application:</p>
                  <ul className="list-disc pl-4 space-y-1 text-[#9898B8] text-sm">
                    <li><strong className="text-white">Frontend:</strong> React + Vite for speed, Tailwind for styling.</li>
                    <li><strong className="text-white">Backend:</strong> Node.js with WebSocket support (Socket.io).</li>
                    <li><strong className="text-white">Database:</strong> Firebase or PostgreSQL for message persistence.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 text-[#5C5C7A]"
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </motion.div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: faBolt, title: "Lightning Fast", desc: "Sub-second responses powered by advanced models." },
    { icon: faBrain, title: "Context Memory", desc: "Remembers your full conversation history for continuity." },
    { icon: faLock, title: "Private & Secure", desc: "Firebase Auth ensures your data stays yours alone." },
    { icon: faCode, title: "Code Intelligence", desc: "Syntax highlighting, copy button, and language detection." },
    { icon: faSync, title: "Real-time Sync", desc: "Chats sync instantly across all your connected devices." },
    { icon: faPalette, title: "Beautiful UI", desc: "Dark mode premium interface, built for deep focus." },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need, nothing you don't</h2>
          <p className="text-[#9898B8]">Built for power users who demand speed and precision.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
      onMouseMove={handleMouseMove}
      className="group p-8 rounded-2xl bg-[#111118] border border-[#2A2A3A] hover:border-[#3D3D52] transition-colors relative overflow-hidden transform-gpu will-change-transform"
    >
      {/* Spotlight Hover Effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,212,255,0.15), transparent 40%)`
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-12 h-12 rounded-lg bg-[#1A1A24] flex items-center justify-center mb-6 text-[#00D4FF] group-hover:scale-110 group-hover:text-white transition-all duration-300 shadow-[0_0_0_rgba(0,212,255,0)] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] relative z-10">
        <FontAwesomeIcon icon={feature.icon} size="lg" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white relative z-10">{feature.title}</h3>
      <p className="text-[#9898B8] leading-relaxed relative z-10">{feature.desc}</p>
    </motion.div>
  );
};

const HowItWorks = () => {
  const steps = [
    { icon: faUserPlus, title: "Create Account", desc: "Sign up in seconds with Google or Email." },
    { icon: faComments, title: "Start a Chat", desc: "Type your question or choose a prompt." },
    { icon: faBolt, title: "Get Instant Answers", desc: "Receive intelligent responses instantly." },
  ];

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "center center"]
  });

  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#0A0A0F] relative overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Three steps to smarter conversations</h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connecting Line Base */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-[#2A2A3A]" />
          
          {/* Animated Connecting Line */}
          <motion.div 
            className="hidden md:block absolute top-12 left-[16%] h-0.5 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] origin-left z-0"
            style={{ width: '68%', scaleX: scrollYProgress }}
          />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative flex flex-col items-center text-center z-10 transform-gpu will-change-transform"
            >
              <div className="w-24 h-24 rounded-2xl bg-[#111118] border border-[#2A2A3A] flex items-center justify-center mb-6 shadow-xl relative group hover:border-[#00D4FF] transition-colors duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] text-white font-bold flex items-center justify-center border-4 border-[#0A0A0F] shadow-[0_0_10px_rgba(0,212,255,0.5)]">
                  {idx + 1}
                </div>
                <FontAwesomeIcon icon={step.icon} className="text-3xl text-[#5C5C7A] group-hover:text-[#00D4FF] group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-[#9898B8]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "<1s", label: "Response Time" },
    { value: "100%", label: "Free Forever*" },
  ];

  return (
    <section id="pricing" className="py-12 bg-[#111118] border-y border-[#2A2A3A]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center relative">
            {idx !== 0 && <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-[#2A2A3A] to-transparent" />}
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-[#9898B8] uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#00D4FF]/10 to-[#7B61FF]/10 border border-[#00D4FF]/20 p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00D4FF]/5 blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to think bigger?</h2>
          <p className="text-xl text-[#9898B8] mb-10 max-w-2xl mx-auto">Join thousands of users already exploring the future of AI with VortexFlow. No credit card required.</p>
          <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0A0A0F] font-bold hover:bg-gray-100 transition-colors transform hover:scale-105 duration-200">
            Get Started — It's Free <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#050508] border-t border-[#2A2A3A] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[1.5px] shadow-[0_0_10px_rgba(0,212,255,0.2)]">
                <div className="w-full h-full bg-[#0A0A0F] rounded-[6.5px] overflow-hidden flex items-center justify-center">
                  <img src="/logo.png" alt="VortexFlow AI" className="w-full h-full object-cover scale-110" />
                </div>
              </div>
              <span className="font-bold text-xl">VortexFlow AI</span>
            </div>
            <p className="text-[#9898B8] max-w-xs">Next-generation AI chat platform. Built for speed, privacy, and precision.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-[#9898B8] text-sm">
              <li><a href="#features" className="hover:text-[#00D4FF]">Features</a></li>
              <li><a href="#pricing" className="hover:text-[#00D4FF]">Pricing</a></li>
              <li><Link to="/docs/changelog" className="hover:text-[#00D4FF]">Changelog</Link></li>
              <li><Link to="/docs" className="hover:text-[#00D4FF]">Docs</Link></li>
              <li><Link to="/status" className="hover:text-[#00D4FF]">System Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-[#9898B8] text-sm">
              <li><Link to="/docs/privacy" className="hover:text-[#00D4FF]">Privacy Policy</Link></li>
              <li><Link to="/docs/terms" className="hover:text-[#00D4FF]">Terms of Service</Link></li>
              <li><Link to="/docs/about" className="hover:text-[#00D4FF]">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2A2A3A] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#5C5C7A] text-sm">
            © 2025 VortexFlow AI. Built with ♥.
          </div>
          <div className="flex gap-6 text-[#9898B8]">
            <a href="https://twitter.com/vortexflowai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="https://github.com/rafsan1711/vortex-flow-ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FontAwesomeIcon icon={faGithub} /></a>
            <a href="https://discord.gg/vortexflow" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FontAwesomeIcon icon={faDiscord} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] font-sans selection:bg-[#00D4FF] selection:text-[#0A0A0F]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
