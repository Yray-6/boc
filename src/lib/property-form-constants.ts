export const PROPERTY_TYPES = [
  "Apartment",
  "Duplex",
  "Penthouse",
  "Terrace",
  "Villa",
] as const;

/** Numeric `id` values should match your backend agent primary keys. */
export const AGENTS = [
  { id: "1", label: "Agent 001 - Chariss Forbes" },
  { id: "2", label: "Agent 002 - Boluwatife Cole" },
  { id: "3", label: "Agent 003 - Ephraim Johnson" },
  { id: "4", label: "Agent 004 - Adeleke David" },
] as const;

export const AMENITY_OPTIONS = [
  { id: "pool", label: "Swimming Pool" },
  { id: "gym", label: "Gym" },
  { id: "security", label: "24/7 Security" },
  { id: "generator", label: "Backup Generator" },
  { id: "backup-power", label: "Backup Power" },
  { id: "cctv", label: "CCTV" },
  { id: "kitchen", label: "Fitted Kitchen" },
  { id: "borehole", label: "Borehole" },
  { id: "parking", label: "Parking" },
  { id: "garden", label: "Garden" },
  { id: "ac", label: "Air Conditioning" },
  { id: "elevator", label: "Elevator" },
  { id: "concierge", label: "Concierge" },
] as const;
