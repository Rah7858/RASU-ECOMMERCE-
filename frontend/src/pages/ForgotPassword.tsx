import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Mail, KeyRound, ArrowRight, ShieldCheck, Sparkles, Package, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type Step = "request" | "reset" | "success";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1 Form
  const [emailOrPhone, setEmailOrPhone] = useState("");
  
  // Step 2 Form
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError("Email or phone is required");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send reset link");

      toast.success("Reset code sent!");
      
      // FOR DEVELOPMENT: Automatically fill OTP if backend provided it
      if (data.devOtp) {
        setOtp(data.devOtp);
        toast.info(`Dev Mode: OTP Auto-filled (${data.devOtp})`, { duration: 5000 });
      }

      setStep("reset");
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, otp, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reset password");

      toast.success("Password reset successfully!");
      setStep("success");
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
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
      {/* LEFT: Brand Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 lg:p-24 border-r border-white/10">
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
          <button onClick={() => navigate("/login")} className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300">
            Remembered your password? Sign in
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* RIGHT: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 xs:p-8 sm:p-12 lg:p-24 relative">
        <div className="absolute top-6 left-4 xs:top-8 xs:left-6 lg:hidden flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-2xl font-black tracking-tighter">RASU.</h1>
        </div>

        <div className="w-full max-w-md pt-20 lg:pt-0">
          <AnimatePresence mode="wait">
            {step === "request" && (
              <motion.form 
                key="forgot-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                onSubmit={handleRequestReset}
                className="space-y-6"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <KeyRound className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-[2rem] font-black tracking-tight mb-2">Reset Password</h2>
                  <p className="text-white/50">Enter your email and we'll send you a 6-digit code to reset your password.</p>
                </div>

                <div className="space-y-4">
                  <motion.div variants={inputVariants} className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      placeholder="Email Address" 
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className={`
                        w-full h-[52px] pl-12 pr-4 rounded-xl text-white
                        bg-white/5 border 
                        ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/40'}
                        focus:outline-none focus:ring-4 focus:ring-white/10
                        placeholder:text-white/30
                        transition-all duration-300
                      `}
                    />
                    {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
                  </motion.div>
                </div>

                <motion.div variants={inputVariants}>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !emailOrPhone.trim()}
                    className="w-full h-[52px] rounded-xl bg-white text-black hover:bg-white/90 font-bold text-base transition-all duration-300"
                  >
                    {isLoading ? "Sending..." : "Send Reset Code"}
                  </Button>
                </motion.div>

                <motion.div variants={inputVariants} className="text-center mt-8">
                  <button type="button" onClick={() => navigate("/login")} className="text-sm text-white/60 hover:text-white transition-colors">
                    Back to login
                  </button>
                </motion.div>
              </motion.form>
            )}

            {step === "reset" && (
              <motion.form 
                key="reset-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                onSubmit={handleResetPassword}
                className="space-y-6"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-[2rem] font-black tracking-tight mb-2">Enter Code</h2>
                  <p className="text-white/50">Enter the 6-digit code sent to your email and choose a new password.</p>
                </div>

                <div className="space-y-4">
                  <motion.div variants={inputVariants} className="relative">
                    <input
                      placeholder="6-Digit OTP Code" 
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className={`
                        w-full h-[52px] px-4 rounded-xl text-white text-center tracking-widest text-lg font-mono
                        bg-white/5 border 
                        ${error && otp.length !== 6 ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/40'}
                        focus:outline-none focus:ring-4 focus:ring-white/10
                        placeholder:text-white/30 placeholder:tracking-normal placeholder:font-sans
                        transition-all duration-300
                      `}
                    />
                  </motion.div>

                  <motion.div variants={inputVariants} className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`
                        w-full h-[52px] pl-12 pr-12 rounded-xl text-white
                        bg-white/5 border 
                        ${error && newPassword.length < 8 ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/40'}
                        focus:outline-none focus:ring-4 focus:ring-white/10
                        placeholder:text-white/30
                        transition-all duration-300
                      `}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
                  </motion.div>
                </div>

                <motion.div variants={inputVariants}>
                  <Button 
                    type="submit" 
                    disabled={isLoading || otp.length !== 6 || newPassword.length < 8}
                    className="w-full h-[52px] rounded-xl bg-white text-black hover:bg-white/90 font-bold text-base transition-all duration-300"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </motion.div>

                <motion.div variants={inputVariants} className="text-center mt-8">
                  <button type="button" onClick={() => setStep("request")} className="text-sm text-white/60 hover:text-white transition-colors">
                    Back
                  </button>
                </motion.div>
              </motion.form>
            )}

            {step === "success" && (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                className="text-center space-y-6"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black mb-2">Password Reset!</h2>
                  <p className="text-white/60">
                    Your password has been successfully changed. You can now log in with your new credentials.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full h-[52px] rounded-xl bg-white text-black hover:bg-white/90 font-bold"
                >
                  Return to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
