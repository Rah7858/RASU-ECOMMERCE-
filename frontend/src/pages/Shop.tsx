import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Filter, Grid3X3, LayoutGrid, SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { products as staticProducts, getSubcategories } from "@/data/products";
import { apiRequest } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";

const categories = [
  { id: "all", name: "All Products" },
  { id: "men", name: "Men" },
  { id: "women", name: "Women" },
  { id: "accessories", name: "Accessories" },
  { id: "trending", name: "Trending" },
];

const subcategoriesByCategory: Record<string, string[]> = {
  men: getSubcategories("men"),
  women: getSubcategories("women"),
  accessories: getSubcategories("accessories"),
};

const sortOptions = [
  { id: "featured", name: "Featured" },
  { id: "newest", name: "Newest" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Top Rated" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridView, setGridView] = useState<"grid" | "large">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const { t } = useTranslation();

  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set("search", debouncedSearch);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams, { replace: true });
  }, [debouncedSearch, setSearchParams]);
  
  // Get subcategories for active category
  const currentSubcategories = activeCategory !== "all" && activeCategory !== "trending" 
    ? subcategoriesByCategory[activeCategory] || []
    : [];

  // Fetch products from API
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["products", activeCategory, debouncedSearch],
    queryFn: async () => {
      let url = "/api/products?";
      if (activeCategory === "men" || activeCategory === "women") {
        url += `gender=${activeCategory}&`;
      } else if (activeCategory === "accessories") {
        url += `gender=unisex&`;
      }
      
      if (debouncedSearch) {
        url += `search=${debouncedSearch}&`;
      }
      
      const res = await apiRequest<any[]>(url);
      return res.map(p => ({
        ...p,
        id: p._id || p.id,
        category: p.gender === "unisex" ? "accessories" : p.gender,
        subcategory: p.category || "General",
        rating: p.rating || 4.5,
        isNew: p.isNew !== undefined ? p.isNew : true,
      }));
    }
  });

  // Filter and sort products locally
  const filteredProducts = dbProducts
    .filter((product) => {
      // Category filter (trending)
      if (activeCategory === "trending") {
        if (!product.isNew) return false;
      }
      
      // Subcategory filter
      if (activeSubcategory && product.subcategory !== activeSubcategory) {
        return false;
      }
      
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Group products by category for "all" view
  const groupedProducts = activeCategory === "all" || activeCategory === "trending"
    ? {
        men: filteredProducts.filter(p => p.category === "men"),
        women: filteredProducts.filter(p => p.category === "women"),
        accessories: filteredProducts.filter(p => p.category === "accessories"),
      }
    : null;

  const categoryLabels: Record<string, string> = {
    men: "Men's Collection",
    women: "Women's Collection",
    accessories: "Accessories",
  };

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setActiveSubcategory(null); // Reset subcategory when category changes
    setSearchParams(searchParams);
  };

  const handleSubcategoryChange = (subcategory: string | null) => {
    setActiveSubcategory(subcategory);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative pt-32 pb-16 overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl"
          />
        </div>

        {/* Geometric lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[20, 50, 80].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              style={{ top: `${pos}%`, transformOrigin: i % 2 === 0 ? "left" : "right" }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-sm font-medium tracking-widest uppercase text-primary mb-4"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Discover Our Collection
              </motion.span>
            </motion.span>
            
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 100, skewY: 5 }}
                animate={{ y: 0, skewY: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              >
                {t("shop.title")}
              </motion.h1>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto"
            >
              Explore our curated collection of premium streetwear and accessories.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section ref={containerRef} className="pb-24">
        <div className="container mx-auto px-4 md:px-8">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-10 overflow-x-auto scrollbar-hide pb-2 px-4 sm:px-0 sm:justify-center sm:flex-wrap"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => handleCategoryChange(category.id)}
                className={`relative px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeCategory === category.id
                    ? "text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  {t(`nav.${category.id === 'all' ? 'shop' : category.id}`)}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Subcategory Tabs */}
          <AnimatePresence>
            {currentSubcategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleSubcategoryChange(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSubcategory === null
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                    }`}
                  >
                    All {activeCategory === "men" ? "Men's" : activeCategory === "women" ? "Women's" : "Accessories"}
                  </motion.button>
                  {currentSubcategories.map((subcategory, index) => (
                    <motion.button
                      key={subcategory}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSubcategoryChange(subcategory)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeSubcategory === subcategory
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                      }`}
                    >
                      {subcategory}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-stretch justify-between gap-4 mb-8 p-4 glass rounded-2xl border border-border/50 sm:flex-row sm:items-center"
          >
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("shop.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-background/50 rounded-xl border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Filter Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-background/50 rounded-xl border border-border/50 text-sm font-medium hover:border-primary/50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t("shop.filters")}
              </motion.button>

              {/* Sort Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-background/50 rounded-xl border border-border/50 text-sm font-medium hover:border-primary/50 transition-colors min-w-[160px]"
                >
                  <span>{sortOptions.find(s => s.id === sortBy)?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                </motion.button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 py-2 bg-card rounded-xl border border-border/50 shadow-xl z-20 max-w-[calc(100vw-2rem)]"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortBy(option.id);
                            setIsSortOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors ${
                            sortBy === option.id ? "text-primary font-medium" : ""
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Grid Toggle */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-background/50 rounded-xl border border-border/50">
                <button
                  onClick={() => setGridView("grid")}
                  className={`p-2 rounded-lg transition-colors ${gridView === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridView("large")}
                  className={`p-2 rounded-lg transition-colors ${gridView === "large" ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <p className="text-sm text-muted-foreground">
              {t("shop.showing", { count: filteredProducts.length })}
            </p>
          </motion.div>

          {/* Products by Category */}
          {groupedProducts ? (
            // Show grouped by category
            <div className="space-y-16">
              {Object.entries(groupedProducts).map(([categoryKey, products], categoryIndex) => {
                if (products.length === 0) return null;
                
                return (
                  <motion.div
                    key={categoryKey}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.15, duration: 0.6 }}
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.3 + categoryIndex * 0.1, duration: 0.5 }}
                          className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full origin-left"
                        />
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {categoryLabels[categoryKey]}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {products.length} {products.length === 1 ? "product" : "products"}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCategoryChange(categoryKey)}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        View All →
                      </motion.button>
                    </div>

                    {/* Products Grid */}
                    <motion.div
                      layout
                      className={`grid gap-6 ${
                        gridView === "grid"
                          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      <AnimatePresence mode="popLayout">
                        {products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ 
                              duration: 0.5, 
                              delay: index * 0.05,
                              layout: { duration: 0.3 }
                            }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Show flat grid for single category
            <motion.div
              layout
              className={`grid gap-6 ${
                gridView === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.05,
                      layout: { duration: 0.3 }
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 bg-muted/50 rounded-2xl mb-6"
              >
                <Search className="w-8 h-8 text-muted-foreground" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{t("shop.no_products")}</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearchQuery("");
                  setPriceRange([0, 300]);
                  handleCategoryChange("all");
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium"
              >
                {t("shop.clear_filters")}
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
      />

      <Footer />
    </div>
  );
}
