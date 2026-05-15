import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Tag, TrendingUp, Clock, ArrowRight, SlidersHorizontal, Check, Bookmark, BookmarkCheck, Trash2, Eye } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { products, getSubcategories, getBrands, Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProductQuickView } from "@/components/shop/ProductQuickView";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const recentSearches = ["Summer dresses", "Men's t-shirts", "Leather bags"];
const trendingSearches = ["Floral prints", "Denim jackets", "Gold accessories"];

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"];
const availableColors = [
  { name: "Black", value: "#1A202C" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy", value: "#1A365D" },
  { name: "Red", value: "#E53E3E" },
  { name: "Blue", value: "#3182CE" },
  { name: "Green", value: "#38A169" },
  { name: "Yellow", value: "#D69E2E" },
  { name: "Purple", value: "#805AD5" },
  { name: "Pink", value: "#D53F8C" },
  { name: "Orange", value: "#DD6B20" },
  { name: "Gray", value: "#718096" },
  { name: "Brown", value: "#744210" },
];

interface Filters {
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  brands: string[];
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Filters;
  createdAt: number;
}

const SAVED_SEARCHES_KEY = "rasu-saved-searches";

const getSavedSearches = (): SavedSearch[] => {
  try {
    const stored = localStorage.getItem(SAVED_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSavedSearches = (searches: SavedSearch[]) => {
  localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(searches));
};

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    sizes: [],
    colors: [],
    priceRange: [0, 30000],
    brands: [],
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const [allBrands] = useState(() => getBrands());
  const activeFiltersCount = 
    filters.sizes.length + 
    filters.colors.length + 
    filters.brands.length + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 30000 ? 1 : 0);

  // Filter products and categories based on query and filters
  useEffect(() => {
    let matchedProducts = products;

    // Apply search query
    if (query.length >= 2) {
      const lowerQuery = query.toLowerCase();
      matchedProducts = matchedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.subcategory.toLowerCase().includes(lowerQuery) ||
          product.brand?.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply price filter
    matchedProducts = matchedProducts.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply brand filter
    if (filters.brands.length > 0) {
      matchedProducts = matchedProducts.filter(
        (product) => product.brand && filters.brands.includes(product.brand)
      );
    }

    // Apply color filter (match by color name in product color field)
    if (filters.colors.length > 0) {
      matchedProducts = matchedProducts.filter((product) => {
        if (!product.color) return false;
        return filters.colors.some((colorValue) => {
          const colorObj = availableColors.find((c) => c.value === colorValue);
          return colorObj && product.color?.toLowerCase().includes(colorObj.name.toLowerCase());
        });
      });
    }

    setFilteredProducts(matchedProducts.slice(0, 8));

    // Filter subcategories
    if (query.length >= 2) {
      const lowerQuery = query.toLowerCase();
      const allSubcategories = getSubcategories();
      const matchedCategories = allSubcategories
        .filter((sub) => sub.toLowerCase().includes(lowerQuery))
        .slice(0, 4);
      setFilteredCategories(matchedCategories);

      // Filter brands for suggestions
      const matchedBrands = allBrands
        .filter((brand) => brand.toLowerCase().includes(lowerQuery))
        .slice(0, 4);
      setFilteredBrands(matchedBrands);
    } else {
      setFilteredCategories([]);
      setFilteredBrands([]);
    }
  }, [query, filters, allBrands]);

  const handleProductSelect = useCallback(
    (product: Product) => {
      onOpenChange(false);
      navigate(`/product/${product.id}`);
    },
    [navigate, onOpenChange]
  );

  const handleQuickView = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  }, []);

  const handleCategorySelect = useCallback(
    (subcategory: string) => {
      onOpenChange(false);
      navigate(`/shop?subcategory=${encodeURIComponent(subcategory)}`);
    },
    [navigate, onOpenChange]
  );

  const handleBrandSelect = useCallback(
    (brand: string) => {
      onOpenChange(false);
      navigate(`/shop?brand=${encodeURIComponent(brand)}`);
    },
    [navigate, onOpenChange]
  );

  const handleSearchSubmit = useCallback(
    (searchTerm: string) => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (filters.sizes.length > 0) params.set("sizes", filters.sizes.join(","));
      if (filters.colors.length > 0) params.set("colors", filters.colors.join(","));
      if (filters.brands.length > 0) params.set("brands", filters.brands.join(","));
      if (filters.priceRange[0] > 0) params.set("minPrice", String(filters.priceRange[0]));
      if (filters.priceRange[1] < 30000) params.set("maxPrice", String(filters.priceRange[1]));
      
      onOpenChange(false);
      navigate(`/shop?${params.toString()}`);
    },
    [navigate, onOpenChange, filters]
  );

  const toggleSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const clearFilters = () => {
    setFilters({
      sizes: [],
      colors: [],
      priceRange: [0, 30000],
      brands: [],
    });
  };

  // Load saved searches from localStorage
  useEffect(() => {
    setSavedSearches(getSavedSearches());
  }, []);

  const handleSaveSearch = () => {
    if (!saveSearchName.trim()) {
      toast.error("Please enter a name for your saved search");
      return;
    }

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveSearchName.trim(),
      query,
      filters,
      createdAt: Date.now(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    saveSavedSearches(updated);
    setSaveSearchName("");
    setShowSaveInput(false);
    toast.success("Search saved successfully!");
  };

  const handleDeleteSavedSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    saveSavedSearches(updated);
    toast.success("Saved search deleted");
  };

  const handleApplySavedSearch = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    if (savedSearch.filters.sizes.length > 0 || 
        savedSearch.filters.colors.length > 0 || 
        savedSearch.filters.brands.length > 0 ||
        savedSearch.filters.priceRange[0] > 0 ||
        savedSearch.filters.priceRange[1] < 30000) {
      setShowFilters(true);
    }
  };

  const canSaveSearch = query.length > 0 || activeFiltersCount > 0;

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Reset filters when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setShowFilters(false);
      setShowSaveInput(false);
      setSaveSearchName("");
    }
  }, [open]);

  return (
    <>
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b px-3 bg-background">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          placeholder="Search products, categories, brands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit(query);
            }
          }}
          className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex items-center gap-1">
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
            >
              <X className="h-4 w-4 opacity-50" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-1.5 rounded-md transition-colors relative",
              showFilters ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFiltersCount > 0 && !showFilters && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={cn("flex-1 transition-all", showFilters ? "border-r" : "")}>
          <CommandList className="max-h-[400px]">
            {query.length < 2 && !showFilters ? (
              <>
                {/* Saved Searches */}
                {savedSearches.length > 0 && (
                  <>
                    <CommandGroup heading="Saved Searches">
                      {savedSearches.map((savedSearch) => (
                        <CommandItem
                          key={savedSearch.id}
                          value={savedSearch.name}
                          onSelect={() => handleApplySavedSearch(savedSearch)}
                          className="flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                            <div>
                              <span className="font-medium">{savedSearch.name}</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                {savedSearch.query && (
                                  <Badge variant="outline" className="text-[10px] py-0 h-4">
                                    {savedSearch.query}
                                  </Badge>
                                )}
                                {(savedSearch.filters.sizes.length > 0 || 
                                  savedSearch.filters.colors.length > 0 || 
                                  savedSearch.filters.brands.length > 0 ||
                                  savedSearch.filters.priceRange[0] > 0 ||
                                  savedSearch.filters.priceRange[1] < 30000) && (
                                  <Badge variant="secondary" className="text-[10px] py-0 h-4">
                                    {savedSearch.filters.sizes.length + 
                                     savedSearch.filters.colors.length + 
                                     savedSearch.filters.brands.length + 
                                     (savedSearch.filters.priceRange[0] > 0 || savedSearch.filters.priceRange[1] < 30000 ? 1 : 0)} filters
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDeleteSavedSearch(savedSearch.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </>
                )}

                {/* Recent Searches */}
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((search) => (
                    <CommandItem
                      key={search}
                      value={search}
                      onSelect={() => handleSearchSubmit(search)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandSeparator />

                {/* Trending Searches */}
                <CommandGroup heading="Trending Now">
                  {trendingSearches.map((search) => (
                    <CommandItem
                      key={search}
                      value={search}
                      onSelect={() => handleSearchSubmit(search)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandSeparator />

                {/* Quick Filters */}
                <CommandGroup heading="Quick Filters">
                  <div className="flex flex-wrap gap-2 p-2">
                    {["Men", "Women", "Accessories", "New Arrivals"].map((filter) => (
                      <Badge
                        key={filter}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => {
                          if (filter === "New Arrivals") {
                            onOpenChange(false);
                            navigate("/shop?category=trending");
                          } else {
                            onOpenChange(false);
                            navigate(`/shop?category=${filter.toLowerCase()}`);
                          }
                        }}
                      >
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </CommandGroup>
              </>
            ) : (
              <>
                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="px-3 py-2 border-b bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Active Filters ({activeFiltersCount})
                      </span>
                      <button
                        onClick={clearFilters}
                        className="text-xs text-primary hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {filters.sizes.map((size) => (
                        <Badge
                          key={size}
                          variant="secondary"
                          className="text-xs cursor-pointer"
                          onClick={() => toggleSize(size)}
                        >
                          Size: {size} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                      {filters.colors.map((color) => (
                        <Badge
                          key={color}
                          variant="secondary"
                          className="text-xs cursor-pointer flex items-center gap-1"
                          onClick={() => toggleColor(color)}
                        >
                          <div
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: color }}
                          />
                          {availableColors.find((c) => c.value === color)?.name}
                          <X className="h-3 w-3" />
                        </Badge>
                      ))}
                      {filters.brands.map((brand) => (
                        <Badge
                          key={brand}
                          variant="secondary"
                          className="text-xs cursor-pointer"
                          onClick={() => toggleBrand(brand)}
                        >
                          {brand} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                      {(filters.priceRange[0] > 0 || filters.priceRange[1] < 30000) && (
                        <Badge variant="secondary" className="text-xs">
                          ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {filteredProducts.length === 0 &&
                filteredCategories.length === 0 &&
                filteredBrands.length === 0 ? (
                  <CommandEmpty>
                    <div className="flex flex-col items-center gap-2 py-6">
                      <Search className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        {query.length >= 2
                          ? `No results found for "${query}"`
                          : "Start typing to search..."}
                      </p>
                      {query.length >= 2 && (
                        <button
                          onClick={() => handleSearchSubmit(query)}
                          className="text-primary hover:underline flex items-center gap-1 mt-2"
                        >
                          Search for "{query}" <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </CommandEmpty>
                ) : (
                  <>
                    {/* Product Results */}
                    {filteredProducts.length > 0 && (
                      <CommandGroup heading={`Products (${filteredProducts.length})`}>
                        {filteredProducts.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.name}
                            onSelect={() => handleProductSelect(product)}
                            className="flex items-center gap-3 cursor-pointer p-2 group"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img loading="lazy"
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.subcategory} • ₹{product.price.toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleQuickView(product, e)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-md transition-all"
                              title="Quick View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {product.isNew && (
                              <Badge variant="default" className="flex-shrink-0">
                                New
                              </Badge>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* Category Results */}
                    {filteredCategories.length > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandGroup heading="Categories">
                          {filteredCategories.map((category) => (
                            <CommandItem
                              key={category}
                              value={category}
                              onSelect={() => handleCategorySelect(category)}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span>{category}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}

                    {/* Brand Results */}
                    {filteredBrands.length > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandGroup heading="Brands">
                          {filteredBrands.map((brand) => (
                            <CommandItem
                              key={brand}
                              value={brand}
                              onSelect={() => handleBrandSelect(brand)}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0" />
                              <span>{brand}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}

                    {/* Search All */}
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        value={`search-all`}
                        onSelect={() => handleSearchSubmit(query)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span>
                          {query.length >= 2 ? (
                            <>
                              See all results for <strong>"{query}"</strong>
                            </>
                          ) : (
                            "Browse all products"
                          )}
                          {activeFiltersCount > 0 && (
                            <span className="text-muted-foreground ml-1">
                              with {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}
                            </span>
                          )}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </>
            )}
          </CommandList>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden bg-background"
            >
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-sm mb-3">Price Range</h4>
                    <div className="px-1">
                      <Slider
                        value={filters.priceRange}
                        min={0}
                        max={30000}
                        step={500}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: value as [number, number],
                          }))
                        }
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₹{filters.priceRange[0].toLocaleString()}</span>
                        <span>₹{filters.priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h4 className="font-medium text-sm mb-3">Size</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={cn(
                            "h-9 text-xs font-medium rounded-md border transition-colors",
                            filters.sizes.includes(size)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:border-primary"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h4 className="font-medium text-sm mb-3">Color</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => toggleColor(color.value)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all relative",
                            filters.colors.includes(color.value)
                              ? "border-primary scale-110"
                              : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {filters.colors.includes(color.value) && (
                            <Check
                              className={cn(
                                "h-4 w-4 absolute inset-0 m-auto",
                                color.value === "#FFFFFF" || color.value === "#D69E2E"
                                  ? "text-foreground"
                                  : "text-white"
                              )}
                            />
                          )}
                          {color.value === "#FFFFFF" && (
                            <span className="absolute inset-0 rounded-full border border-border" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <h4 className="font-medium text-sm mb-3">Brands</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {allBrands.slice(0, 15).map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                        >
                          <Checkbox
                            checked={filters.brands.includes(brand)}
                            onCheckedChange={() => toggleBrand(brand)}
                          />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Save Search */}
                  {canSaveSearch && (
                    <div className="pt-2 border-t">
                      <AnimatePresence mode="wait">
                        {showSaveInput ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2"
                          >
                            <Input
                              placeholder="Name your saved search..."
                              value={saveSearchName}
                              onChange={(e) => setSaveSearchName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveSearch();
                                } else if (e.key === "Escape") {
                                  setShowSaveInput(false);
                                  setSaveSearchName("");
                                }
                              }}
                              className="h-9 text-sm"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={handleSaveSearch}
                                className="flex-1"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setShowSaveInput(false);
                                  setSaveSearchName("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowSaveInput(true)}
                              className="w-full"
                            >
                              <Bookmark className="h-4 w-4 mr-2" />
                              Save This Search
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Apply Filters Button */}
                  <Button
                    onClick={() => handleSearchSubmit(query)}
                    className="w-full"
                  >
                    Apply Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-primary-foreground/20">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer with keyboard hint */}
      <div className="border-t px-3 py-2 flex items-center justify-between text-xs text-muted-foreground bg-background">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <span className="text-xs">↵</span>
            </kbd>
            <span>to search</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>
            <span>to toggle</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            esc
          </kbd>
          <span>to close</span>
        </div>
      </div>
    </CommandDialog>

      <ProductQuickView
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
