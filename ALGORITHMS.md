# Globe Trotter - Algorithms & Logic

## Core Algorithms

### 1. Itinerary Generation Algorithm

```typescript
function generateItinerary(places: Place[], numDays: number): DayPlan[]
```

**Input**:
- `places[]`: Array of selected places from Step 3
- `numDays`: Number of days for the trip

**Process**:
1. **Randomization**: Shuffle places array to create variety
   ```typescript
   const shuffled = shuffleArray(places);
   ```

2. **Proximity Grouping**: Sort by distance from city center
   ```typescript
   const sorted = places.sort((a, b) =>
     a.distance_from_center - b.distance_from_center
   );
   ```
   *Why?* Places near each other are grouped on the same day

3. **Distribution Logic**:
   ```typescript
   for (day = 1 to numDays) {
     placesPerDay = random(2, 4)  // 2 to 4 places per day
     placesPerDay = min(placesPerDay, remainingPlaces)
   }
   ```

4. **Time Slot Assignment**:
   ```typescript
   timeSlots = ['morning', 'afternoon', 'evening']
   for (i = 0 to placesPerDay) {
     place.timeSlot = timeSlots[i % 3]
   }
   ```
   *Cycles through morning → afternoon → evening*

5. **Order Index**: Assign position within day
   ```typescript
   place.orderIndex = i  // 0, 1, 2, ...
   ```

**Output**: Array of `DayPlan` objects
```typescript
[
  {
    dayNumber: 1,
    places: [
      { ...place1, timeSlot: 'morning', orderIndex: 0 },
      { ...place2, timeSlot: 'afternoon', orderIndex: 1 }
    ]
  },
  { dayNumber: 2, places: [...] }
]
```

---

### 2. Shuffle Algorithm (Fisher-Yates)

```typescript
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(n)
**Properties**:
- Unbiased random permutation
- Each arrangement equally likely

---

### 3. Proximity Grouping Algorithm

```typescript
function groupNearbyPlaces(places: Place[]): Place[] {
  return places.sort((a, b) =>
    a.distance_from_center - b.distance_from_center
  );
}
```

**Logic**:
- Sorts places by distance from city center (ascending)
- Places at 2km, 5km, 8km → grouped before places at 50km, 60km
- Minimizes travel time within a day

**Example**:
```
Before: [Beach (50km), Temple (3km), Market (1km), Falls (45km)]
After:  [Market (1km), Temple (3km), Falls (45km), Beach (50km)]

Day 1: Market, Temple (nearby)
Day 2: Falls, Beach (nearby)
```

---

### 4. Cost Calculation

```typescript
function getTotalCost(dayPlans: DayPlan[]): number {
  return dayPlans.reduce((sum, day) =>
    sum + day.places.reduce((daySum, place) =>
      daySum + place.entry_fee, 0
    ), 0
  );
}
```

**Formula**:
```
Total Cost = Σ (Entry Fee of all places)
```

**Example**:
```
Day 1: Temple (₹50) + Beach (₹0) = ₹50
Day 2: Museum (₹100) + Fort (₹75) = ₹175
Total: ₹225
```

---

### 5. Distance Calculation

```typescript
function getTotalDistance(dayPlans: DayPlan[]): number {
  return dayPlans.reduce((sum, day) =>
    sum + day.places.reduce((daySum, place) =>
      daySum + place.distance_from_center, 0
    ), 0
  );
}
```

**Formula**:
```
Total Distance = Σ (Distance from center for all places)
```

**Note**: This is simplified. Real implementation should use:
- Actual route distances between places
- Haversine formula for GPS coordinates
- Map API for driving distances

**Better Formula** (Future):
```
Total Distance = Σ (Distance between consecutive places in route)
```

---

### 6. Day Renumbering Algorithm

```typescript
function handleRemoveDay(dayNumber: number) {
  const filtered = dayPlans.filter(d => d.dayNumber !== dayNumber);
  const renumbered = filtered.map((d, idx) => ({
    ...d,
    dayNumber: idx + 1
  }));
  setDayPlans(renumbered);
}
```

**Logic**:
1. Remove day with specified number
2. Renumber remaining days sequentially (1, 2, 3, ...)
3. Maintains continuity

**Example**:
```
Before: [Day 1, Day 2, Day 3, Day 4]
Remove Day 2
After:  [Day 1, Day 2 (was 3), Day 3 (was 4)]
```

---

### 7. Place Reordering

Uses Framer Motion's `Reorder` component internally.

**State Update**:
```typescript
function handleReorderPlaces(dayNumber: number, newOrder: PlaceInDay[]) {
  setDayPlans(dayPlans.map(day => {
    if (day.dayNumber === dayNumber) {
      return {
        ...day,
        places: newOrder.map((p, idx) => ({
          ...p,
          orderIndex: idx
        }))
      };
    }
    return day;
  }));
}
```

**Logic**:
1. User drags place to new position
2. Reorder component provides new array order
3. Update `orderIndex` for all places in day
4. Database sync on save

---

## Distribution Strategies

### Current: Random 2-4 Places Per Day
```typescript
placesPerDay = Math.floor(Math.random() * 3) + 2  // 2, 3, or 4
```

**Pros**:
- Simple and fast
- Creates variety

**Cons**:
- May create uneven days
- Doesn't consider place complexity

### Alternative: Even Distribution
```typescript
placesPerDay = Math.ceil(totalPlaces / numDays)
```

**Example**:
```
10 places, 3 days
10 / 3 = 3.33 → 4 places per day
Day 1: 4 places
Day 2: 3 places
Day 3: 3 places
```

### Advanced: Time-Based Distribution
```typescript
availableTimePerDay = 8 hours
for each place:
  requiredTime = parseTime(place.recommended_time)

currentDayTime = 0
for each place:
  if (currentDayTime + place.time > availableTimePerDay):
    move to next day
  else:
    add to current day
```

**Better considers**:
- Actual time needed per place
- Travel time between places
- Opening hours
- Meal breaks

---

## Optimization Opportunities

### 1. Traveling Salesman Problem (TSP)
Find shortest route visiting all places.

**Greedy Algorithm**:
```
1. Start at city center
2. Pick nearest unvisited place
3. Move there, mark as visited
4. Repeat until all visited
```

**Time**: O(n²)
**Quality**: Good approximation (not optimal)

### 2. Clustering (K-Means)
Group places into clusters for each day.

```
1. Choose k = numDays
2. Initialize k centroids
3. Assign each place to nearest centroid
4. Recalculate centroids
5. Repeat until stable
```

### 3. Genetic Algorithm
Evolve optimal itinerary through generations.

```
1. Generate random itineraries (population)
2. Evaluate fitness (minimize distance, maximize rating)
3. Select best performers
4. Crossover and mutate
5. Repeat for N generations
```

---

## Database Query Optimization

### Fetch Itinerary (Current)
```typescript
// 1 + N + M queries
1. Fetch itinerary
2. For each day: Fetch day
3. For each day: Fetch places
```

**Problem**: N+1 query pattern

### Optimized (Future)
```typescript
// Single query with joins
SELECT
  i.*,
  d.*,
  p.*
FROM itineraries i
LEFT JOIN itinerary_days d ON d.itinerary_id = i.id
LEFT JOIN itinerary_places ip ON ip.itinerary_day_id = d.id
LEFT JOIN places p ON p.id = ip.place_id
WHERE i.id = $1
ORDER BY d.day_number, ip.order_index
```

**Benefit**: 1 query instead of N+M

---

## Time Complexity Analysis

| Operation | Current | Optimal |
|-----------|---------|---------|
| Generate Itinerary | O(n log n) | O(n log n) |
| Shuffle | O(n) | O(n) |
| Sort by Distance | O(n log n) | O(n log n) |
| Assign Time Slots | O(n) | O(n) |
| Calculate Cost | O(n) | O(n) |
| Calculate Distance | O(n) | O(n) |
| Reorder Places | O(n) | O(1) with indices |
| Remove Day | O(d) | O(d) |
| Save to DB | O(d * p) | O(d * p) |

Where:
- n = number of places
- d = number of days
- p = places per day

---

## Space Complexity

| Data Structure | Size | Notes |
|----------------|------|-------|
| places[] | O(n) | Input places |
| dayPlans[] | O(n) | Output structure |
| Database | O(n + d) | Persistent storage |
| LocalStorage | O(n) | Step data |

---

## Formulas Reference

### Places Per Day (Random)
```
min = 2
max = 4
placesPerDay = floor(random() * (max - min + 1)) + min
```

### Places Per Day (Even)
```
placesPerDay = ceil(totalPlaces / numDays)
```

### Time Slot Index
```
timeSlotIndex = placeIndex % 3
slots = ['morning', 'afternoon', 'evening']
timeSlot = slots[timeSlotIndex]
```

### Total Cost
```
totalCost = Σ(place.entry_fee) for all places in all days
```

### Total Distance (Simplified)
```
totalDistance = Σ(place.distance_from_center) for all places
```

### Total Distance (Actual - Future)
```
totalDistance = Σ(distance between consecutive places in route)
```

### Day Renumber
```
newDayNumber = oldIndex + 1
where oldIndex is the array index after filtering
```

---

## Random Distribution Analysis

With random 2-4 places per day:

**10 places, 3 days**:
- Best case: 4, 3, 3 (well distributed)
- Worst case: 4, 4, 2 (uneven)

**15 places, 5 days**:
- Best case: 3, 3, 3, 3, 3 (perfect)
- Worst case: 4, 4, 4, 2, 1 (very uneven)

**To improve**: Use even distribution or time-based logic.

---

This document provides the mathematical and algorithmic foundation for Globe Trotter's itinerary generation system.
