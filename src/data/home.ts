export type PropertyType = "BUY" | "RENT" | "LEASE";

export interface Property {
  id: string;
  type: PropertyType;
  featured: boolean;
  title: string;
  location: string;
  address: string;
  beds: number;
  baths: number;
  toilets: number;
  sqm: number;
  parking: number;
  price: string;
  image: string;
  propertyType: string;
  yearBuilt: number;
  status: string;
  description: string;
  features: string[];
}

export const properties: Property[] = [
  {
    id: "luxury-4-bed-lekki-buy",
    type: "BUY",
    featured: true,
    title: "Luxury 4-Bedroom Duplex in Lekki Phase 1",
    location: "Lekki Phase 1, Lagos",
    address: "15 Admiralty Way, Lekki Phase 1, Lekki Phase 1, Lagos",
    beds: 4,
    baths: 5,
    toilets: 6,
    sqm: 450,
    parking: 3,
    price: "₦125.00M",
    image: "/assets/figma/property-1.png",
    propertyType: "Duplex",
    yearBuilt: 2022,
    status: "Active",
    description:
      "This stunning luxury duplex is nestled in the heart of Lekki Phase 1, offering an unparalleled blend of modern design and premium finishes. Ideal for families and investors alike, the property features expansive living areas, a chef's kitchen, and a beautifully landscaped garden. Residents enjoy access to 24/7 security, a private pool, and proximity to top schools, malls, and the Lagos waterfront.",
    features: [
      "Swimming Pool",
      "24/7 Security",
      "Fitted Kitchen",
      "Air Conditioning",
      "Backup Generator",
      "Borehole",
      "CCTV",
      "Boys Quarters",
      "Garden",
      "Gym",
    ],
  },
  {
    id: "luxury-4-bed-lekki-rent",
    type: "RENT",
    featured: true,
    title: "Luxury 4-Bedroom Duplex in Lekki Phase 1",
    location: "Lekki Phase 1, Lagos",
    address: "15 Admiralty Way, Lekki Phase 1, Lekki Phase 1, Lagos",
    beds: 4,
    baths: 5,
    toilets: 5,
    sqm: 450,
    parking: 3,
    price: "₦18.00M/yr",
    image: "/assets/figma/property-1.png",
    propertyType: "Duplex",
    yearBuilt: 2021,
    status: "Active",
    description:
      "A beautifully appointed 4-bedroom duplex available for rent in the prestigious Lekki Phase 1 enclave. Move-in ready with top-of-the-range finishes, ample parking, and a secure gated community.",
    features: [
      "Swimming Pool",
      "24/7 Security",
      "Fitted Kitchen",
      "Air Conditioning",
      "Backup Generator",
      "CCTV",
      "Garden",
    ],
  },
  {
    id: "executive-5-bed-banana-island",
    type: "LEASE",
    featured: true,
    title: "Executive 5-Bedroom Mansion with Pool",
    location: "Banana Island, Lagos",
    address: "Plot 5, Bourdillon Close, Banana Island, Ikoyi, Lagos",
    beds: 5,
    baths: 6,
    toilets: 7,
    sqm: 650,
    parking: 4,
    price: "₦250.00M",
    image: "/assets/figma/property-2.png",
    propertyType: "Mansion",
    yearBuilt: 2023,
    status: "Active",
    description:
      "Positioned on the exclusive Banana Island, this magnificent 5-bedroom mansion redefines luxury living. The property boasts an infinity pool, home theatre, spa, and sweeping lagoon views. A rare opportunity for discerning buyers seeking the pinnacle of Lagos real estate.",
    features: [
      "Infinity Pool",
      "Home Theatre",
      "Spa",
      "24/7 Security",
      "Smart Home System",
      "Fitted Kitchen",
      "Air Conditioning",
      "Backup Generator",
      "Borehole",
      "CCTV",
      "Gym",
      "Garden",
    ],
  },
  {
    id: "luxury-4-bed-lekki-buy-2",
    type: "BUY",
    featured: true,
    title: "Luxury 4-Bedroom Duplex in Lekki Phase 1",
    location: "Lekki Phase 1, Lagos",
    address: "22 Admiralty Way, Lekki Phase 1, Lagos",
    beds: 4,
    baths: 5,
    toilets: 5,
    sqm: 450,
    parking: 2,
    price: "₦125.00M",
    image: "/assets/figma/property-1.png",
    propertyType: "Duplex",
    yearBuilt: 2020,
    status: "Active",
    description:
      "A refined 4-bedroom duplex in the vibrant Lekki Phase 1 corridor. Designed for modern living with open-plan spaces, high ceilings, and premium imported fixtures.",
    features: [
      "Swimming Pool",
      "24/7 Security",
      "Fitted Kitchen",
      "Air Conditioning",
      "Backup Generator",
      "Parking",
    ],
  },
  {
    id: "luxury-4-bed-lekki-rent-2",
    type: "RENT",
    featured: true,
    title: "Luxury 4-Bedroom Duplex in Lekki Phase 1",
    location: "Lekki Phase 1, Lagos",
    address: "8 Admiralty Way, Lekki Phase 1, Lagos",
    beds: 4,
    baths: 5,
    toilets: 5,
    sqm: 450,
    parking: 2,
    price: "₦18.00M/yr",
    image: "/assets/figma/property-1.png",
    propertyType: "Duplex",
    yearBuilt: 2019,
    status: "Active",
    description:
      "Elegant 4-bedroom duplex for rent in Lekki Phase 1. Ideal for expatriates and senior executives seeking high-end residential accommodation with easy access to Victoria Island.",
    features: [
      "Swimming Pool",
      "24/7 Security",
      "Fitted Kitchen",
      "Air Conditioning",
      "Backup Generator",
      "CCTV",
    ],
  },
  {
    id: "executive-5-bed-banana-island-2",
    type: "LEASE",
    featured: true,
    title: "Executive 5-Bedroom Mansion with Pool",
    location: "Banana Island, Lagos",
    address: "Plot 12, Parkview Estate, Banana Island, Ikoyi, Lagos",
    beds: 5,
    baths: 6,
    toilets: 8,
    sqm: 650,
    parking: 5,
    price: "₦250.00M",
    image: "/assets/figma/property-2.png",
    propertyType: "Mansion",
    yearBuilt: 2022,
    status: "Active",
    description:
      "A world-class mansion set on Banana Island with bespoke architectural design, resort-style amenities, and unobstructed waterfront views. One of Lagos' most coveted addresses.",
    features: [
      "Infinity Pool",
      "Home Theatre",
      "24/7 Security",
      "Smart Home System",
      "Fitted Kitchen",
      "Air Conditioning",
      "Backup Generator",
      "Borehole",
      "CCTV",
      "Gym",
      "Garden",
      "Tennis Court",
    ],
  },
];

export interface Agent {
  name: string;
  role: string;
  image: string;
}

export const agents: Agent[] = [
  { name: "Adebayo Okonkwo", role: "Senior Property Consultant", image: "/assets/figma/agent-1.png" },
  { name: "Chioma Ezekiel", role: "Sales Manager", image: "/assets/figma/agent-2.png" },
  { name: "Emeka Nwosu", role: "Luxury Home Specialist", image: "/assets/figma/agent-3.png" },
];

export interface WhyChooseItem {
  title: string;
  body: string;
  icon: string;
}

export const whyChoose: WhyChooseItem[] = [
  {
    title: "Expert Guidance",
    body: "Our experienced agents provide personalized advice tailored to your unique needs and preferences.",
    icon: "/assets/figma/why-expert.svg",
  },
  {
    title: "Trusted Network",
    body: "Join thousands of satisfied clients who have found their perfect property with us.",
    icon: "/assets/figma/why-network.svg",
  },
  {
    title: "Best Market Value",
    body: "We ensure you get the best value for your money with transparent pricing and market insights.",
    icon: "/assets/figma/why-value.svg",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "BOC Real Estate made finding our dream home effortless. Their professionalism and attention to detail exceeded all expectations. We couldn't be happier with our new property in Lekki.",
    name: "Adebayo Okonkwo",
    role: "Business Owner",
    location: "Lekki, Lagos",
    image: "/assets/figma/agent-1.png",
  },
  {
    quote:
      "The team went above and beyond to understand my needs. From viewing to closing, every step was smooth and transparent. Highly recommend their services!",
    name: "Chioma Ezekiel",
    role: "Tech Executive",
    location: "Banana Island, Lagos",
    image: "/assets/figma/agent-2.png",
  },
  {
    quote:
      "As a first-time buyer, I was nervous about the process. BOC Real Estate guided me every step of the way with patience and expertise. I found the perfect investment property.",
    name: "Emeka Nwosu",
    role: "Entrepreneur",
    location: "Abuja",
    image: "/assets/figma/agent-3.png",
  },
  {
    quote:
      "The team went above and beyond to understand my needs. From viewing to closing, every step was smooth and transparent. Highly recommend their services!",
    name: "Chioma Ezekiel",
    role: "Tech Executive",
    location: "Banana Island, Lagos",
    image: "/assets/figma/agent-2.png",
  },
];
