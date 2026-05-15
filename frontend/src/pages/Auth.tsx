import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  Package,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type AuthTab = "login" | "signup";

export default function Auth({ defaultTab = "login" }: { defaultTab?: AuthTab }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forms
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "", remember: false });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", agreed: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const validatePhone = (val: string) => /^[6-9]\d{9}$/.test(val.trim());

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0-4
  };

  const strengthScore = calculatePasswordStrength(signupForm.password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!loginForm.identifier.trim()) newErrors.identifier = "Email or phone is required";
    if (!loginForm.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) return setErrors(newErrors);
    
    setErrors({});
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: loginForm.identifier, password: loginForm.password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("rasu_user", JSON.stringify(data.user));
      localStorage.setItem("rasu_token", data.token);
      window.dispatchEvent(new Event("rasu-auth-changed"));
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
      setErrors({ form: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (signupForm.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!validateEmail(signupForm.email)) newErrors.email = "Valid email is required";
    if (!validatePhone(signupForm.phone)) newErrors.phone = "Valid 10-digit phone is required";
    if (signupForm.password.length < 8 || !/[0-9]/.test(signupForm.password)) newErrors.password = "Min 8 chars with at least 1 number";
    if (signupForm.password !== signupForm.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!signupForm.agreed) newErrors.agreed = "You must agree to the Terms";
    
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          phone: signupForm.phone,
          password: signupForm.password
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("rasu_user", JSON.stringify(data.user));
      localStorage.setItem("rasu_token", data.token);
      window.dispatchEvent(new Event("rasu-auth-changed"));
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
      setErrors({ form: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 } }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex w-full bg-black text-white selection:bg-white selection:text-black">
      {/* LEFT: Brand Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 lg:p-24 border-r border-white/10">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-white/5 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/5 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-2">
          <h1 className="text-4xl font-black tracking-tighter cursor-pointer" onClick={() => navigate("/")}>RASU.</h1>
          <p className="text-white/60 tracking-widest text-sm font-medium uppercase">Define Your Future</p>
        </div>

        <div className="relative z-10 space-y-8 mt-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Exclusive drops, first access</h3>
              <p className="text-white/60 text-sm">Join the community to unlock limited edition apparel.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Track orders in real-time</h3>
              <p className="text-white/60 text-sm">Full transparency from the warehouse to your doorstep.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Secure JWT authentication</h3>
              <p className="text-white/60 text-sm">Your data is encrypted and completely secure.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {tab === "login" ? (
            <button onClick={() => setTab("signup")} className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300">
              New here? Create account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button onClick={() => setTab("login")} className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300">
              Already have an account? Sign in
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 lg:p-24 relative overflow-y-auto">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-8 left-6 lg:hidden flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-2xl font-black tracking-tighter">RASU.</h1>
        </div>

        <div className="w-full max-w-md pt-20 lg:pt-0">
          <AnimatePresence mode="wait">
            {tab === "login" && (
              <motion.form 
                key="login-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl md:text-[2rem] font-black tracking-tight mb-2">Welcome Back</h2>
                  <p className="text-white/50">Sign in to your RASU account</p>
                </div>

                <div className="space-y-4">
                  <motion.div variants={inputVariants} className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input 
                      placeholder="Email or Phone" 
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      error={!!errors.identifier}
                    />
                    {errors.identifier && <span className="text-red-500 text-xs mt-1 block">{errors.identifier}</span>}
                  </motion.div>

                  <motion.div variants={inputVariants} className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Password" 
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      error={!!errors.password}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                  </motion.div>

                  <motion.div variants={inputVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer hover:text-white transition-colors">
                      <input type="checkbox" checked={loginForm.remember} onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })} className="rounded border-white/20 bg-white/5 accent-white w-4 h-4" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => navigate("/forgot-password")} className="text-sm text-white/60 hover:text-white transition-colors">
                      Forgot Password?
                    </button>
                  </motion.div>
                </div>

                {errors.form && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {errors.form}
                  </motion.div>
                )}

                <motion.div variants={inputVariants}>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-[52px] rounded-xl bg-white text-black hover:bg-white/90 font-bold text-base transition-all duration-300 relative overflow-hidden group"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </motion.div>

                <motion.div variants={inputVariants} className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-black px-2 text-white/40">Or continue with</span></div>
                </motion.div>

                <motion.div variants={inputVariants}>
                  <Button type="button" variant="outline" className="w-full h-[52px] rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium" disabled>
                    Google OAuth (Coming Soon)
                  </Button>
                </motion.div>

                <motion.div variants={inputVariants} className="lg:hidden text-center mt-8">
                  <button onClick={() => setTab("signup")} className="text-sm text-white/60 hover:text-white">
                    New here? Create account
                  </button>
                </motion.div>
              </motion.form>
            )}

            {tab === "signup" && (
              <motion.form 
                key="signup-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                onSubmit={handleSignup}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl md:text-[2rem] font-black tracking-tight mb-2">Create Account</h2>
                  <p className="text-white/50">Join the future of fashion</p>
                </div>

                <div className="space-y-4">
                  <motion.div variants={inputVariants} className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input 
                      placeholder="Full Name" 
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      error={!!errors.name}
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                  </motion.div>

                  <motion.div variants={inputVariants} className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input 
                      placeholder="Email Address" 
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      error={!!errors.email}
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                  </motion.div>

                  <motion.div variants={inputVariants} className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input 
                      placeholder="Phone Number (10 digits)" 
                      inputMode="numeric"
                      maxLength={10}
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value.replace(/\D/g, '') })}
                      error={!!errors.phone}
                    />
                    {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
                  </motion.div>

                  <motion.div variants={inputVariants} className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Password" 
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      error={!!errors.password}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                    
                    {/* Password Strength Indicator */}
                    {signupForm.password.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4].map((level) => (
                          <div 
                            key={level} 
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              strengthScore >= level 
                                ? strengthScore < 2 ? 'bg-red-500' : strengthScore < 4 ? 'bg-yellow-500' : 'bg-green-500'
                                : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={inputVariants} className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password" 
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      error={!!errors.confirmPassword}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
                  </motion.div>

                  <motion.div variants={inputVariants} className="flex items-start gap-2 mt-2">
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={signupForm.agreed} 
                      onChange={(e) => setSignupForm({ ...signupForm, agreed: e.target.checked })} 
                      className="mt-1 rounded border-white/20 bg-white/5 accent-white w-4 h-4 cursor-pointer" 
                    />
                    <label htmlFor="terms" className="text-sm text-white/60 cursor-pointer hover:text-white transition-colors leading-tight">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </motion.div>
                  {errors.agreed && <span className="text-red-500 text-xs block">{errors.agreed}</span>}
                </div>

                {errors.form && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {errors.form}
                  </motion.div>
                )}

                <motion.div variants={inputVariants}>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !signupForm.agreed}
                    className="w-full h-[52px] rounded-xl bg-white text-black hover:bg-white/90 font-bold text-base transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </motion.div>

                <motion.div variants={inputVariants} className="lg:hidden text-center mt-8">
                  <button type="button" onClick={() => setTab("login")} className="text-sm text-white/60 hover:text-white">
                    Already have an account? Sign in
                  </button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Sub-component for the Custom Input to keep it clean
const Input = ({ error, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) => (
  <input
    {...props}
    className={`
      w-full h-[52px] pl-12 pr-12 rounded-xl text-white
      bg-white/5 border 
      ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-white/40 focus:ring-white/10'}
      focus:outline-none focus:ring-4
      placeholder:text-white/30
      transition-all duration-300
      ${className}
    `}
  />
);
