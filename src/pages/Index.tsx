import HeroSection from "@/components/HeroSection";
import ProposalSection from "@/components/ProposalSection";
import RegistrationForm from "@/components/RegistrationForm";
import RegistrationProgress from "@/components/RegistrationProgress";
import TestimonialSection from "@/components/TestimonialSection";
import ImpactGallery from "@/components/ImpactGallery";
import SocialMediaSection from "@/components/SocialMediaSection";
import Footer from "@/components/Footer";

const Index = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById("registro");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection onCtaClick={scrollToForm} />
      <ProposalSection />
      <RegistrationForm />
      <RegistrationProgress />
      <TestimonialSection />
      <ImpactGallery />
      <SocialMediaSection />
      <Footer />
    </div>
  );
};

export default Index;
