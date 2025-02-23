"use client"; // Mark this as a Client Component in Next.js

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FloatingNavbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }} // Start off-screen
      animate={{ opacity: 1, y: 0 }} // Animate into view
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
      className="fixed top-6 inset-x-0 mx-auto w-max bg-white border border-gray-200 rounded-full shadow-lg z-50"
    >
      <div className="flex items-center justify-between px-8 py-3 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-[#FB7600] font-weight-bold">JobList</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/worker"
            className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
          >
            Worker
          </Link>
          <Link
            href="/customer"
            className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
          >
            Customer
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-600 hover:bg-[#FB7600] hover:text-white hover:rounded-full px-4 py-2 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Sign In Button */}
        <Link
          href="/auth/login"
          className="hidden md:block bg-[#FB7600] text-white px-6 py-2 rounded-full text-sm hover:bg-[#E56A00] transition-colors"
        >
          Sign In
        </Link>
      </div>
    </motion.nav>
  );
}