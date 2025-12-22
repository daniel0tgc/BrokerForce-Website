import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import PropertyCard from "@/components/PropertyCard";
import SwipeCard from "@/components/SwipeCard";
import SearchBar from "@/components/SearchBar";
import Header from "@/components/Header";
import { useProperties, usePropertySearch } from "@/hooks/useProperties";
import { PropertySearchParams } from "@/types/simplyrets";
import { PropertyService } from "@/services/propertyService";
import { Filter, Grid, Layers, Loader2, Home } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState<"list" | "swipe">("list");
  const [userSelectedView, setUserSelectedView] = useState<
    "list" | "swipe" | null
  >(null);
  const [sortBy, setSortBy] = useState("price-low");
  const [filterType, setFilterType] = useState("all");

  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: [0, 25000000] as [number, number], // Fixed range: $0 to $25M
    bedrooms: [0, 10] as [number, number], // More inclusive: 0 to 10+ bedrooms
    bathrooms: [0, 10] as [number, number], // More inclusive: 0 to 10+ bathrooms
    homeType: [
      "house",
      "condo",
      "townhouse",
      "apartment",
      "land",
      "commercial",
      "other",
    ], // More inclusive types
  });

  // Helper function to format price display
  const formatPriceDisplay = (price: number) => {
    if (price === 0) {
      return "$0";
    } else if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price}`;
    }
  };

  // Helper function to parse bedroom/bathroom input
  const parseRangeInput = (
    input: string,
    min: number,
    max: number
  ): [number, number] => {
    const trimmed = input.trim();

    // Handle ">3" format
    if (trimmed.startsWith(">")) {
      const value = parseInt(trimmed.slice(1));
      return [value, max];
    }

    // Handle "<5" format
    if (trimmed.startsWith("<")) {
      const value = parseInt(trimmed.slice(1));
      return [min, value];
    }

    // Handle "1-4" format
    if (trimmed.includes("-")) {
      const parts = trimmed.split("-").map((s) => parseInt(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
      }
    }

    // Handle single number "2" format
    const singleValue = parseInt(trimmed);
    if (!isNaN(singleValue)) {
      return [singleValue, singleValue];
    }

    // Default fallback
    return [min, max];
  };
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [areFiltersEnabled, setAreFiltersEnabled] = useState(false);

  // Text input states for bedrooms and bathrooms
  const [bedroomInput, setBedroomInput] = useState("0-10");
  const [bathroomInput, setBathroomInput] = useState("0-10");

  const query = searchParams.get("q") || "";

  // Build search parameters for API
  const searchParamsForAPI: PropertySearchParams = {
    propertyType: filterType !== "all" ? filterType : undefined,
    limit: 50, // Limit results for better performance
  };

  // Get URL parameters for advanced filters
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minBeds = searchParams.get("minBeds");
  const maxBeds = searchParams.get("maxBeds");
  const minBaths = searchParams.get("minBaths");
  const maxBaths = searchParams.get("maxBaths");
  const propertyType = searchParams.get("propertyType");

  // Update searchParamsForAPI with advanced filters
  if (minPrice) searchParamsForAPI.minPrice = parseInt(minPrice);
  if (maxPrice) searchParamsForAPI.maxPrice = parseInt(maxPrice);
  if (minBeds) searchParamsForAPI.minBeds = parseInt(minBeds);
  if (maxBeds) searchParamsForAPI.maxBeds = parseInt(maxBeds);
  if (minBaths) searchParamsForAPI.minBaths = parseFloat(minBaths);
  if (maxBaths) searchParamsForAPI.maxBaths = parseFloat(maxBaths);
  if (propertyType) searchParamsForAPI.propertyType = propertyType;

  // Use React Query hooks for data fetching
  const {
    data: properties = [],
    isLoading,
    error,
  } = query ? usePropertySearch(query) : useProperties(searchParamsForAPI);

  // Check if any filters are actually applied (different from defaults)
  const areFiltersActuallyApplied = areFiltersEnabled;

  // Apply filters to properties
  const filteredProperties = properties.filter((property) => {
    // Only apply filters if they're enabled
    if (!areFiltersEnabled) return true;

    // Log total properties being filtered
    if (properties.length > 0) {
      console.log(
        `Filtering ${properties.length} total properties with filters:`,
        {
          priceRange: advancedFilters.priceRange,
          bedrooms: advancedFilters.bedrooms,
          bathrooms: advancedFilters.bathrooms,
          homeType: advancedFilters.homeType,
        }
      );
    }

    // Debug logging to understand property structure
    if (properties.length > 0 && properties.length <= 5) {
      console.log("Sample property:", properties[0]);
      console.log(
        "Property price:",
        properties[0].price,
        "Type:",
        typeof properties[0].price
      );
      console.log(
        "Property beds:",
        properties[0].beds,
        "Type:",
        typeof properties[0].beds
      );
      console.log(
        "Property baths:",
        properties[0].baths,
        "Type:",
        typeof properties[0].baths
      );
      console.log("Property type:", properties[0].type);
    }

    // Log every property being filtered for debugging
    console.log(`Checking property ${property.id}:`, {
      price: property.price,
      beds: property.beds,
      baths: property.baths,
      type: property.type,
    });

    // Debug current filter values
    console.log("Current filter values:", {
      priceRange: advancedFilters.priceRange,
      bedrooms: advancedFilters.bedrooms,
      bathrooms: advancedFilters.bathrooms,
      homeType: advancedFilters.homeType,
    });

    // Price filter
    if (
      property.price < advancedFilters.priceRange[0] ||
      property.price > advancedFilters.priceRange[1]
    ) {
      console.log(
        `Property ${property.id} filtered out by price: ${property.price} not in range [${advancedFilters.priceRange[0]}, ${advancedFilters.priceRange[1]}]`
      );
      return false;
    } else {
      console.log(
        `Property ${property.id} price ${property.price} is within range [${advancedFilters.priceRange[0]}, ${advancedFilters.priceRange[1]}]`
      );
    }

    // Bedrooms filter
    if (
      property.beds < advancedFilters.bedrooms[0] ||
      property.beds > advancedFilters.bedrooms[1]
    ) {
      console.log(
        `Property ${property.id} filtered out by beds: ${property.beds} not in range [${advancedFilters.bedrooms[0]}, ${advancedFilters.bedrooms[1]}]`
      );
      return false;
    }

    // Bathrooms filter
    if (
      property.baths < advancedFilters.bathrooms[0] ||
      property.baths > advancedFilters.bathrooms[1]
    ) {
      console.log(
        `Property ${property.id} filtered out by baths: ${property.baths} not in range [${advancedFilters.bathrooms[0]}, ${advancedFilters.bathrooms[1]}]`
      );
      return false;
    }

    // Home type filter
    if (!advancedFilters.homeType.includes(property.type)) {
      console.log(
        `Property ${property.id} filtered out by type: ${
          property.type
        } not in allowed types [${advancedFilters.homeType.join(", ")}]`
      );
      return false;
    }

    console.log(`Property ${property.id} passed all filters`);
    return true;
  });

  // Sort properties based on user selection
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "beds":
        return b.beds - a.beds;
      case "sqft":
        return b.sqft - a.sqft;
      default:
        return 0;
    }
  });

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      // Only auto-switch if user hasn't manually selected a view mode
      if (userSelectedView === null) {
        if (newIsMobile && viewMode === "list") {
          setViewMode("swipe");
        } else if (!newIsMobile && viewMode === "swipe") {
          setViewMode("list");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, viewMode, userSelectedView]);

  // Reset swipe index when properties change
  useEffect(() => {
    setCurrentSwipeIndex(0);
  }, [properties]);

  // Test SimplyRETS API on component mount
  useEffect(() => {
    // Test SimplyRETS API connectivity
    PropertyService.testSimplyRETS();
  }, []);

  // Sync advanced filters with URL parameters
  useEffect(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minBeds = searchParams.get("minBeds");
    const maxBeds = searchParams.get("maxBeds");
    const minBaths = searchParams.get("minBaths");
    const maxBaths = searchParams.get("maxBaths");
    const propertyType = searchParams.get("propertyType");

    // Check if any filters are actually set (not default values)
    const hasCustomFilters =
      (minPrice && parseInt(minPrice) !== 0) ||
      (maxPrice && parseInt(maxPrice) !== 25000000) ||
      (minBeds && parseInt(minBeds) !== 0) ||
      (maxBeds && parseInt(maxBeds) !== 10) ||
      (minBaths && parseFloat(minBaths) !== 0) ||
      (maxBaths && parseFloat(maxBaths) !== 10) ||
      (propertyType &&
        propertyType !==
          "house,condo,townhouse,apartment,land,commercial,other");

    setAdvancedFilters((prev) => ({
      ...prev,
      priceRange: [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 25000000,
      ],
      bedrooms: [
        minBeds ? parseInt(minBeds) : 0,
        maxBeds ? parseInt(maxBeds) : 10,
      ],
      bathrooms: [
        minBaths ? parseFloat(minBaths) : 0,
        maxBaths ? parseFloat(maxBaths) : 10,
      ],
      homeType: propertyType
        ? propertyType.split(",")
        : [
            "house",
            "condo",
            "townhouse",
            "apartment",
            "land",
            "commercial",
            "other",
          ],
    }));

    // If no custom filters in URL, clear them to use our new defaults
    if (!hasCustomFilters) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        // Remove the old filter parameters to use our new defaults
        newParams.delete("minPrice");
        newParams.delete("maxPrice");
        newParams.delete("minBeds");
        newParams.delete("maxBeds");
        newParams.delete("minBaths");
        newParams.delete("maxBaths");
        newParams.delete("propertyType");
        return newParams;
      });
    }
  }, [searchParams, setSearchParams]);

  // Auto-update URL when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Update URL when filters are enabled
      if (areFiltersEnabled) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set("minPrice", advancedFilters.priceRange[0].toString());
          newParams.set("maxPrice", advancedFilters.priceRange[1].toString());
          newParams.set("minBeds", advancedFilters.bedrooms[0].toString());
          newParams.set("maxBeds", advancedFilters.bedrooms[1].toString());
          newParams.set("minBaths", advancedFilters.bathrooms[0].toString());
          newParams.set("maxBaths", advancedFilters.bathrooms[1].toString());
          if (advancedFilters.homeType.length > 0) {
            newParams.set("propertyType", advancedFilters.homeType.join(","));
          }
          return newParams;
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [advancedFilters, areFiltersEnabled, setSearchParams]);

  // Handle view mode selection
  const handleViewModeChange = (mode: "list" | "swipe") => {
    setViewMode(mode);
    setUserSelectedView(mode);
  };

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  const applyAdvancedFilters = () => {
    // Apply the advanced filters to the current properties
    // This will trigger a re-render with filtered results
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("minPrice", advancedFilters.priceRange[0].toString());
      newParams.set("maxPrice", advancedFilters.priceRange[1].toString());
      newParams.set("minBeds", advancedFilters.bedrooms[0].toString());
      newParams.set("maxBeds", advancedFilters.bedrooms[1].toString());
      newParams.set("minBaths", advancedFilters.bathrooms[0].toString());
      newParams.set("maxBaths", advancedFilters.bathrooms[1].toString());
      if (advancedFilters.homeType.length > 0) {
        newParams.set("propertyType", advancedFilters.homeType.join(","));
      }
      return newParams;
    });
  };

  const handleSwipeLeft = () => {
    toast({
      title: "Property passed",
      description: "Property removed from your list",
    });
    if (currentSwipeIndex < sortedProperties.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    } else {
      toast({
        title: "No more properties",
        description: "You've viewed all available properties",
      });
    }
  };

  const handleSwipeRight = () => {
    toast({
      title: "Property liked!",
      description: "Property saved to your favorites",
    });
    if (currentSwipeIndex < sortedProperties.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    } else {
      toast({
        title: "No more properties",
        description: "You've viewed all available properties",
      });
    }
  };

  const currentProperty = sortedProperties[currentSwipeIndex];

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Home size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading properties
          </h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white">
        <Header />
        {!isMobile && (
          <div className="border-b bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-end space-x-4">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => handleViewModeChange("list")}
                  size="sm"
                >
                  <Grid size={16} className="mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "swipe" ? "default" : "outline"}
                  onClick={() => handleViewModeChange("swipe")}
                  size="sm"
                >
                  <Layers size={16} className="mr-2" />
                  Swipe
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by address, city, or ZIP code"
            showFilters={false}
            compact={true}
            onFilterClick={() => setIsFiltersOpen(!isFiltersOpen)}
            filtersOpen={
              isFiltersOpen || (areFiltersEnabled && areFiltersActuallyApplied)
            }
          />
        </div>

        {/* Results Header with Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {sortedProperties.length} homes {query && `in "${query}"`}
              {areFiltersActuallyApplied && (
                <span className="text-blue-600 text-lg ml-2">(filtered)</span>
              )}
            </h1>
            <p className="text-gray-600">
              {viewMode === "swipe" && isMobile
                ? "Swipe to browse properties"
                : "Browse available properties"}
              {areFiltersActuallyApplied && (
                <span className="text-blue-600 ml-2">• Filters applied</span>
              )}
            </p>
          </div>

          <div className="flex gap-3">
            {/* Filter Toggle Button - Show for both list and swipe views */}
            <div className="flex gap-2">
              <Button
                variant={areFiltersEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setAreFiltersEnabled(!areFiltersEnabled)}
                className={`flex items-center gap-2 transition-colors duration-200 ${
                  areFiltersEnabled
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                    : "hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600"
                }`}
              >
                <Filter size={16} />
                {areFiltersEnabled ? "Filters On" : "Filters Off"}
              </Button>

              <Button
                variant={isFiltersOpen ? "default" : "outline"}
                size="sm"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center gap-2 transition-colors duration-200 ${
                  isFiltersOpen
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                }`}
                disabled={!areFiltersEnabled}
              >
                <Filter size={16} />
                Configure
                {isFiltersOpen && (
                  <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                )}
              </Button>
            </div>

            {/* Sort Dropdown - Only show for list view */}
            {viewMode === "list" && (
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="beds">Most Bedrooms</SelectItem>
                  <SelectItem value="sqft">Largest First</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel - Now inline instead of sidebar */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isFiltersOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {!areFiltersEnabled && (
                  <p className="text-sm text-gray-600 mt-1">
                    Filters are currently disabled
                  </p>
                )}
                {areFiltersEnabled && (
                  <p className="text-sm text-blue-600 mt-1">
                    Currently filtering {filteredProperties.length} of{" "}
                    {properties.length} properties
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAdvancedFilters({
                      priceRange: [0, 25000000],
                      bedrooms: [0, 10],
                      bathrooms: [0, 10],
                      homeType: [
                        "house",
                        "condo",
                        "townhouse",
                        "apartment",
                        "land",
                        "commercial",
                        "other",
                      ],
                    });
                    setBedroomInput("0-10");
                    setBathroomInput("0-10");
                  }}
                  className="text-gray-600 hover:text-gray-900"
                  disabled={!areFiltersEnabled}
                >
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAreFiltersEnabled(false);
                    setIsFiltersOpen(false);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Disable
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div className={!areFiltersEnabled ? "opacity-50" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="px-2">
                  <Slider
                    value={advancedFilters.priceRange}
                    onValueChange={(value) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        priceRange: value as [number, number],
                      }))
                    }
                    max={25000000}
                    min={0}
                    step={100000}
                    className="w-full"
                    disabled={!areFiltersEnabled}
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span className="font-medium text-blue-600">
                      {formatPriceDisplay(advancedFilters.priceRange[0])}
                    </span>
                    <span className="font-medium text-blue-600">
                      {formatPriceDisplay(advancedFilters.priceRange[1])}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div className={!areFiltersEnabled ? "opacity-50" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <div className="px-2">
                  <input
                    type="text"
                    value={bedroomInput}
                    onChange={(e) => {
                      setBedroomInput(e.target.value);
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        bedrooms: parseRangeInput(e.target.value, 0, 10),
                      }));
                    }}
                    placeholder="e.g., 2, 1-4, >3, <5"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    disabled={!areFiltersEnabled}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Examples: 2, 1-4, &gt;3, &lt;5
                  </div>
                </div>
              </div>

              {/* Bathrooms */}
              <div className={!areFiltersEnabled ? "opacity-50" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <div className="px-2">
                  <input
                    type="text"
                    value={bathroomInput}
                    onChange={(e) => {
                      setBathroomInput(e.target.value);
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        bathrooms: parseRangeInput(e.target.value, 0, 10),
                      }));
                    }}
                    placeholder="e.g., 2, 1-4, >3, <4"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    disabled={!areFiltersEnabled}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Examples: 2, 1-4, &gt;3, &lt;4
                  </div>
                </div>
              </div>
            </div>

            {/* Home Type - Full width below the sliders */}
            <div className={`mt-6 ${!areFiltersEnabled ? "opacity-50" : ""}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Type
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: "house", label: "House" },
                  { value: "condo", label: "Condo" },
                  { value: "townhouse", label: "Townhouse" },
                  { value: "apartment", label: "Apartment" },
                  { value: "land", label: "Land" },
                  { value: "commercial", label: "Commercial" },
                  { value: "other", label: "Other" },
                ].map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${type.value}`}
                      checked={advancedFilters.homeType.includes(type.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            homeType: [...prev.homeType, type.value],
                          }));
                        } else {
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            homeType: prev.homeType.filter(
                              (t) => t !== type.value
                            ),
                          }));
                        }
                      }}
                      disabled={!areFiltersEnabled}
                    />
                    <label
                      htmlFor={`filter-${type.value}`}
                      className="text-sm text-gray-700"
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="mt-6">
              <Button
                onClick={applyAdvancedFilters}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!areFiltersEnabled}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {sortedProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Home size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {areFiltersActuallyApplied
                ? "No properties match your filters"
                : "No properties found"}
            </h3>
            <p className="text-gray-600">
              {areFiltersActuallyApplied
                ? "Try adjusting your filter criteria or clear all filters to see more results."
                : "Try adjusting your search criteria or browse all available properties."}
            </p>
            {areFiltersActuallyApplied && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdvancedFilters({
                      priceRange: [0, 25000000],
                      bedrooms: [0, 10],
                      bathrooms: [0, 10],
                      homeType: [
                        "house",
                        "condo",
                        "townhouse",
                        "apartment",
                        "land",
                        "commercial",
                        "other",
                      ],
                    });
                    setBedroomInput("0-10");
                    setBathroomInput("0-10");
                  }}
                  className="mr-2"
                >
                  Clear All Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsFiltersOpen(true)}
                >
                  Adjust Filters
                </Button>
              </div>
            )}
          </div>
        ) : viewMode === "swipe" ? (
          /* Swipe Mode */
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              {currentProperty ? (
                <div className="relative">
                  <SwipeCard
                    property={currentProperty}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                  />

                  <div className="mt-4 text-center text-sm text-gray-600">
                    {currentSwipeIndex + 1} of {sortedProperties.length}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((currentSwipeIndex + 1) / sortedProperties.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No more properties
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You've viewed all available properties.
                  </p>
                  <Button onClick={() => setCurrentSwipeIndex(0)}>
                    Start Over
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => {
                  toast({
                    title: "Property Details",
                    description: `Viewing details for ${property.address}`,
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
