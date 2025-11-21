import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cinematicScenes = [
  {
    name: "Tokyo Dawn",
    image: "https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=1920",
    gradient: "from-orange-900/60 via-pink-900/40 to-purple-900/60",
    time: "dawn"
  },
  {
    name: "Dubai Day",
    image: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=1920",
    gradient: "from-sky-500/50 via-blue-400/40 to-cyan-500/50",
    time: "day"
  },
  {
    name: "Santorini Sunset",
    image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1920",
    gradient: "from-orange-600/60 via-rose-500/50 to-pink-600/60",
    time: "sunset"
  },
  {
    name: "Morocco Night",
    image: "https://images.pexels.com/photos/2419375/pexels-photo-2419375.jpeg?auto=compress&cs=tinysrgb&w=1920",
    gradient: "from-slate-950/70 via-blue-950/60 to-slate-900/70",
    time: "night"
  }
];

export function AnimatedBackground() {
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % cinematicScenes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const scene = cinematicScenes[currentScene];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${scene.image})`,
              filter: "blur(1px)",
            }}
          />

          <div className={`absolute inset-0 bg-gradient-to-br ${scene.gradient}`} />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex gap-2">
          {cinematicScenes.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentScene
                  ? "w-12 bg-cyan-400"
                  : "w-8 bg-white/30"
              }`}
              animate={{
                opacity: index === currentScene ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
