import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { ProductsSection } from "@/components/ProductsSection";
import { BrandStorySection } from "@/components/BrandStorySection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import { DeveloperBanner } from "@/components/common/DeveloperBanner";
import { RecentlyViewedSection } from "@/components/features/RecentlyViewedSection";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { SEO } from "@/components/SEO";

const Index = () => {
  const { items: recentlyViewed, clearHistory } = useRecentlyViewed();

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <SEO />
      {/* Noise texture overlay */}
      <div className="noise" />

      <DeveloperBanner />
      <Navbar />
      
      <main className="relative overflow-x-clip">
        <HeroSection />
        <RecentlyViewedSection items={recentlyViewed} onClear={clearHistory} />
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

