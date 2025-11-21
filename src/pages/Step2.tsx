import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth";

export default function Step2() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInterest, setCustomInterest] = useState("");
  const [destination, setDestination] = useState("");

  const getInterestsForDestination = (dest: string) => {
    const destLower = dest.toLowerCase();

    if (destLower.includes("andaman")) {
      return [
        "Beaches 🏖️",
        "Islands 🏝️",
        "Adventure Sports 🤿",
        "Historical 🏰",
        "Temples 🛕",
        "Nightlife 🌃",
        "Nature & Wildlife 🌿"
      ];
    }

    if (destLower.includes("manali")) {
      return [
        "Mountains & Valleys 🏔️",
        "Adventure Sports 🧗‍♂️",
        "Historical & Cultural 🏰",
        "Nature & Waterfalls 🌿",
        "Cafes & Nightlife ☕",
        "Hotels & Stay 🛏️",
        "Local Markets & Shopping 🛍️"
      ];
    }

    if (destLower.includes("chikmagalur")) {
      return [
        "Lakes & Water Bodies 🏞️",
        "Mountains & Hills ⛰️",
        "Adventure & Trekking 🥾",
        "Historical & Heritage 🏰",
        "Temples & Spiritual Sites 🛕",
        "Coffee Culture & Plantations ☕",
        "Nature & Wildlife 🌿"
      ];
    }

    if (destLower.includes("bihar")) {
      return [
        "Heritage & Historical 🏯",
        "Spiritual & Religious 🛕",
        "Nature & Wildlife 🌿",
        "Urban & Museums 🏙️",
        "Food & Culture 🍲"
      ];
    }

    return [
      "Must-see Attractions",
      "Museums & Art",
      "Great Food",
      "Cultural Landmarks",
      "Adventure Sports",
      "Nature & Wildlife",
      "Shopping",
      "Nightlife"
    ];
  };

  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const checkAuthAndData = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          toast.error("Please login to continue");
          navigate("/auth?mode=login", { replace: true });
          return;
        }

        const step1Data = localStorage.getItem("step1Data");
        if (!step1Data) {
          toast.error("Please complete Step 1 first");
          navigate("/step1", { replace: true });
          return;
        }

        const data = JSON.parse(step1Data);
        setDestination(data.destination);
        setInterests(getInterestsForDestination(data.destination));
      } catch (e) {
        toast.error("Authentication check failed. Please log in.");
        navigate("/auth?mode=login", { replace: true });
      }
    };
    checkAuthAndData();
  }, [navigate]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleAddCustom = () => {
    if (customInterest.trim()) {
      if (!interests.includes(customInterest.trim())) {
        setInterests((prev) => [...prev, customInterest.trim()]);
      }
      setSelectedInterests((prev) => [...prev, customInterest.trim()]);
      setCustomInterest("");
      setShowCustomInput(false);
      toast.success("Custom interest added!");
    }
  };

  const handleContinue = () => {
    if (selectedInterests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    localStorage.setItem("step2Data", JSON.stringify({ interests: selectedInterests }));
    toast.success("Great choices! Let's pick your places.");
    navigate("/step3");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <AnimatedBackground />

      <div className="fixed top-0 left-0 right-0 z-40 glass-strong">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-foreground hover:text-cyan-400"
            onClick={() => navigate("/step1")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Destination
          </Button>
          <div className="flex gap-3 items-center">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-sm text-cyan-400">AI is listening...</span>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-sm text-muted-foreground">Step 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
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
        className="w-full max-w-4xl mt-16 mb-8"
      >
        <GlassCard variant="strong" className="p-6 md:p-8 shadow-[0_0_60px_rgba(6,182,212,0.4)]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-hero mb-3">
              What sparks your curiosity?
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the experiences that define your journey to{" "}
              <span className="text-cyan-400 font-medium">{destination}</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 mb-4">
            {interests.map((interest, index) => (
              <motion.button
                key={interest}
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleInterest(interest)}
                className={`p-4 rounded-xl glass border-2 transition-all duration-300 relative overflow-hidden group ${
                  selectedInterests.includes(interest)
                    ? "border-cyan-400 bg-gradient-to-br from-cyan-400/20 to-violet-400/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    : "border-white/20 hover:border-cyan-400/50"
                }`}
              >
                {selectedInterests.includes(interest) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-violet-400/10"
                  />
                )}
                <span className="relative text-sm font-medium text-foreground">{interest}</span>
              </motion.button>
            ))}

            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + interests.length * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCustomInput(true)}
              className="p-4 rounded-xl glass border-2 border-dashed border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 group"
            >
              <Plus className="w-5 h-5 mx-auto mb-1 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-medium text-cyan-400">Add Your Own</span>
            </motion.button>
          </div>

          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-xl glass border border-cyan-400/30"
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your custom interest..."
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCustom()}
                  className="glass border-white/20 focus:border-cyan-400"
                  autoFocus
                />
                <Button
                  onClick={handleAddCustom}
                  className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
                >
                  Add
                </Button>
                <Button variant="ghost" onClick={() => setShowCustomInput(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {selectedInterests.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-6"
            >
              <p className="text-sm text-muted-foreground">
                <span className="text-cyan-400 font-medium">{selectedInterests.length}</span>{" "}
                interest{selectedInterests.length !== 1 ? "s" : ""} selected
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleContinue}
              disabled={selectedInterests.length === 0}
              className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
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
        </GlassCard>
      </motion.div>
    </div>
  );
}
