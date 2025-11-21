import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ArrowLeft, MapPin, Calendar, Heart, Eye, User, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getPublicItineraries } from "@/services/itinerary";
import { Itinerary } from "@/lib/supabase";

export default function Community() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    setLoading(true);
    const data = await getPublicItineraries(20);
    setItineraries(data);
    setLoading(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <AnimatedBackground />

      <div className="fixed top-0 left-0 right-0 z-40 glass-strong border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-foreground hover:text-cyan-400"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-gradient-hero">Community Trips</h1>
          <div className="w-32"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-4">
            Explore Amazing Journeys
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get inspired by trips planned by fellow travelers from around the world
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <GlassCard key={i} className="p-6 animate-pulse">
                <div className="h-48 bg-muted/20 rounded-lg mb-4"></div>
                <div className="h-6 bg-muted/20 rounded mb-2"></div>
                <div className="h-4 bg-muted/20 rounded w-3/4"></div>
              </GlassCard>
            ))}
          </div>
        ) : itineraries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <GlassCard variant="strong" className="max-w-md mx-auto p-12">
              <TrendingUp className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No Community Trips Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share your amazing journey with the community!
              </p>
              <Button
                onClick={() => navigate("/step1")}
                className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
              >
                Create Your Trip
              </Button>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary, index) => (
              <motion.div
                key={itinerary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  className="p-6 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer group h-full"
                  onClick={() => {
                    toast.info("Detailed view coming soon!");
                  }}
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                        {itinerary.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-cyan-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {itinerary.destination} - {itinerary.num_days} Days
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>{itinerary.user_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>
                        {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>{itinerary.total_distance.toFixed(1)} km</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(itinerary.interests) &&
                      itinerary.interests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs glass border border-cyan-400/30 text-cyan-400"
                        >
                          {interest}
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {itinerary.views_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {itinerary.likes_count}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(itinerary.created_at)}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
