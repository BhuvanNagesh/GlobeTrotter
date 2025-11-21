import { supabase, Place, Itinerary, ItineraryDay, ItineraryPlace } from '@/lib/supabase';

export type DayPlan = {
  dayNumber: number;
  date?: string;
  places: PlaceInDay[];
};

export type PlaceInDay = Place & {
  timeSlot: 'morning' | 'afternoon' | 'evening';
  orderIndex: number;
  customNotes?: string;
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function groupNearbyPlaces(places: Place[]): Place[] {
  if (places.length <= 1) return places;

  const sorted = [...places].sort((a, b) => a.distance_from_center - b.distance_from_center);
  return sorted;
}

export function generateItinerary(places: Place[], numDays: number): DayPlan[] {
  if (places.length === 0 || numDays <= 0) return [];

  const shuffledPlaces = shuffleArray(places);
  const groupedPlaces = groupNearbyPlaces(shuffledPlaces);

  const days: DayPlan[] = [];
  let placeIndex = 0;

  for (let day = 1; day <= numDays; day++) {
    const placesPerDay = Math.min(
      Math.floor(Math.random() * 3) + 2,
      groupedPlaces.length - placeIndex
    );

    const dayPlaces: PlaceInDay[] = [];
    const timeSlots: ('morning' | 'afternoon' | 'evening')[] = ['morning', 'afternoon', 'evening'];

    for (let i = 0; i < placesPerDay && placeIndex < groupedPlaces.length; i++) {
      const place = groupedPlaces[placeIndex];
      const timeSlot = timeSlots[i % timeSlots.length];

      dayPlaces.push({
        ...place,
        timeSlot,
        orderIndex: i
      });

      placeIndex++;
    }

    if (dayPlaces.length > 0) {
      days.push({
        dayNumber: day,
        places: dayPlaces
      });
    }

    if (placeIndex >= groupedPlaces.length) break;
  }

  return days;
}

export async function saveItinerary(
  userName: string,
  destination: string,
  tripType: string,
  startDate: string,
  endDate: string,
  interests: string[],
  dayPlans: DayPlan[]
): Promise<string | null> {
  try {
    const totalCost = dayPlans.reduce((sum, day) =>
      sum + day.places.reduce((daySum, place) => daySum + place.entry_fee, 0), 0
    );

    const totalDistance = dayPlans.reduce((sum, day) =>
      sum + day.places.reduce((daySum, place) => daySum + place.distance_from_center, 0), 0
    );

    const { data: itinerary, error: itineraryError } = await supabase
      .from('itineraries')
      .insert({
        user_name: userName,
        destination,
        title: `${destination} - ${dayPlans.length} Day Adventure`,
        num_days: dayPlans.length,
        trip_type: tripType,
        start_date: startDate,
        end_date: endDate,
        interests: JSON.stringify(interests),
        total_estimated_cost: totalCost,
        total_distance: totalDistance,
        is_public: false,
        status: 'draft'
      })
      .select()
      .single();

    if (itineraryError || !itinerary) {
      console.error('Error saving itinerary:', itineraryError);
      return null;
    }

    for (const dayPlan of dayPlans) {
      const { data: day, error: dayError } = await supabase
        .from('itinerary_days')
        .insert({
          itinerary_id: itinerary.id,
          day_number: dayPlan.dayNumber,
          date: dayPlan.date
        })
        .select()
        .single();

      if (dayError || !day) {
        console.error('Error saving day:', dayError);
        continue;
      }

      for (const place of dayPlan.places) {
        await supabase
          .from('itinerary_places')
          .insert({
            itinerary_day_id: day.id,
            place_id: place.id,
            order_index: place.orderIndex,
            time_slot: place.timeSlot,
            custom_notes: place.customNotes || ''
          });
      }
    }

    return itinerary.id;
  } catch (error) {
    console.error('Error in saveItinerary:', error);
    return null;
  }
}

export async function loadItinerary(itineraryId: string): Promise<DayPlan[] | null> {
  try {
    const { data: days, error: daysError } = await supabase
      .from('itinerary_days')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .order('day_number');

    if (daysError || !days) {
      console.error('Error loading days:', daysError);
      return null;
    }

    const dayPlans: DayPlan[] = [];

    for (const day of days) {
      const { data: itineraryPlaces, error: placesError } = await supabase
        .from('itinerary_places')
        .select('*, places(*)')
        .eq('itinerary_day_id', day.id)
        .order('order_index');

      if (placesError || !itineraryPlaces) {
        continue;
      }

      const places: PlaceInDay[] = itineraryPlaces.map((ip: any) => ({
        ...ip.places,
        timeSlot: ip.time_slot,
        orderIndex: ip.order_index,
        customNotes: ip.custom_notes
      }));

      dayPlans.push({
        dayNumber: day.day_number,
        date: day.date,
        places
      });
    }

    return dayPlans;
  } catch (error) {
    console.error('Error in loadItinerary:', error);
    return null;
  }
}

export async function getPublicItineraries(limit: number = 20): Promise<Itinerary[]> {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('is_public', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching public itineraries:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPublicItineraries:', error);
    return [];
  }
}

export async function publishItinerary(itineraryId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('itineraries')
      .update({ is_public: true, status: 'published' })
      .eq('id', itineraryId);

    return !error;
  } catch (error) {
    console.error('Error publishing itinerary:', error);
    return false;
  }
}
