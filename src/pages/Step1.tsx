import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const tripTypes = [
  { id: "solo", label: "Solo", icon: "🧳" },
  { id: "couple", label: "Couple", icon: "💑" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "friends", label: "Friends", icon: "👥" },
];

export default function Step1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    tripType: "",
    startDate: "",
    endDate: "",
    travelers: 1,
  });

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      toast.error("Please login to continue");
      navigate("/auth?mode=login");
    }
  }, [navigate]);

  const handleContinue = () => {
    if (!formData.destination || !formData.tripType || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    // Store form data
    localStorage.setItem("step1Data", JSON.stringify(formData));
    navigate("/step2");
  };

  useEffect(() => {
    if (formData.tripType === "solo") {
      setFormData((prev) => ({ ...prev, travelers: 1 }));
    }
  }, [formData.tripType]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 glass-strong">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-foreground hover:text-cyan-400"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-muted-foreground">Step 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted" />
              <span className="text-sm text-muted-foreground">Step 2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted" />
              <span className="text-sm text-muted-foreground">Step 3</span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mt-16 mb-8"
      >
        <GlassCard variant="strong" className="p-6 md:p-8 shadow-[0_0_60px_rgba(6,182,212,0.4)]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-hero mb-3">
              Where to?
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your dream destination and travel style
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Destination */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="destination" className="text-foreground mb-2 block text-lg">
                Destination
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <Input
                  id="destination"
                  placeholder="Search destinations... (e.g., Bali, Paris, Tokyo)"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="pl-10 py-6 text-lg glass border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all"
                />
              </div>
            </motion.div>

            {/* Trip Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label className="text-foreground mb-3 block text-lg">Trip Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tripTypes.map((type, index) => (
                  <motion.button
                    key={type.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    onClick={() => setFormData({ ...formData, tripType: type.id })}
                    className={`p-4 rounded-xl glass border-2 transition-all duration-300 ${
                      formData.tripType === type.id
                        ? "border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        : "border-white/20 hover:border-cyan-400/50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-foreground">{type.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Dates */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <Label htmlFor="startDate" className="text-foreground mb-2 block">
                  Start Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="pl-10 py-6 glass border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate" className="text-foreground mb-2 block">
                  End Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="pl-10 py-6 glass border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Travelers */}
            {formData.tripType && formData.tripType !== "solo" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Label htmlFor="travelers" className="text-foreground mb-2 block">
                  Number of Travelers
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, travelers: Math.max(1, formData.travelers - 1) })}
                    className="h-12 w-12 glass border-white/20 hover:border-cyan-400 hover:bg-cyan-400/10 text-cyan-400 text-xl"
                  >
                    −
                  </Button>
                  <div className="relative flex-1">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <Input
                      id="travelers"
                      type="text"
                      inputMode="numeric"
                      value={formData.travelers}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value === "0") {
                          setFormData({ ...formData, travelers: 0 });
                        } else {
                          const num = parseInt(value);
                          if (!isNaN(num) && num >= 1 && num <= 20) {
                            setFormData({ ...formData, travelers: num });
                          }
                        }
                      }}
                      onBlur={() => {
                        if (formData.travelers === 0 || !formData.travelers) {
                          setFormData({ ...formData, travelers: 1 });
                        }
                      }}
                      className="pl-10 py-6 text-lg text-center glass border-white/20 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, travelers: Math.min(20, formData.travelers + 1) })}
                    className="h-12 w-12 glass border-white/20 hover:border-cyan-400 hover:bg-cyan-400/10 text-cyan-400 text-xl"
                  >
                    +
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-4"
            >
              <Button
                onClick={handleContinue}
                className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 group"
              >
                Continue →
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </Button>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
