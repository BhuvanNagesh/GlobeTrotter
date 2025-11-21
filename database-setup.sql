-- Globe Trotter Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create places table
CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  place_name text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  distance_from_center numeric DEFAULT 0,
  recommended_time text DEFAULT '1-2 hours',
  entry_fee numeric DEFAULT 0,
  latitude numeric,
  longitude numeric,
  image_url text,
  rating numeric DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text NOT NULL,
  destination text NOT NULL,
  title text NOT NULL,
  num_days integer NOT NULL CHECK (num_days > 0),
  budget_range text,
  total_estimated_cost numeric DEFAULT 0,
  total_distance numeric DEFAULT 0,
  interests jsonb DEFAULT '[]'::jsonb,
  trip_type text DEFAULT 'solo',
  start_date date,
  end_date date,
  is_public boolean DEFAULT false,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create itinerary_days table
CREATE TABLE IF NOT EXISTS itinerary_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number integer NOT NULL CHECK (day_number > 0),
  date date,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(itinerary_id, day_number)
);

-- Create itinerary_places table
CREATE TABLE IF NOT EXISTS itinerary_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_day_id uuid NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  place_id uuid NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  time_slot text DEFAULT 'morning' CHECK (time_slot IN ('morning', 'afternoon', 'evening')),
  custom_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(itinerary_day_id, place_id)
);

-- Create community_likes table
CREATE TABLE IF NOT EXISTS community_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(itinerary_id, user_name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_places_city ON places(city);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_itineraries_user_name ON itineraries(user_name);
CREATE INDEX IF NOT EXISTS idx_itineraries_is_public ON itineraries(is_public);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON itineraries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_itinerary_id ON itinerary_days(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_places_day_id ON itinerary_places(itinerary_day_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_itinerary_id ON community_likes(itinerary_id);

-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for places
DROP POLICY IF EXISTS "Anyone can view places" ON places;
CREATE POLICY "Anyone can view places" ON places FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can insert places" ON places;
CREATE POLICY "Anyone can insert places" ON places FOR INSERT TO public WITH CHECK (true);

-- RLS Policies for itineraries
DROP POLICY IF EXISTS "Users can view itineraries" ON itineraries;
CREATE POLICY "Users can view itineraries" ON itineraries FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Users can create itineraries" ON itineraries;
CREATE POLICY "Users can create itineraries" ON itineraries FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update itineraries" ON itineraries;
CREATE POLICY "Users can update itineraries" ON itineraries FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete itineraries" ON itineraries;
CREATE POLICY "Users can delete itineraries" ON itineraries FOR DELETE TO public USING (true);

-- RLS Policies for itinerary_days
DROP POLICY IF EXISTS "Users can view days" ON itinerary_days;
CREATE POLICY "Users can view days" ON itinerary_days FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Users can manage days" ON itinerary_days;
CREATE POLICY "Users can manage days" ON itinerary_days FOR ALL TO public USING (true) WITH CHECK (true);

-- RLS Policies for itinerary_places
DROP POLICY IF EXISTS "Users can view places" ON itinerary_places;
CREATE POLICY "Users can view places" ON itinerary_places FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Users can manage places" ON itinerary_places;
CREATE POLICY "Users can manage places" ON itinerary_places FOR ALL TO public USING (true) WITH CHECK (true);

-- RLS Policies for community_likes
DROP POLICY IF EXISTS "Anyone can view likes" ON community_likes;
CREATE POLICY "Anyone can view likes" ON community_likes FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Users can manage likes" ON community_likes;
CREATE POLICY "Users can manage likes" ON community_likes FOR ALL TO public USING (true) WITH CHECK (true);

-- Success message
SELECT 'Database setup completed successfully!' as message;
