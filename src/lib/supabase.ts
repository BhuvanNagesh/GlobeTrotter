import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Place = {
  id: string;
  city: string;
  place_name: string;
  category: string;
  description: string;
  distance_from_center: number;
  recommended_time: string;
  entry_fee: number;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  rating: number;
  created_at?: string;
  updated_at?: string;
};

export type Itinerary = {
  id: string;
  user_name: string;
  destination: string;
  title: string;
  num_days: number;
  budget_range?: string;
  total_estimated_cost: number;
  total_distance: number;
  interests: string[];
  trip_type: string;
  start_date?: string;
  end_date?: string;
  is_public: boolean;
  views_count: number;
  likes_count: number;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
};

export type ItineraryDay = {
  id: string;
  itinerary_id: string;
  day_number: number;
  date?: string;
  notes: string;
  created_at?: string;
};

export type ItineraryPlace = {
  id: string;
  itinerary_day_id: string;
  place_id: string;
  order_index: number;
  time_slot: 'morning' | 'afternoon' | 'evening';
  custom_notes: string;
  created_at?: string;
};
