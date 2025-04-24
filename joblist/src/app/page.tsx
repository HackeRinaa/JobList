import TextParallaxContentExample from "@/components/Hero";
import FloatingNavbar from "@/components/Navbar";
import { Section } from "@/components/Section";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <FloatingNavbar />

      {/* Hero Section */}
      <TextParallaxContentExample />
      <Section />

      {/* Footer */}
      <Footer />
    </div>
  );
}
