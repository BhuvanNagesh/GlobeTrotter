import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <GlassCard className="p-6 h-full hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all duration-300 group">
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 w-fit group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </GlassCard>
    </motion.div>
  );
}
