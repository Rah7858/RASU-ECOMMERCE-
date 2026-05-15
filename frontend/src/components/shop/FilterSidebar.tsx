import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

const subcategories = [
  "All",
  "Outerwear",
  "Hoodies",
  "T-Shirts",
  "Pants",
  "Dresses",
  "Tops",
  "Footwear",
  "Bags",
  "Watches",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#6B7280" },
  { name: "Navy", value: "#1E3A5F" },
  { name: "Red", value: "#DC2626" },
  { name: "Green", value: "#16A34A" },
];

export function FilterSidebar({ isOpen, onClose, priceRange, onPriceRangeChange }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(["price", "category", "size"]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-semibold"
              >
                Filters
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100%-140px)] p-4 sm:p-6 space-y-6">
              {/* Price Range */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="font-medium">Price Range</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSections.includes("price") ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openSections.includes("price") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground mb-1 block">Min (₹)</label>
                            <input
                              type="number"
                              value={priceRange[0]}
                              onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div className="pt-5">—</div>
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground mb-1 block">Max (₹)</label>
                            <input
                              type="number"
                              value={priceRange[1]}
                              onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                        
                        {/* Price range slider visual */}
                        <div className="relative h-2 bg-muted rounded-full">
                          <motion.div
                            className="absolute h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            style={{
                              left: `${(priceRange[0] / 30000) * 100}%`,
                              right: `${100 - (priceRange[1] / 30000) * 100}%`,
                            }}
                            layoutId="priceSlider"
                          />
                        </div>
                        
                        {/* Quick price options */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {[
                            { label: "Under ₹1,000", range: [0, 1000] as [number, number] },
                            { label: "₹1,000 - ₹5,000", range: [1000, 5000] as [number, number] },
                            { label: "₹5,000 - ₹10,000", range: [5000, 10000] as [number, number] },
                            { label: "Above ₹10,000", range: [10000, 30000] as [number, number] },
                          ].map((option) => (
                            <button
                              key={option.label}
                              onClick={() => onPriceRangeChange(option.range)}
                              className="px-3 py-1.5 text-xs bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Subcategory */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <button
                  onClick={() => toggleSection("category")}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="font-medium">Category</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSections.includes("category") ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openSections.includes("category") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 flex flex-wrap gap-2">
                        {subcategories.map((cat) => (
                          <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSubcategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              selectedSubcategory === cat
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                            }`}
                          >
                            {cat}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Sizes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={() => toggleSection("size")}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="font-medium">Size</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSections.includes("size") ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openSections.includes("size") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 flex flex-wrap gap-2">
                        {sizes.map((size) => (
                          <motion.button
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleSize(size)}
                            className={`w-12 h-10 rounded-lg text-sm font-medium transition-all ${
                              selectedSizes.includes(size)
                                ? "bg-primary text-primary-foreground shadow-glow-sm"
                                : "bg-muted hover:bg-muted/80"
                            }`}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Colors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <button
                  onClick={() => toggleSection("color")}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="font-medium">Color</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSections.includes("color") ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openSections.includes("color") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 flex flex-wrap gap-3">
                        {colors.map((color) => (
                          <motion.button
                            key={color.name}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleColor(color.name)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                              selectedColors.includes(color.name)
                                ? "border-primary shadow-glow-sm"
                                : "border-transparent hover:border-muted-foreground/30"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          >
                            {selectedColors.includes(color.name) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-full h-full flex items-center justify-center"
                              >
                                <div className={`w-2 h-2 rounded-full ${color.value === "#FFFFFF" ? "bg-foreground" : "bg-white"}`} />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-border bg-card">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setSelectedSubcategory("All");
                    onPriceRangeChange([0, 300]);
                  }}
                  className="flex-1 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Clear All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <span className="relative z-10">Apply Filters</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
