import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { ProductsSection } from "@/components/ProductsSection";
import { BrandStorySection } from "@/components/BrandStorySection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      {/* Noise texture overlay */}
      <div className="noise" />
      
      <Navbar />
      
      <main className="relative overflow-x-clip">
        <HeroSection />
        <CategoriesSection />
        <ProductsSection />
        <BrandStorySection />
        <NewsletterSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
