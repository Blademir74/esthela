import HeroSection from "@/components/HeroSection";
import ProposalSection from "@/components/ProposalSection";
import RegistrationForm from "@/components/RegistrationForm";
import TestimonialSection from "@/components/TestimonialSection";
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
      <TestimonialSection />
      <SocialMediaSection />
      <Footer />
    </div>
  );
};

export default Index;
