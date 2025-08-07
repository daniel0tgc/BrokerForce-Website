// SimplyRETS API Types
export interface SimplyRETSProperty {
  // Basic property info
  propertyId: string;
  listPrice: number;
  address: {
    full: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  // Property details
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  propertyType: string;

  // Media
  photos: string[];
  virtualTours?: string[];

  // Additional details
  description?: string;
  features?: string[];

  // MLS info
  mlsId?: string;
  listingId?: string;

  // Agent info
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  // Office info
  office?: {
    id: string;
    name: string;
    phone: string;
  };

  // Dates
  listDate?: string;
  modifiedDate?: string;

  // Status
  status: 'active' | 'pending' | 'sold' | 'cancelled';
}

// API Response wrapper
export interface SimplyRETSResponse {
  properties: SimplyRETSProperty[];
  total: number;
  page: number;
  limit: number;
}

// Search parameters
export interface PropertySearchParams {
  city?: string;
  state?: string;
  zipCode?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
  propertyType?: string;
  limit?: number;
  page?: number;
}

// Error types
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}
