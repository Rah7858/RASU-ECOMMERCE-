import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, Edit, Trash2, X } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { products as dummyProducts } from "@/data/products";

// A mock products interface matching the store products
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  gender: string;
  image: string;
  stock: number;
  sizes: string[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(
    dummyProducts.map((p) => ({ ...p, stock: Math.floor(Math.random() * 50) + 10, sizes: ["S", "M", "L", "XL"] }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    gender: "",
    image: "",
    stock: "",
    sizes: [] as string[],
  });

  const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", category: "", gender: "", image: "", stock: "", sizes: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      price: String(p.price),
      category: p.category,
      gender: p.gender,
      image: p.image,
      stock: String(p.stock),
      sizes: p.sizes,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill required fields");
      return;
    }

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...formData, price: Number(formData.price), stock: Number(formData.stock) }
            : p
        )
      );
      toast.success("Product updated successfully");
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      setProducts([newProduct, ...products]);
      toast.success("Product added successfully");
    }
    setIsModalOpen(false);
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }));
  };

  return (
    <AdminLayout title="Products">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="T-Shirts">T-Shirts</SelectItem>
            <SelectItem value="Hoodies">Hoodies</SelectItem>
            <SelectItem value="Jackets">Jackets</SelectItem>
            <SelectItem value="Pants">Pants</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <Card className="border-border/50">
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_100px] gap-4 p-4 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span>Image</span>
              <span>Product Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_100px] gap-4 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors items-center"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                  <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.gender}</p>
                </div>
                <span className="text-sm">{product.category}</span>
                <span className="text-sm font-medium">₹{product.price}</span>
                <span className={`text-sm ${product.stock < 15 ? "text-red-400" : "text-green-400"}`}>
                  {product.stock} in stock
                </span>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400" onClick={() => openEditModal(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No products found</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                <form id="productForm" onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Product Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Streetwear Graphic Tee"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Price (₹)</label>
                      <Input
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="1499"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Stock</label>
                      <Input
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Category</label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                          <SelectItem value="Hoodies">Hoodies</SelectItem>
                          <SelectItem value="Jackets">Jackets</SelectItem>
                          <SelectItem value="Pants">Pants</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Gender</label>
                      <Select
                        value={formData.gender}
                        onValueChange={(v) => setFormData({ ...formData, gender: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Men">Men</SelectItem>
                          <SelectItem value="Women">Women</SelectItem>
                          <SelectItem value="Unisex">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Image URL</label>
                    <Input
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                            formData.sizes.includes(size)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/50 text-muted-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-4 border-t border-border bg-card flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button form="productForm" type="submit">
                  {editingProduct ? "Save Changes" : "Add Product"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
