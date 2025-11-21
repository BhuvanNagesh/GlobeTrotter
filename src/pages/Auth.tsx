import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { X, Mail, Lock, User, Phone } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">(
    (searchParams.get("mode") as "login" | "signup") || "login"
  );
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "login" || modeParam === "signup") {
      setMode(modeParam);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      if (!formData.name || !formData.phone || !formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      
      // Store mock auth state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", formData.name);
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
      
      // Mock login
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", formData.email.split("@")[0]);
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <AnimatedBackground />

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-6 right-6 z-50 glass rounded-full hover:bg-white/20"
        onClick={() => navigate("/")}
      >
        <X className="w-5 h-5" />
      </Button>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <GlassCard variant="strong" className="p-8 shadow-[0_0_60px_rgba(6,182,212,0.4)]">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-gradient-hero mb-2 text-center">
                {mode === "login" ? "Welcome Back" : "Join TravelAI"}
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                {mode === "login"
                  ? "Continue your journey"
                  : "Start planning your dream adventures"}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="name" className="text-foreground mb-2 block">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 glass border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Label htmlFor="phone" className="text-foreground mb-2 block">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 glass border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all"
                      />
                    </div>
                  </motion.div>
                </>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mode === "signup" ? 0.3 : 0.2 }}
              >
                <Label htmlFor="email" className="text-foreground mb-2 block">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 glass border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mode === "signup" ? 0.35 : 0.25 }}
              >
                <Label htmlFor="password" className="text-foreground mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 glass border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
              </motion.div>

              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="confirmPassword" className="text-foreground mb-2 block">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="pl-10 glass border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mode === "signup" ? 0.45 : 0.3 }}
              >
                <Button
                  type="submit"
                  className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  {mode === "login" ? "Login" : "Create Account"} →
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: mode === "signup" ? 0.5 : 0.35 }}
              className="mt-6 text-center"
            >
              <p className="text-muted-foreground">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  {mode === "login" ? "Sign Up" : "Login"}
                </button>
              </p>
            </motion.div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
