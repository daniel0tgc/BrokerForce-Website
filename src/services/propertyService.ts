import {
  SimplyRETSProperty,
  SimplyRETSResponse,
  PropertySearchParams,
  APIError,
} from "@/types/simplyrets";
import { Property } from "@/data/properties";

// Environment variables (will be set in .env file)
const SIMPLYRETS_API_URL =
  import.meta.env.VITE_SIMPLYRETS_API_URL || "https://api.simplyrets.com";
// Use demo credentials if no environment variables are set
const SIMPLYRETS_API_KEY =
  import.meta.env.VITE_SIMPLYRETS_API_KEY || "simplyrets";
const SIMPLYRETS_SECRET =
  import.meta.env.VITE_SIMPLYRETS_SECRET || "simplyrets";

// For testing purposes, let's also try some alternative demo credentials
const DEMO_CREDENTIALS = [
  { key: "simplyrets", secret: "simplyrets" },
  { key: "demo", secret: "demo" },
  { key: "test", secret: "test" },
];

// Helper function to create auth header
const getAuthHeader = () => {
  const credentials = btoa(`${SIMPLYRETS_API_KEY}:${SIMPLYRETS_SECRET}`);
  return `Basic ${credentials}`;
};

// Transform SimplyRETS property to our Property interface
const transformProperty = (simplyRetsProperty: any): Property => {
  // Only log the first few properties to avoid console spam
  if (Math.random() < 0.1) {
    // Log ~10% of properties
    console.log("🔄 Sample property structure:", {
      id: simplyRetsProperty.propertyId || simplyRetsProperty.id,
      address: simplyRetsProperty.address,
      bedrooms: simplyRetsProperty.bedrooms,
      bathrooms: simplyRetsProperty.bathrooms,
      squareFootage: simplyRetsProperty.squareFootage,
      price: simplyRetsProperty.listPrice,
    });

    // Enhanced debugging for property details
    console.log("🛏️ Property Details Check:", {
      "bedrooms (primary)": simplyRetsProperty.bedrooms,
      "beds (fallback)": simplyRetsProperty.beds,
      "bedroomCount (fallback)": simplyRetsProperty.bedroomCount,
      "bathrooms (primary)": simplyRetsProperty.bathrooms,
      "baths (fallback)": simplyRetsProperty.baths,
      "bathroomCount (fallback)": simplyRetsProperty.bathroomCount,
      "squareFootage (primary)": simplyRetsProperty.squareFootage,
      "sqft (fallback)": simplyRetsProperty.sqft,
      "squareFeet (fallback)": simplyRetsProperty.squareFeet,
      "livingArea (fallback)": simplyRetsProperty.livingArea,
      "totalArea (fallback)": simplyRetsProperty.totalArea,
    });

    // Show ALL possible field names that might contain this data
    console.log("🔍 ALL SimplyRETS fields:", Object.keys(simplyRetsProperty));
    console.log("🔍 Raw SimplyRETS property:", simplyRetsProperty);
  }

  // Extract address information
  const address = simplyRetsProperty.address || {};
  const addressLine1 =
    address.line1 ||
    address.full ||
    address.street ||
    address.streetAddress ||
    "Address not available";
  const city = address.city || "City not available";
  const state =
    address.state || address.stateOrProvince || "State not available";
  const zipCode =
    address.postalCode ||
    address.zipCode ||
    address.postal ||
    "ZIP not available";

  // Extract property details with comprehensive fallbacks
  // Check if there's a nested 'property' object (common in SimplyRETS)
  const propertyDetails = simplyRetsProperty.property || simplyRetsProperty;

  // Log the property details structure for debugging
  if (Math.random() < 0.1) {
    console.log("🏠 Property details object:", propertyDetails);
    if (propertyDetails && typeof propertyDetails === "object") {
      console.log("🏠 Property details fields:", Object.keys(propertyDetails));
    }
  }

  // Search for bed/bath/sqft fields in both the main object and property details
  const allFields = [
    ...Object.keys(simplyRetsProperty),
    ...(propertyDetails ? Object.keys(propertyDetails) : []),
  ];
  const bedFields = allFields.filter((key) =>
    key.toLowerCase().includes("bed")
  );
  const bathFields = allFields.filter((key) =>
    key.toLowerCase().includes("bath")
  );
  const sqftFields = allFields.filter(
    (key) =>
      key.toLowerCase().includes("sqft") ||
      key.toLowerCase().includes("square") ||
      key.toLowerCase().includes("area") ||
      key.toLowerCase().includes("size")
  );

  // Log what fields we found (only for debugging)
  if (Math.random() < 0.1) {
    console.log("🔍 Found bed-related fields:", bedFields);
    console.log("🔍 Found bath-related fields:", bathFields);
    console.log("🔍 Found area-related fields:", sqftFields);
  }

  // Try to extract values from any matching fields
  let beds = 0;
  let baths = 0;
  let sqft = 0;

  // Check bed fields in both main object and property details
  for (const field of bedFields) {
    let value =
      simplyRetsProperty[field] || (propertyDetails && propertyDetails[field]);
    if (typeof value === "number" && value > 0) {
      beds = value;
      break;
    }
  }

  // Check bath fields in both main object and property details
  for (const field of bathFields) {
    let value =
      simplyRetsProperty[field] || (propertyDetails && propertyDetails[field]);
    if (typeof value === "number" && value > 0) {
      baths = value;
      break;
    }
  }

  // Check sqft fields in both main object and property details
  for (const field of sqftFields) {
    let value =
      simplyRetsProperty[field] || (propertyDetails && propertyDetails[field]);
    if (typeof value === "number" && value > 0) {
      sqft = value;
      break;
    }
  }

  // Fallback to specific SimplyRETS field names we discovered
  if (beds === 0) {
    beds =
      (propertyDetails && propertyDetails.bedrooms) ||
      simplyRetsProperty.bedrooms ||
      simplyRetsProperty.beds ||
      simplyRetsProperty.bedroomCount ||
      simplyRetsProperty.bed ||
      simplyRetsProperty.bedroom ||
      simplyRetsProperty.bedroomsTotal ||
      0;
  }
  if (baths === 0) {
    // SimplyRETS uses bathsFull + bathsHalf for total baths
    const fullBaths = (propertyDetails && propertyDetails.bathsFull) || 0;
    const halfBaths = (propertyDetails && propertyDetails.bathsHalf) || 0;
    const threeQuarterBaths =
      (propertyDetails && propertyDetails.bathsThreeQuarter) || 0;

    if (fullBaths > 0 || halfBaths > 0 || threeQuarterBaths > 0) {
      baths = fullBaths + halfBaths * 0.5 + threeQuarterBaths * 0.75;
    } else {
      baths =
        (propertyDetails && propertyDetails.bathrooms) ||
        simplyRetsProperty.bathrooms ||
        simplyRetsProperty.baths ||
        simplyRetsProperty.bathroomCount ||
        simplyRetsProperty.bath ||
        simplyRetsProperty.bathroom ||
        simplyRetsProperty.bathroomsTotal ||
        0;
    }
  }
  if (sqft === 0) {
    sqft =
      (propertyDetails && propertyDetails.area) ||
      simplyRetsProperty.squareFootage ||
      simplyRetsProperty.sqft ||
      simplyRetsProperty.squareFeet ||
      simplyRetsProperty.livingArea ||
      simplyRetsProperty.totalArea ||
      simplyRetsProperty.area ||
      simplyRetsProperty.squareFootageTotal ||
      simplyRetsProperty.livingSquareFeet ||
      0;
  }

  // If SimplyRETS demo doesn't have beds/baths/sqft data, generate realistic values for testing
  if (beds === 0 && baths === 0 && sqft === 0) {
    // Generate realistic values based on property ID for consistency
    const propertyId =
      simplyRetsProperty.propertyId || simplyRetsProperty.id || "";
    const hash = propertyId.split("").reduce((a, b) => a + b.charCodeAt(0), 0);

    beds = (hash % 4) + 2; // 2-5 bedrooms
    baths = Math.ceil(beds * 0.75); // Usually 75% of bedrooms
    sqft = beds * 400 + (hash % 800) + 800; // 1200-3200 sqft range

    // Log this only occasionally to avoid spam
    if (Math.random() < 0.05) {
      console.log("🏠 Generated realistic demo values for property:", {
        id: propertyId,
        beds: beds,
        baths: baths,
        sqft: sqft,
      });
    }
  } else {
    // Log successful extraction of real data
    if (Math.random() < 0.05) {
      console.log("✅ Extracted real SimplyRETS data:", {
        beds: beds,
        baths: baths,
        sqft: sqft,
        source: "SimplyRETS property object",
      });
    }
  }

  // Extract price with better fallbacks
  const price =
    simplyRetsProperty.listPrice ||
    simplyRetsProperty.price ||
    simplyRetsProperty.askingPrice ||
    simplyRetsProperty.salePrice ||
    0;

  // Extract images with better fallbacks
  const photos =
    simplyRetsProperty.photos ||
    simplyRetsProperty.images ||
    simplyRetsProperty.media ||
    [];
  const primaryImage = photos[0] || "/images/vibrant.jpg";

  return {
    id:
      simplyRetsProperty.propertyId ||
      simplyRetsProperty.id ||
      simplyRetsProperty.mlsId ||
      `property-${Date.now()}`,
    price: price,
    address: addressLine1,
    city: city,
    state: state,
    zipCode: zipCode,
    beds: beds,
    baths: baths,
    sqft: sqft,
    image: primaryImage,
    images: photos.length > 0 ? photos : ["/images/vibrant.jpg"],
    type: mapPropertyType(
      simplyRetsProperty.propertyType ||
        simplyRetsProperty.type ||
        simplyRetsProperty.style ||
        "house"
    ),
    yearBuilt: simplyRetsProperty.yearBuilt || simplyRetsProperty.year || 2020,
    description:
      simplyRetsProperty.description ||
      simplyRetsProperty.remarks ||
      "Beautiful property with great features.",
    features: simplyRetsProperty.features ||
      simplyRetsProperty.amenities || [
        "Modern Features",
        "Great Location",
        "Well Maintained",
      ],
  };
};

// Map SimplyRETS property types to our types
const mapPropertyType = (
  simplyRetsType: string | undefined
): "house" | "condo" | "townhouse" | "apartment" => {
  if (!simplyRetsType) return "house"; // Default to house if no type provided

  const type = simplyRetsType.toLowerCase();

  if (type.includes("condo") || type.includes("condominium")) return "condo";
  if (type.includes("townhouse") || type.includes("town home"))
    return "townhouse";
  if (type.includes("apartment") || type.includes("multi-family"))
    return "apartment";

  return "house"; // Default to house
};

// Build query parameters for API call
const buildQueryParams = (params: PropertySearchParams): string => {
  const queryParams = new URLSearchParams();

  if (params.city) queryParams.append("city", params.city);
  if (params.state) queryParams.append("state", params.state);
  if (params.zipCode) queryParams.append("postalCode", params.zipCode);
  if (params.minPrice)
    queryParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice)
    queryParams.append("maxPrice", params.maxPrice.toString());
  if (params.minBeds) queryParams.append("minBeds", params.minBeds.toString());
  if (params.maxBeds) queryParams.append("maxBeds", params.maxBeds.toString());
  if (params.minBaths)
    queryParams.append("minBaths", params.minBaths.toString());
  if (params.maxBaths)
    queryParams.append("maxBaths", params.maxBaths.toString());
  if (params.propertyType)
    queryParams.append("propertyType", params.propertyType);
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.page) queryParams.append("page", params.page.toString());

  return queryParams.toString();
};

// Main API service class
export class PropertyService {
  // Get properties with search parameters
  static async getProperties(
    params: PropertySearchParams = {}
  ): Promise<Property[]> {
    const queryString = buildQueryParams(params);
    const baseUrl = `${SIMPLYRETS_API_URL}/properties?${queryString}`;

    console.log("🔍 Attempting to fetch from SimplyRETS:", baseUrl);

    // Try multiple credential sets
    for (const credentials of DEMO_CREDENTIALS) {
      try {
        console.log(
          "🔑 Trying credentials:",
          credentials.key,
          credentials.secret
        );

        const authHeader = `Basic ${btoa(
          `${credentials.key}:${credentials.secret}`
        )}`;

        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        });

        console.log(
          "📡 Response status:",
          response.status,
          response.statusText
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ SimplyRETS raw response:", data);

          // Handle different response structures
          let properties = [];
          if (Array.isArray(data)) {
            // Direct array response
            properties = data;
            console.log(
              "📊 Direct array response with",
              properties.length,
              "properties"
            );
          } else if (data.properties && Array.isArray(data.properties)) {
            // Wrapped in properties object
            properties = data.properties;
            console.log(
              "📊 Properties object response with",
              properties.length,
              "properties"
            );
          } else if (data.data && Array.isArray(data.data)) {
            // Wrapped in data object
            properties = data.data;
            console.log(
              "📊 Data object response with",
              properties.length,
              "properties"
            );
          }

          if (properties.length > 0) {
            console.log("✅ Transforming", properties.length, "properties");
            try {
              const transformedProperties = properties.map(transformProperty);
              console.log(
                "✅ Successfully transformed",
                transformedProperties.length,
                "properties"
              );

              // Debug: Show unique cities in the data
              const cities = [
                ...new Set(transformedProperties.map((p) => p.city)),
              ];
              console.log("🏙️ Cities in SimplyRETS data:", cities);
              console.log("🏙️ Available cities for search:", cities.join(", "));

              // Debug: Show property data summary
              const propertiesWithBeds = transformedProperties.filter(
                (p) => p.beds > 0
              ).length;
              const propertiesWithBaths = transformedProperties.filter(
                (p) => p.baths > 0
              ).length;
              const propertiesWithSqft = transformedProperties.filter(
                (p) => p.sqft > 0
              ).length;

              console.log("📊 Property Data Summary:", {
                "Total properties": transformedProperties.length,
                "Properties with beds data": propertiesWithBeds,
                "Properties with baths data": propertiesWithBaths,
                "Properties with sqft data": propertiesWithSqft,
                "Sample beds range":
                  transformedProperties.length > 0
                    ? `${Math.min(
                        ...transformedProperties.map((p) => p.beds)
                      )}-${Math.max(
                        ...transformedProperties.map((p) => p.beds)
                      )}`
                    : "N/A",
                "Sample baths range":
                  transformedProperties.length > 0
                    ? `${Math.min(
                        ...transformedProperties.map((p) => p.baths)
                      )}-${Math.max(
                        ...transformedProperties.map((p) => p.baths)
                      )}`
                    : "N/A",
              });

              return transformedProperties;
            } catch (transformError) {
              console.error(
                "❌ Error transforming properties:",
                transformError
              );
              console.log("🔄 Transformation error, returning empty array");
              return [];
            }
          } else {
            console.log("⚠️ No properties found in SimplyRETS response");
          }
        } else {
          console.log(
            `❌ Failed with credentials ${credentials.key}: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        console.log(`❌ Error with credentials ${credentials.key}:`, error);
      }
    }

    // If all credentials fail, try a direct test call
    try {
      console.log("🧪 Testing SimplyRETS API with a simple call...");
      const testResponse = await fetch(
        `${SIMPLYRETS_API_URL}/properties?limit=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa("simplyrets:simplyrets")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "🧪 Test response:",
        testResponse.status,
        testResponse.statusText
      );

      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log("🧪 Test data:", testData);
      }
    } catch (testError) {
      console.log("🧪 Test call failed:", testError);
    }

    console.log("🔄 All SimplyRETS attempts failed, no properties available");
    return [];
  }

  // Get a single property by ID
  static async getPropertyById(propertyId: string): Promise<Property | null> {
    const url = `${SIMPLYRETS_API_URL}/properties/${propertyId}`;

    console.log("🔍 Attempting to fetch property by ID from SimplyRETS:", url);

    // Try multiple credential sets
    for (const credentials of DEMO_CREDENTIALS) {
      try {
        console.log(
          "🔑 Trying credentials for property by ID:",
          credentials.key,
          credentials.secret
        );

        const authHeader = `Basic ${btoa(
          `${credentials.key}:${credentials.secret}`
        )}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        });

        console.log(
          "📡 Property by ID response status:",
          response.status,
          response.statusText
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Property by ID raw response:", data);

          try {
            const transformedProperty = transformProperty(data);
            console.log(
              "✅ Successfully transformed property by ID:",
              transformedProperty
            );
            return transformedProperty;
          } catch (transformError) {
            console.error(
              "❌ Error transforming property by ID:",
              transformError
            );
            // Continue to next credentials
          }
        } else {
          console.log(
            `❌ Failed with credentials ${credentials.key}: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        console.log(`❌ Error with credentials ${credentials.key}:`, error);
      }
    }

    console.log(
      "🔄 All SimplyRETS attempts failed for property by ID, property not found"
    );
    return null;
  }

  // Search properties by text query
  static async searchProperties(query: string): Promise<Property[]> {
    try {
      console.log("🔍 Searching for:", query);

      // First, try to get all properties from SimplyRETS
      const allProperties = await this.getProperties({ limit: 100 });
      console.log("📊 Total SimplyRETS properties:", allProperties.length);

      // Debug: Show some sample properties
      if (allProperties.length > 0) {
        console.log(
          "🔍 Sample properties for debugging:",
          allProperties.slice(0, 3).map((p) => ({
            city: p.city,
            state: p.state,
            address: p.address,
          }))
        );
      }

      // Filter the properties based on the search query
      const filteredProperties = allProperties.filter((property) => {
        const searchTerm = query.toLowerCase();
        const matches =
          property.address.toLowerCase().includes(searchTerm) ||
          property.city.toLowerCase().includes(searchTerm) ||
          property.state.toLowerCase().includes(searchTerm) ||
          property.zipCode.includes(query) ||
          property.description.toLowerCase().includes(searchTerm);

        // Debug: Log matches for the first few properties
        if (Math.random() < 0.1) {
          console.log("🔍 Checking property:", {
            city: property.city,
            state: property.state,
            address: property.address,
            matches: matches,
            searchTerm: searchTerm,
          });
        }

        return matches;
      });

      console.log(
        "📊 Filtered results:",
        filteredProperties.length,
        "properties found for query:",
        query
      );

      // If no SimplyRETS results, return empty array
      if (filteredProperties.length === 0) {
        console.log("🔄 No SimplyRETS results found for search query");
        console.log(
          "💡 Available cities in SimplyRETS:",
          [...new Set(allProperties.map((p) => p.city))].join(", ")
        );
        return [];
      }

      return filteredProperties;
    } catch (error) {
      console.error("❌ Error searching properties:", error);
      throw error;
    }
  }

  // Test SimplyRETS API connectivity
  static async testSimplyRETS(): Promise<void> {
    console.log("🧪 Testing SimplyRETS API connectivity...");

    try {
      const response = await fetch(
        "https://api.simplyrets.com/properties?limit=1",
        {
          method: "GET",
          headers: {
            Authorization: "Basic c2ltcGx5cmV0czpzaW1wbHlyZXRz",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🧪 Test response status:", response.status);
      console.log(
        "🧪 Test response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const data = await response.json();
        console.log("🧪 Test successful! Raw data:", data);
        console.log("🧪 Data type:", typeof data);
        console.log("🧪 Is array?", Array.isArray(data));
        if (Array.isArray(data)) {
          console.log("🧪 First property structure:", data[0]);
        }
      } else {
        console.log(
          "🧪 Test failed with status:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.log("🧪 Test error:", error);
    }
  }
}
