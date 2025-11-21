import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ArrowLeft, Plus, Trash2, GripVertical, Calendar, DollarSign, MapPin, Share2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { generateItinerary, saveItinerary, DayPlan, PlaceInDay } from "@/services/itinerary";
import { Place } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Step4() {
  const navigate = useNavigate();
  const [numDays, setNumDays] = useState(3);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [showDaysInput, setShowDaysInput] = useState(true);
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [itineraryId, setItineraryId] = useState<string | null>(null);

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
        const step2Data = localStorage.getItem("step2Data");
        const step3Data = localStorage.getItem("step3Data");

        if (!step1Data || !step2Data || !step3Data) {
          toast.error("Please complete previous steps");
          navigate("/step1", { replace: true });
          return;
        }

        const data1 = JSON.parse(step1Data);
        const data2 = JSON.parse(step2Data);
        const data3 = JSON.parse(step3Data);

        setDestination(data1.destination);
        setTripType(data1.tripType);
        setStartDate(data1.startDate);
        setEndDate(data1.endDate);
        setInterests(data2.interests);

        const allPlacesData = [
          { city: "Andaman", place_name: "Radhanagar Beach", category: "Beaches 🏖️", description: "Famous for its sunset views and soft white sand on Havelock Island.", image: "/image/Radhanagar_Beach_Andaman.jpg", rating: 4.9, distance_from_center: 54, recommended_time: "3-4 hours", entry_fee: 0 },
          { city: "Andaman", place_name: "Elephant Beach", category: "Beaches 🏖️", description: "Adventure hotspot known for snorkeling and coral reefs.", image: "/image/Elephant_Beach_Andaman.jpg", rating: 4.7, distance_from_center: 23, recommended_time: "2-3 hours", entry_fee: 0 },
          { city: "Andaman", place_name: "Cellular Jail", category: "Historical 🏰", description: "Iconic colonial prison and Indian freedom struggle site.", image: "/image/Cellular_jail_Andama.jpg", rating: 4.8, distance_from_center: 2, recommended_time: "2 hours", entry_fee: 30 },
          { city: "Andaman", place_name: "Ross Island", category: "Islands 🏝️", description: "Historical island with British ruins and peacocks.", image: "/image/Ross_island_-_Andaman.jpg", rating: 4.8, distance_from_center: 3, recommended_time: "2-3 hours", entry_fee: 50 },
          { city: "Andaman", place_name: "Mount Harriet National Park", category: "Nature & Wildlife 🌿", description: "Scenic mountain trails and lush green landscapes.", image: "/image/Mount_harriet_ andaman.jpg", rating: 4.6, distance_from_center: 38, recommended_time: "4-5 hours", entry_fee: 25 },
          { city: "Manali", place_name: "Rohtang Pass", category: "Mountains & Valleys 🏔️", description: "High mountain pass offering panoramic views and snow adventures.", image: "/image/Manali_to_Rohtang_Pass.jpg", rating: 4.8, distance_from_center: 51, recommended_time: "Full day", entry_fee: 50 },
          { city: "Manali", place_name: "Solang Valley", category: "Adventure Sports 🧗‍♂️", description: "Adventure and skiing hub surrounded by majestic peaks.", image: "/image/Solang_Valley,_Manali.jpg", rating: 4.7, distance_from_center: 14, recommended_time: "4-5 hours", entry_fee: 0 },
          { city: "Manali", place_name: "Hadimba Temple", category: "Historical & Cultural 🏰", description: "Ancient wooden temple dedicated to Goddess Hadimba Devi.", image: "/image/Hadimba_temple_Manali.jpg", rating: 4.7, distance_from_center: 2, recommended_time: "1-2 hours", entry_fee: 0 },
          { city: "Manali", place_name: "Café 1947", category: "Cafes & Nightlife ☕", description: "Iconic riverside café in Old Manali serving Italian cuisine.", image: "/image/Cafe_1947_manali.jpg", rating: 4.6, distance_from_center: 3, recommended_time: "1-2 hours", entry_fee: 0 },
          { city: "Manali", place_name: "Mall Road", category: "Local Markets & Shopping 🛍️", description: "Main shopping street for woollens, souvenirs, and local food.", image: "/image/Mall_Road_Manali.jpeg", rating: 4.6, distance_from_center: 1, recommended_time: "2-3 hours", entry_fee: 0 },
          { city: "Chikmagalur", place_name: "Mullayanagiri", category: "Mountains & Hills ⛰️", description: "Highest peak in Karnataka at 1,930m with stunning panoramic views.", image: "/image/Mullayyanagiri_Betta_Chik.jpg", rating: 4.9, distance_from_center: 23, recommended_time: "Half day", entry_fee: 0 },
          { city: "Chikmagalur", place_name: "Baba Budangiri", category: "Mountains & Hills ⛰️", description: "Mountain range with caves and shrine, known for scenic beauty.", image: "/image/Baba_Budangiri,_Chikmagalur.jpg", rating: 4.7, distance_from_center: 28, recommended_time: "Half day", entry_fee: 10 },
          { city: "Chikmagalur", place_name: "Hirekolale Lake", category: "Lakes & Water Bodies 🏞️", description: "Picturesque man-made lake with stunning mountain backdrop.", image: "/image/Hirekolale_Lake_Chikmagalur.jpg", rating: 4.6, distance_from_center: 10, recommended_time: "1-2 hours", entry_fee: 0 },
          { city: "Chikmagalur", place_name: "Belavadi Veeranarayana Temple", category: "Historical & Heritage 🏰", description: "Hoysala architectural marvel with intricate stone carvings.", image: "/image/VeeranarayanaTemple-Belavadi-Chikmagalur.jpg", rating: 4.6, distance_from_center: 32, recommended_time: "1-2 hours", entry_fee: 0 },
          { city: "Chikmagalur", place_name: "Hebbe Falls", category: "Adventure & Trekking 🥾", description: "Spectacular waterfall accessible via jeep ride through coffee estates.", image: "/image/Hebbe_Falls_Chikmagalur.jpg", rating: 4.7, distance_from_center: 35, recommended_time: "3-4 hours", entry_fee: 50 },
          { city: "Chikmagalur", place_name: "Coffee Museum", category: "Coffee Culture & Plantations ☕", description: "Interactive museum showcasing history and process of coffee.", image: "/image/Coffee_Museum_Chikmagalur.jpeg", rating: 4.5, distance_from_center: 2, recommended_time: "1 hour", entry_fee: 20 },
          { city: "Chikmagalur", place_name: "Belur Chennakeshava Temple", category: "Historical & Heritage 🏰", description: "Stunning 12th-century Hoysala temple known for intricate carvings.", image: "/image/Chennakeshava_Temple_Chikmagalur.jpg", rating: 4.7, distance_from_center: 38, recommended_time: "2 hours", entry_fee: 0 },
          { city: "Bihar", place_name: "Nalanda University Ruins", category: "Heritage & Historical 🏯", description: "Ancient Buddhist university and UNESCO World Heritage Site.", image: "/image/Nalanda_University_Nalanda_Bihar.jpg", rating: 4.8, distance_from_center: 95, recommended_time: "3-4 hours", entry_fee: 15 },
          { city: "Bihar", place_name: "Mahabodhi Temple, Bodh Gaya", category: "Spiritual & Religious 🛕", description: "UNESCO site where Lord Buddha attained enlightenment.", image: "/image/Mahabodhi_Temple_Bihar.jpg", rating: 4.9, distance_from_center: 115, recommended_time: "3-4 hours", entry_fee: 0 },
          { city: "Bihar", place_name: "Valmiki Tiger Reserve", category: "Nature & Wildlife 🌿", description: "Bihar's only tiger reserve, home to tigers, leopards, and elephants.", image: "/image/Valmiki_Tiger_Bihar.jpeg", rating: 4.7, distance_from_center: 280, recommended_time: "Full day", entry_fee: 100 },
          { city: "Bihar", place_name: "Litti Chokha Stalls, Patna", category: "Food & Culture 🍲", description: "Street-side delicacies representing the true flavor of Bihar.", image: "/image/litti_chokha_stall.jpeg", rating: 4.7, distance_from_center: 5, recommended_time: "1 hour", entry_fee: 0 }
        ];

        const placesWithIds: Place[] = allPlacesData
          .filter(p => p.city.toLowerCase() === data1.destination.toLowerCase())
          .filter(p => data3.places.includes(p.place_name))
          .map(p => ({
            id: `${p.city}-${p.place_name}`,
            city: p.city,
            place_name: p.place_name,
            category: p.category,
            description: p.description,
            distance_from_center: p.distance_from_center,
            recommended_time: p.recommended_time,
            entry_fee: p.entry_fee,
            image_url: p.image,
            rating: p.rating,
            latitude: 0,
            longitude: 0
          }));

        setSelectedPlaces(placesWithIds);
      } catch (e) {
        toast.error("Authentication check failed. Please log in.");
        navigate("/auth?mode=login", { replace: true });
      }
    };

    checkAuthAndData();
  }, [navigate]);

  const handleGenerateItinerary = () => {
    if (numDays <= 0 || numDays > 30) {
      toast.error("Please enter a valid number of days (1-30)");
      return;
    }

    if (selectedPlaces.length === 0) {
      toast.error("No places selected");
      return;
    }

    const plans = generateItinerary(selectedPlaces, numDays);
    setDayPlans(plans);
    setShowDaysInput(false);
    toast.success(`${plans.length}-day itinerary generated!`);
  };

  const handleAddDay = () => {
    const newDay: DayPlan = {
      dayNumber: dayPlans.length + 1,
      places: []
    };
    setDayPlans([...dayPlans, newDay]);
  };

  const handleRemoveDay = (dayNumber: number) => {
    const filtered = dayPlans.filter(d => d.dayNumber !== dayNumber);
    const renumbered = filtered.map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    setDayPlans(renumbered);
    toast.success("Day removed");
  };

  const handleRemovePlaceFromDay = (dayNumber: number, placeId: string) => {
    setDayPlans(dayPlans.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          places: day.places.filter(p => p.id !== placeId)
        };
      }
      return day;
    }));
    toast.success("Place removed");
  };

  const handleReorderPlaces = (dayNumber: number, newOrder: PlaceInDay[]) => {
    setDayPlans(dayPlans.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          places: newOrder.map((p, idx) => ({ ...p, orderIndex: idx }))
        };
      }
      return day;
    }));
  };

  const handleSaveAndShare = async () => {
    const user = await authService.getCurrentUser();
    if (!user) {
      toast.error("Please login to save");
      return;
    }

    const id = await saveItinerary(
      user.name,
      destination,
      tripType,
      startDate,
      endDate,
      interests,
      dayPlans
    );

    if (id) {
      setItineraryId(id);
      setShowShareDialog(true);
      toast.success("Itinerary saved successfully!");
    } else {
      toast.error("Failed to save itinerary");
    }
  };

  const getTotalCost = () => {
    return dayPlans.reduce((sum, day) =>
      sum + day.places.reduce((daySum, place) => daySum + place.entry_fee, 0), 0
    );
  };

  const getTotalDistance = () => {
    return dayPlans.reduce((sum, day) =>
      sum + day.places.reduce((daySum, place) => daySum + place.distance_from_center, 0), 0
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <AnimatedBackground />

      <div className="fixed top-0 left-0 right-0 z-40 glass-strong border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-foreground hover:text-cyan-400"
            onClick={() => navigate("/step3")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gradient-hero">Your Itinerary</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-32">
        <AnimatePresence mode="wait">
          {showDaysInput ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto mt-20"
            >
              <GlassCard variant="strong" className="p-8">
                <h2 className="text-2xl font-bold text-gradient-hero mb-4 text-center">
                  How many days?
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  We'll distribute {selectedPlaces.length} places across your trip
                </p>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={numDays}
                  onChange={(e) => setNumDays(parseInt(e.target.value) || 1)}
                  className="text-center text-2xl h-16 glass border-cyan-400/30 focus:border-cyan-400 mb-6"
                />
                <Button
                  onClick={handleGenerateItinerary}
                  className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
                >
                  Generate Itinerary
                </Button>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gradient-hero">
                    {destination} - {dayPlans.length} Days
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    {startDate} to {endDate}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleAddDay}
                    className="glass border-cyan-400/30 hover:border-cyan-400"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Day
                  </Button>
                  <Button
                    onClick={handleSaveAndShare}
                    className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Save & Share
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <GlassCard className="p-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{dayPlans.length} Days</p>
                  </div>
                </GlassCard>
                <GlassCard className="p-4 flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="font-semibold">₹{getTotalCost()}</p>
                  </div>
                </GlassCard>
                <GlassCard className="p-4 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                    <p className="font-semibold">{getTotalDistance().toFixed(1)} km</p>
                  </div>
                </GlassCard>
              </div>

              {dayPlans.map((day) => (
                <motion.div
                  key={day.dayNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard variant="strong" className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-cyan-400">
                        Day {day.dayNumber}
                      </h3>
                      {dayPlans.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDay(day.dayNumber)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove Day
                        </Button>
                      )}
                    </div>

                    <Reorder.Group
                      axis="y"
                      values={day.places}
                      onReorder={(newOrder) => handleReorderPlaces(day.dayNumber, newOrder)}
                      className="space-y-3"
                    >
                      {day.places.map((place) => (
                        <Reorder.Item
                          key={place.id}
                          value={place}
                          className="glass rounded-lg p-4 cursor-move hover:border-cyan-400/50 transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <GripVertical className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">
                                  {place.place_name}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemovePlaceFromDay(day.dayNumber, place.id)}
                                  className="text-red-400 hover:text-red-300 flex-shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {place.distance_from_center} km
                                </span>
                                <span>•</span>
                                <span>{place.recommended_time}</span>
                                <span>•</span>
                                <span>₹{place.entry_fee}</span>
                                <span>•</span>
                                <span className="capitalize">{place.timeSlot}</span>
                              </div>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>

                    {day.places.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No places assigned to this day
                      </p>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="glass-strong border-cyan-400/30">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gradient-hero">
              <Check className="w-6 h-6 inline mr-2 text-green-400" />
              Itinerary Saved!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Your {dayPlans.length}-day trip to {destination} has been saved successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground mb-2">Would you like to share this itinerary with the community?</p>
            <p className="text-sm text-muted-foreground">
              Other travelers can view and get inspired by your trip plan.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowShareDialog(false);
                navigate("/");
              }}
              className="glass border-white/20"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => {
                toast.success("Itinerary published to community!");
                setShowShareDialog(false);
                navigate("/");
              }}
              className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
            >
              Share to Community
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
