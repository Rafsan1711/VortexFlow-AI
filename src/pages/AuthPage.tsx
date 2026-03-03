import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash, 
  faUser, 
  faCheck, 
  faArrowRight,
  faBolt,
  faSync,
  faGem,
  faStar,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/useAppStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, authLoading, addToast } = useAppStore();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, loading, error } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Password strength
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/chat');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (mode === 'signup') {
      let s = 0;
      if (password.length > 6) s++;
      if (password.length > 10) s++;
      if (/[A-Z]/.test(password)) s++;
      if (/[0-9]/.test(password)) s++;
      if (/[^A-Za-z0-9]/.test(password)) s++;
      setStrength(s);
    }
  }, [password, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      await signInWithEmail(email, password);
    } else if (mode === 'signup') {
      if (password !== confirmPassword) {
        addToast({ type: 'error', message: "Passwords don't match" });
        return;
      }
      if (!agreeTerms) {
        addToast({ type: 'error', message: "Please agree to the Terms of Service" });
        return;
      }
      await signUpWithEmail(email, password, displayName);
    } else if (mode === 'forgot') {
      await resetPassword(email);
      setMode('signin');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <FontAwesomeIcon icon={faBolt} className="text-[#00D4FF] text-4xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex overflow-y-auto lg:overflow-hidden">
      {/* Left Panel (Desktop) */}
      <div className="hidden lg:flex w-[45%] bg-[#111118] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 to-[#7B61FF]/5" />
        {/* Animated Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00D4FF]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7B61FF]/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-6 group mb-12">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <img src="/logo.png" alt="VortexFlow Logo" className="w-full h-full object-contain relative z-10" onError={(e) => e.currentTarget.src = 'https://placehold.co/128x128/00D4FF/FFFFFF?text=V'} />
              <div className="absolute inset-0 bg-[#00D4FF] rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
            </div>
            <span className="font-bold text-2xl md:text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">
              VortexFlow AI
            </span>
          </Link>
          
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Your AI.<br />
            Your conversations.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">Your control.</span>
          </h1>
          
          <p className="text-[#9898B8] text-lg mb-12 max-w-md">
            Join thousands of developers and creators using VortexFlow to accelerate their workflow.
          </p>

          <div className="space-y-6">
            {[
              { icon: faGem, text: "Free forever, no credit card needed" },
              { icon: faBolt, text: "Powered by Google Gemini" },
              { icon: faSync, text: "Sync across all your devices" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-[#F0F0FF]">
                <div className="w-8 h-8 rounded-full bg-[#1A1A24] flex items-center justify-center text-[#00D4FF]">
                  <FontAwesomeIcon icon={item.icon} size="sm" />
                </div>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-12 p-6 rounded-2xl bg-[#1A1A24]/50 backdrop-blur-md border border-[#2A2A3A]">
          <div className="flex gap-1 text-[#FFB830] mb-3">
            {[...Array(5)].map((_, i) => <FontAwesomeIcon key={i} icon={faStar} size="xs" />)} 
          </div>
          <p className="text-[#F0F0FF] text-sm mb-4 leading-relaxed">
            "The best AI chat interface I've used. It's fast, beautiful, and the code generation is spot on."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B61FF]" />
            <div>
              <div className="font-bold text-white text-sm">Alex Chen</div>
              <div className="text-[#9898B8] text-xs">Software Engineer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
         {/* Mobile Background Elements */}
         <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7B61FF]/10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2" />
         </div>

         <div className="w-full max-w-md relative z-10">
           <div className="lg:hidden mb-8 flex justify-center">
             <Link to="/" className="flex items-center gap-4 group">
               <div className="relative w-16 h-16">
                 <img src="/logo.png" alt="VortexFlow Logo" className="w-full h-full object-contain relative z-10" onError={(e) => e.currentTarget.src = 'https://placehold.co/128x128/00D4FF/FFFFFF?text=V'} />
                 <div className="absolute inset-0 bg-[#00D4FF] rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
               </div>
               <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">
                 VortexFlow AI
               </span>
             </Link>
           </div>

           <div className="bg-[#111118]/80 backdrop-blur-xl border border-[#2A2A3A] rounded-3xl p-8 shadow-2xl">
             <AnimatePresence mode="wait">
               {mode === 'forgot' ? (
                 <motion.div
                   key="forgot"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                 >
                   <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                   <p className="text-[#9898B8] mb-6">Enter your email to receive reset instructions.</p>
                   
                   <form onSubmit={handleSubmit} className="space-y-4">
                     <Input
                       type="email"
                       placeholder="Email address"
                       icon={faEnvelope}
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                     />
                     <Button type="submit" className="w-full" loading={loading}>
                       Send Reset Email
                     </Button>
                   </form>
                   
                   <button 
                     onClick={() => setMode('signin')}
                     className="mt-6 text-sm text-[#9898B8] hover:text-white flex items-center gap-2 mx-auto transition-colors"
                   >
                     <FontAwesomeIcon icon={faArrowRight} className="rotate-180" /> Back to Sign In
                   </button>
                 </motion.div>
               ) : (
                 <motion.div
                   key="auth"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                 >
                   {/* Tabs */}
                   <div className="flex mb-8 border-b border-[#2A2A3A] relative">
                     {['signin', 'signup'].map((m) => (
                       <button
                         key={m}
                         onClick={() => setMode(m as 'signin' | 'signup')}
                         className={`flex-1 pb-4 text-sm font-medium transition-colors relative ${
                           mode === m ? 'text-white' : 'text-[#5C5C7A] hover:text-[#9898B8]'
                         }`}
                       >
                         {m === 'signin' ? 'Sign In' : 'Sign Up'}
                         {mode === m && (
                           <motion.div 
                             layoutId="activeTab"
                             className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF]"
                           />
                         )}
                       </button>
                     ))}
                   </div>

                   <div className="mb-6">
                     <h2 className="text-2xl font-bold text-white mb-2">
                       {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                     </h2>
                     <p className="text-[#9898B8]">
                       {mode === 'signin' ? 'Enter your details to access your account.' : 'Start your journey with VortexFlow today.'}
                     </p>
                   </div>

                   <button
                     type="button"
                     onClick={signInWithGoogle}
                     disabled={loading}
                     className="w-full bg-white text-[#1f1f1f] hover:bg-gray-100 font-medium rounded-xl py-3.5 px-6 mb-6 flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {loading ? (
                       <FontAwesomeIcon icon={faBolt} className="animate-spin text-[#1f1f1f]" />
                     ) : (
                       <>
                         <svg className="w-5 h-5" viewBox="0 0 24 24">
                           <path
                             d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                             fill="#4285F4"
                           />
                           <path
                             d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                             fill="#34A853"
                           />
                           <path
                             d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                             fill="#FBBC05"
                           />
                           <path
                             d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                             fill="#EA4335"
                           />
                         </svg>
                         {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                       </>
                     )}
                   </button>

                   <div className="relative flex items-center gap-4 mb-6">
                     <div className="h-px bg-[#2A2A3A] flex-1" />
                     <span className="text-xs text-[#5C5C7A] uppercase tracking-wider">Or continue with email</span>
                     <div className="h-px bg-[#2A2A3A] flex-1" />
                   </div>

                   <form onSubmit={handleSubmit} className="space-y-4">
                     {mode === 'signup' && (
                       <Input
                         placeholder="Full Name"
                         icon={faUser}
                         value={displayName}
                         onChange={(e) => setDisplayName(e.target.value)}
                         required
                       />
                     )}
                     
                     <Input
                       type="email"
                       placeholder="Email address"
                       icon={faEnvelope}
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                     />

                     <div className="space-y-2">
                       <Input
                         type={showPassword ? "text" : "password"}
                         placeholder="Password"
                         icon={faLock}
                         rightIcon={
                           <FontAwesomeIcon 
                             icon={showPassword ? faEyeSlash : faEye} 
                             onClick={() => setShowPassword(!showPassword)}
                           />
                         }
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         required
                       />
                       {mode === 'signup' && password && (
                         <div className="flex gap-1 h-1 mt-2">
                           {[...Array(5)].map((_, i) => (
                             <div 
                               key={i} 
                               className={`flex-1 rounded-full transition-colors duration-300 ${
                                 i < strength 
                                   ? strength < 3 ? 'bg-[#FF4D6A]' : strength < 4 ? 'bg-[#FFB830]' : 'bg-[#00E5A0]'
                                   : 'bg-[#2A2A3A]'
                               }`} 
                             />
                           ))}
                         </div>
                       )}
                     </div>

                     {mode === 'signup' && (
                       <Input
                         type={showPassword ? "text" : "password"}
                         placeholder="Confirm Password"
                         icon={faLock}
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         required
                       />
                     )}

                     {mode === 'signin' && (
                       <div className="flex justify-end">
                         <button 
                           type="button"
                           onClick={() => setMode('forgot')}
                           className="text-xs text-[#00D4FF] hover:text-[#7B61FF] transition-colors"
                         >
                           Forgot password?
                         </button>
                       </div>
                     )}

                     {mode === 'signup' && (
                       <label className="flex items-start gap-3 cursor-pointer group">
                         <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreeTerms ? 'bg-[#00D4FF] border-[#00D4FF]' : 'border-[#2A2A3A] group-hover:border-[#5C5C7A]'}`}>
                           {agreeTerms && <FontAwesomeIcon icon={faCheck} className="text-[#0A0A0F] text-xs" />}
                         </div>
                         <input 
                           type="checkbox" 
                           className="hidden" 
                           checked={agreeTerms} 
                           onChange={(e) => setAgreeTerms(e.target.checked)} 
                         />
                         <span className="text-xs text-[#9898B8] leading-relaxed">
                           I agree to the <Link to="/docs/terms" className="text-white hover:underline">Terms of Service</Link> and <Link to="/docs/privacy" className="text-white hover:underline">Privacy Policy</Link>.
                         </span>
                       </label>
                     )}

                     <Button type="submit" className="w-full" loading={loading}>
                       {mode === 'signin' ? 'Sign In' : 'Create Account'}
                     </Button>
                   </form>

                   <div className="mt-6 text-center">
                     <p className="text-sm text-[#9898B8]">
                       {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                       <button 
                         onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                         className="text-[#00D4FF] font-medium hover:underline"
                       >
                         {mode === 'signin' ? 'Sign up' : 'Sign in'}
                       </button>
                     </p>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
         </div>
      </div>
    </div>
  );
};

export default AuthPage;
