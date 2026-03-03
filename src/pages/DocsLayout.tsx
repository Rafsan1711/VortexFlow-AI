import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBook, faShieldAlt, faFileContract, faInfoCircle, faHistory, faTerminal, faCode, faGlobe } from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { path: '/docs/about', label: 'About', icon: faInfoCircle },
  { path: '/docs/changelog', label: 'Changelog', icon: faHistory },
  { path: '/docs/editor', label: 'Code Editor', icon: faCode },
  { path: '/docs/terminal', label: 'Terminal', icon: faTerminal },
  { path: '/status', label: 'System Status', icon: faGlobe },
  { path: '/docs/privacy', label: 'Privacy Policy', icon: faShieldAlt },
  { path: '/docs/terms', label: 'Terms of Service', icon: faFileContract },
];

export default function DocsLayout() {
  const location = useLocation();
  const currentItem = navItems.find(item => item.path === location.pathname) || navItems[0];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#0D0D14] border-r border-white/5 flex flex-col flex-shrink-0 z-20">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[1px]">
              <div className="w-full h-full bg-[#0D0D14] rounded-[11px] flex items-center justify-center">
                <FontAwesomeIcon icon={faBook} className="text-[#00D4FF]" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Docs</h1>
              <p className="text-[10px] text-[#5C5C7A] uppercase tracking-widest font-semibold">VortexFlow AI</p>
            </div>
          </div>
          <Link to="/" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group">
            <FontAwesomeIcon icon={faArrowLeft} className="text-[#5C5C7A] text-xs group-hover:text-[#F0F0FF]" />
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          <p className="text-[10px] text-[#5C5C7A] uppercase tracking-[0.2em] font-bold mb-4 px-4">Resources</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#00D4FF]/10 text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.05)]' 
                    : 'text-[#9898B8] hover:bg-white/5 hover:text-[#F0F0FF]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#00D4FF]/20' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <FontAwesomeIcon icon={item.icon} className={isActive ? 'text-[#00D4FF]' : 'text-[#5C5C7A] group-hover:text-[#9898B8]'} />
                </div>
                <span className="font-medium tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="bg-gradient-to-br from-[#00D4FF]/10 to-[#7B61FF]/10 rounded-2xl p-6 border border-white/5">
            <p className="text-xs text-[#9898B8] mb-3 leading-relaxed">Need help with something else?</p>
            <Link to="/docs/about" className="text-xs font-bold text-[#00D4FF] hover:underline flex items-center gap-2">
              Contact Support
              <FontAwesomeIcon icon={faArrowLeft} className="rotate-180 text-[10px]" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0F] relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D4FF] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7B61FF] rounded-full blur-[150px] opacity-[0.02] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 py-12 md:px-16 md:py-24 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#5C5C7A] uppercase tracking-widest mb-8">
            <Link to="/" className="hover:text-[#F0F0FF] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#00D4FF]">Documentation</span>
            <span>/</span>
            <span className="text-[#F0F0FF]">{currentItem.label}</span>
          </div>

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="markdown-body"
          >
            <Outlet />
          </motion.div>

          {/* Footer for Docs */}
          <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-[#5C5C7A]">© 2026 VortexFlow AI. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <Link to="/docs/privacy" className="text-sm text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors">Privacy</Link>
              <Link to="/docs/terms" className="text-sm text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors">Terms</Link>
              <a href="https://twitter.com/vortexflowai" className="text-sm text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors">Twitter</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
