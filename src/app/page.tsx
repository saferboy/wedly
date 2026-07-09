import Navbar from "@/components/marketing/Navbar";
import HeroSection from "@/components/marketing/HeroSection";
import HowItWorks from "@/components/marketing/HowItWorks";
import TemplatesPreview from "@/components/marketing/TemplatesPreview";
import Pricing from "@/components/marketing/Pricing";
import Footer from "@/components/marketing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <TemplatesPreview />
      <Pricing />
      <Footer />
    </>
  );
}
