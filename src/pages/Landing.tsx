import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { FeatureCard } from "@/components/FeatureCard";
import { Sparkles, Route, Shield, Download, Calculator, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export default function Landing() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      const name = localStorage.getItem("userName");
      setIsAuthenticated(authStatus === "true");
      setUserName(name || "User");
    };
    checkAuth();
    // Listen for storage changes (in case user logs in from another tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };
  const handleStartPlanning = () => {
    if (isAuthenticated) {
      navigate("/step1");
    } else {
      navigate("/auth?mode=login");
    }
  };
  const features = [{
    icon: Sparkles,
    title: "AI-Powered Itineraries",
    description: "Get personalized trip plans tailored to your preferences, budget, and travel style."
  }, {
    icon: Route,
    title: "Smart Route Planning",
    description: "Optimized routes that save time and help you discover the best spots along the way."
  }, {
    icon: Shield,
    title: "Safety First",
    description: "Real-time safety alerts, SOS features, and emergency contacts for peace of mind."
  }, {
    icon: Download,
    title: "Offline Access",
    description: "Download your itinerary and maps to access everything without internet connection."
  }, {
    icon: Calculator,
    title: "Smart Budget Calculator",
    description: "Track, split, and convert expenses in real time."
  }];
  return <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} className="text-2xl font-bold text-gradient-hero">Globe Trotter</motion.div>
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} className="flex gap-3 items-center">
            {isAuthenticated ? <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, <span className="text-cyan-400 font-medium">{userName}</span>
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="glass rounded-full hover:bg-cyan-400/20 transition-all">
                      <User className="w-5 h-5 text-cyan-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-strong border-white/20" align="end">
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-white/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </> : <>
                <Button variant="ghost" className="text-foreground hover:text-cyan-400 transition-colors" onClick={() => navigate("/auth?mode=login")}>
                  Login
                </Button>
                <Button className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white shadow-lg hover:shadow-cyan-500/50 transition-all duration-300" onClick={() => navigate("/auth?mode=signup")}>
                  Sign Up
                </Button>
              </>}
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="container mx-auto text-center">
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-6xl md:text-8xl font-bold mb-6 text-gradient-hero leading-tight">
            Your Next Adventure
            <br />
            Starts Here
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3,
          duration: 0.8
        }} className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Plan unforgettable trips with AI-powered itineraries, discover hidden gems, and travel smarter.
          </motion.p>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6,
          duration: 0.8
        }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 animate-glow-pulse" onClick={handleStartPlanning}>
              Start Planning →
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 glass border-2 border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/10 text-foreground transition-all duration-300" onClick={handleStartPlanning}>
              Explore Community Trips
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-hero">
              Everything You Need for Effortless Adventures
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make travel planning effortless and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => <FeatureCard key={index} {...feature} index={index} />)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} whileInView={{
        opacity: 1,
        scale: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="container mx-auto max-w-4xl">
          <div className="glass-strong rounded-3xl p-12 text-center shadow-[0_0_60px_rgba(6,182,212,0.3)]">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-hero">
              Ready to Explore?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of travelers who are already planning their dream adventures with AI.
            </p>
            <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white shadow-xl hover:shadow-cyan-500/50 transition-all duration-300" onClick={handleStartPlanning}>
              {isAuthenticated ? "Start Planning →" : "Get Started Free →"}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>;
}