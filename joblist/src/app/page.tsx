import TextParallaxContentExample from "@/components/Hero";
import FloatingNavbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <FloatingNavbar />

      {/* Hero Section */}
      <TextParallaxContentExample />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>© 2024 HomeServices. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}