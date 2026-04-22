export type AdminAmenity = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  category: string;
  is_active: boolean;
};

export type AdminAmenityWritePayload = {
  name: string;
  icon: string;
  category: string;
  is_active: boolean;
};

export type AdminPropertyType = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  order: number;
  is_active: boolean;
  property_count: number;
};

export type AdminPropertyTypeWritePayload = {
  name: string;
  icon: string;
  description: string;
  order: number;
  is_active: boolean;
};
