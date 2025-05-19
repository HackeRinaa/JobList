"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function FloatingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Only show main navbar when mobile menu is closed */}
      {!isMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-4 sm:top-6 inset-x-0 mx-auto w-[90%] sm:w-max bg-white border border-gray-200 rounded-full shadow-lg z-50"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-1 sm:py-2 gap-4 sm:gap-6">
            {/* Logo - made smaller */}
            <Link href="/" className="flex items-center gap-2 p-0 m-0">
              <Image 
                src="/job_listing_logo_150x150_rgb_page-0001-removebg-preview.png" 
                alt="JobListing Logo" 
                width={48} 
                height={48} 
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/"
                className={`text-sm ${isActive("/") ? "bg-[#FB7600] text-white rounded-full" : "text-gray-600"} px-3 py-1.5 transition-colors hover:bg-[#FB7600] hover:text-white hover:rounded-full`}
              >
                Αρχική
              </Link>
              <Link
                href="/how-it-works"
                className={`text-sm ${isActive("/how-it-works") ? "bg-[#FB7600] text-white rounded-full" : "text-gray-600"} px-3 py-1.5 transition-colors hover:bg-[#FB7600] hover:text-white hover:rounded-full`}
              >
                Πώς Λειτουργεί
              </Link>
              <Link
                href="/worker"
                className={`text-sm ${isActive("/worker") ? "bg-[#FB7600] text-white rounded-full" : "text-gray-600"} px-3 py-1.5 transition-colors hover:bg-[#FB7600] hover:text-white hover:rounded-full`}
              >
                Μάστορας
              </Link>
              <Link
                href="/customer"
                className={`text-sm ${isActive("/customer") ? "bg-[#FB7600] text-white rounded-full" : "text-gray-600"} px-3 py-1.5 transition-colors hover:bg-[#FB7600] hover:text-white hover:rounded-full`}
              >
                Ιδιώτης
              </Link>
              <Link
                href="/contact"
                className={`text-sm ${isActive("/contact") ? "bg-[#FB7600] text-white rounded-full" : "text-gray-600"} px-3 py-1.5 transition-colors hover:bg-[#FB7600] hover:text-white hover:rounded-full`}
              >
                Επικοινωνία
              </Link>
            </div>

            {/* Sign In Button - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="bg-[#FB7600] text-white px-4 py-1.5 rounded-full text-sm hover:bg-[#E56A00] transition-colors"
              >
                Σύνδεση
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden bg-[#FB7600] text-white p-1.5 rounded-full"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
            </button>
          </div>
        </motion.nav>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMenu}>
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-[75%] max-w-[300px] bg-white shadow-lg z-50 py-4 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
              <Link href="/" className="flex items-center gap-2" onClick={toggleMenu}>
                <Image 
                  src="/job_listing_logo_150x150_rgb_page-0001-removebg-preview.png" 
                  alt="JobListing Logo" 
                  width={40} 
                  height={40} 
                  className="w-8 h-8"
                />
                <span className="text-lg font-semibold text-[#FB7600]">JobListing</span>
              </Link>
              <button onClick={toggleMenu} className="text-gray-500">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className={`${isActive("/") ? "text-[#FB7600]" : "text-gray-600"} py-1.5 transition-colors hover:text-[#FB7600]`}
                onClick={toggleMenu}
              >
                Αρχική
              </Link>
              <Link
                href="/how-it-works"
                className={`${isActive("/how-it-works") ? "text-[#FB7600]" : "text-gray-600"} py-1.5 transition-colors hover:text-[#FB7600]`}
                onClick={toggleMenu}
              >
                Πώς Λειτουργεί
              </Link>
              <Link
                href="/worker"
                className={`${isActive("/worker") ? "text-[#FB7600]" : "text-gray-600"} py-1.5 transition-colors hover:text-[#FB7600]`}
                onClick={toggleMenu}
              >
                Μάστορας
              </Link>
              <Link
                href="/customer"
                className={`${isActive("/customer") ? "text-[#FB7600]" : "text-gray-600"} py-1.5 transition-colors hover:text-[#FB7600]`}
                onClick={toggleMenu}
              >
                Ιδιώτης
              </Link>
              <Link
                href="/contact"
                className={`${isActive("/contact") ? "text-[#FB7600]" : "text-gray-600"} py-1.5 transition-colors hover:text-[#FB7600]`}
                onClick={toggleMenu}
              >
                Επικοινωνία
              </Link>
              
              <div className="pt-3 mt-3 border-t border-gray-200">
                <Link
                  href="/login"
                  className="w-full block bg-[#FB7600] text-white px-4 py-2 rounded-full text-center hover:bg-[#E56A00] transition-colors text-sm"
                  onClick={toggleMenu}
                >
                  Σύνδεση
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}