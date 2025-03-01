import TextParallaxContentExample from "@/components/Hero";
import FloatingNavbar from "@/components/Navbar";
import { Section } from "@/components/Section";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <FloatingNavbar />

      {/* Hero Section */}
      <TextParallaxContentExample />
      <Section />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>© 2025 JobLink. All rights reserved.</p>
            <p className="mt-2">
              Designed & Developed by{" "}
              <span className="font-semibold text-[#FB7600]">HackeRinaa</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
