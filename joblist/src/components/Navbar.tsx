"use client"; // Mark this as a Client Component in Next.js

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

export default function FloatingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -50 }} // Start off-screen
        animate={{ opacity: 1, y: 0 }} // Animate into view
        transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
        className="fixed top-4 sm:top-6 inset-x-0 mx-auto w-[90%] sm:w-max bg-white border border-gray-200 rounded-full shadow-lg z-50"
      >
        <div className="flex items-center justify-between px-4 sm:px-8 py-2 sm:py-3 gap-4 sm:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#FB7600] font-weight-bold">JobListing</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
            >
              Αρχική
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
            >
              Πώς Λειτουργεί
            </Link>
            <Link
              href="/worker"
              className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
            >
              Μάστορας
            </Link>
            <Link
              href="/customer"
              className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
            >
              Ιδιώτης
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
            >
              Επικοινωνία
            </Link>
          </div>

          {/* Sign In Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="bg-[#FB7600] text-white px-6 py-2 rounded-full text-sm hover:bg-[#E56A00] transition-colors"
            >
              Σύνδεση
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden bg-[#FB7600] text-white p-2 rounded-full"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMenu}>
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-[75%] max-w-[300px] bg-white shadow-lg z-50 py-6 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-semibold text-[#FB7600]">JobListing</span>
              </Link>
              <button onClick={toggleMenu} className="text-gray-500">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#FB7600] py-2 transition-colors"
                onClick={toggleMenu}
              >
                Αρχική
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-600 hover:text-[#FB7600] py-2 transition-colors"
                onClick={toggleMenu}
              >
                Πώς Λειτουργεί
              </Link>
              <Link
                href="/worker"
                className="text-gray-600 hover:text-[#FB7600] py-2 transition-colors"
                onClick={toggleMenu}
              >
                Μάστορας
              </Link>
              <Link
                href="/customer"
                className="text-gray-600 hover:text-[#FB7600] py-2 transition-colors"
                onClick={toggleMenu}
              >
                Ιδιώτης
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-[#FB7600] py-2 transition-colors"
                onClick={toggleMenu}
              >
                Επικοινωνία
              </Link>
              
              <div className="pt-4 mt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="w-full block bg-[#FB7600] text-white px-4 py-2 rounded-full text-center hover:bg-[#E56A00] transition-colors"
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