import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Star, Minus, Plus, ShoppingBag, Check, Truck, Shield, RotateCcw, Sparkles } from 'lucide-react';
import { products as staticProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import ProductReviews from '@/components/shop/ProductReviews';
import { AISizeRecommender } from '@/components/ai/AISizeRecommender';
import { AIOutfitBuilder } from '@/components/ai/AIOutfitBuilder';
import { apiRequest } from '@/lib/api';

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const defaultColors = [
  { name: 'Black', value: '#1a1a1a' },
  { name: 'White', value: '#ffffff' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Beige', value: '#d4c4b0' },
  { name: 'Olive', value: '#556b2f' },
  { name: 'Red', value: '#c41e3a' },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Try static data first (numeric IDs), then API (MongoDB ObjectIds)
  const staticProduct = staticProducts.find(p => p.id === Number(id));

  const [dbProduct, setDbProduct] = useState<any>(null);
  const [loading, setLoading] = useState(!staticProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!staticProduct && id) {
      setLoading(true);
      apiRequest<any>(`/api/products/${id}`)
        .then(data => {
          setDbProduct({
            ...data,
            id: data._id || data.id,
            category: data.gender === 'unisex' ? 'accessories' : data.gender,
            subcategory: data.subcategory || data.category || 'General',
            rating: data.rating || 4.5,
            isNew: data.isNew ?? true,
          });
        })
        .catch(() => setDbProduct(null))
        .finally(() => setLoading(false));
    }
  }, [id, staticProduct]);

  const product = staticProduct || dbProduct;
  const reviewCount = useMemo(() => Math.floor(Math.random() * 200 + 50), [product?.id]);
  const productImages = product ? (product.images?.length ? product.images : [product.image]) : [];
  const productSizes = product?.sizes?.length ? product.sizes : defaultSizes;
  const productColors = product?.colors?.length
    ? product.colors.map((c: string) => ({ name: c, value: c === 'Black' ? '#1a1a1a' : c === 'White' ? '#ffffff' : c === 'Navy' ? '#1e3a5f' : c === 'Brown' ? '#8B4513' : c === 'Beige' ? '#d4c4b0' : c === 'Olive' ? '#556b2f' : c === 'Red' ? '#c41e3a' : c === 'Grey' ? '#808080' : c === 'Pink' ? '#FF69B4' : c === 'Blue' ? '#4169E1' : c === 'Gold' ? '#FFD700' : c === 'Silver' ? '#C0C0C0' : c === 'Tan' ? '#D2B48C' : c === 'Khaki' ? '#F0E68C' : c === 'Multi' ? '#FF6347' : '#333' }))
    : defaultColors;

  // Related products from static data
  const relatedProducts = staticProducts
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    if (!selectedColor) {
      toast({ title: "Please select a color", variant: "destructive" });
      return;
    }
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0] || '',
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your bag.`,
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "Product link copied to clipboard" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category}`} className="hover:text-foreground transition-colors capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-[3/4] bg-muted rounded-2xl overflow-hidden"
              >
                <img loading="lazy"
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {productImages.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
                      }`}
                    >
                      <img loading="lazy" src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.brand || 'RASU'}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.numReviews || reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm font-medium text-green-500">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground">{product.description}</p>
              )}

              {/* Color Selection */}
              <div>
                <p className="text-sm font-medium mb-3">
                  Color: <span className="text-muted-foreground">{selectedColor || 'Select a color'}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {productColors.map((color: {name: string; value: string}) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                        selectedColor === color.name
                          ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className={`w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                          color.name === 'White' || color.name === 'Beige' ? 'text-foreground' : 'text-white'
                        }`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <button
                  onClick={() => setIsSizeModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mb-3 group"
                >
                  <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  🤖 Find My Size
                </button>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">
                    Size: <span className="text-muted-foreground">{selectedSize || 'Select'}</span>
                  </p>
                  <button className="text-sm text-primary hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {productSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] h-12 px-4 rounded-lg border transition-all font-medium ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-sm font-medium mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-muted transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-muted transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="flex-1 h-14 text-base btn-glow" onClick={handleAddToCart}>
                  <ShoppingBag className="w-5 h-5 mr-2" /> Add to Bag
                </Button>
                <Button size="lg" variant="outline" className="h-14 w-14 p-0" onClick={() => setIsWishlisted(!isWishlisted)}>
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button size="lg" variant="outline" className="h-14 w-14 p-0" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-6 h-6 text-primary" />
                  <span className="text-xs text-muted-foreground">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="w-6 h-6 text-primary" />
                  <span className="text-xs text-muted-foreground">30 Day Returns</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <span className="text-xs text-muted-foreground">2 Year Warranty</span>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="pt-6">
                <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto">
                  <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Description</TabsTrigger>
                  <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Details</TabsTrigger>
                  <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Shipping</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-6 text-muted-foreground">
                  <p>{product.description || `Elevate your wardrobe with this premium ${product.name.toLowerCase()}. Crafted with meticulous attention to detail.`}</p>
                </TabsContent>
                <TabsContent value="details" className="pt-6">
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Premium quality fabric blend</li>
                    <li>• {product.subcategory ? `Category: ${product.subcategory}` : 'Regular fit silhouette'}</li>
                    <li>• Machine washable</li>
                    <li>• {product.stock ? `${product.stock} in stock` : 'In Stock'}</li>
                  </ul>
                </TabsContent>
                <TabsContent value="shipping" className="pt-6 text-muted-foreground">
                  <p>Free standard shipping on orders over ₹999.</p>
                  <ul className="mt-4 space-y-2">
                    <li>• Standard: 5-7 business days</li>
                    <li>• Express: 2-3 business days (+₹199)</li>
                    <li>• Next Day: 1 business day (+₹399)</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* AI Outfit Builder */}
          <AIOutfitBuilder
            productId={product.id}
            productName={product.name}
            productCategory={product.category}
            productSubcategory={product.subcategory}
            productGender={product.category === 'women' ? 'women' : 'men'}
            productPrice={product.price}
          />
        </section>

        {/* AI Size Recommender Modal */}
        <AISizeRecommender
          isOpen={isSizeModalOpen}
          onClose={() => setIsSizeModalOpen(false)}
          onSelectSize={(size) => setSelectedSize(size)}
          productName={product.name}
          productCategory={product.category}
        />

        {/* Reviews Section */}
        <section className="border-t border-border py-16">
          <div className="container mx-auto px-4">
            <ProductReviews
              productId={product.id}
              productName={product.name}
              averageRating={product.rating}
            />
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
