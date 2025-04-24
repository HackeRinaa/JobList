"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HowItWorks() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-start w-full px-4 sm:px-8 pt-24 sm:pt-32 pb-12 flex-grow">
        <div className="w-full max-w-5xl mx-auto">
          {/* Hero section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-600 text-center sm:text-left">
              Πώς λειτουργεί για
              <span className="text-[#FB7600] block mt-1">Μάστορες & Ιδιώτες</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-xs text-center sm:text-right">
              Προγραμμάτισε τις δουλειές σου εύκολα και γρήγορα, βρίσκοντας κατάλληλους επαγγελματίες.
            </p>
          </div>

          {/* Image and divider */}
          <div className="w-full flex flex-col items-center justify-center mb-16">
            <div className="relative w-full max-w-md mb-6">
              <Image
                src="/how-it-works.png"
                alt="How it works"
                width={500}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="h-1 bg-[#FB7600] opacity-70 w-full max-w-xl rounded-full"></div>
          </div>

          {/* For professionals section */}
          <div className="mb-20">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-2 text-center md:text-left">
                  Για <span className="text-[#FB7600]">Μάστορες</span>
                </h2>
                <p className="text-gray-500 max-w-md text-center md:text-left">
                  Ανακαλύψτε πώς να βρείτε νέους πελάτες και να αναπτύξετε την επιχείρησή σας.
                </p>
              </div>
              <Image 
                src="/mastoras.png" 
                alt="Professionals" 
                width={180} 
                height={180}
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stepsMastoras.slice(0, 6).map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#FB7600] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                    <Image src={step.icon} alt={step.title} width={24} height={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                  <Link 
                    href="/worker" 
                    className="inline-flex items-center text-[#FB7600] text-sm font-medium hover:underline"
                  >
                    {step.buttonText} →
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/worker"
                className="bg-[#FB7600] text-white px-6 py-3 rounded-lg inline-block font-medium hover:bg-[#E56A00] transition-colors"
              >
                Ξεκίνα ως Μάστορας
              </Link>
            </div>
          </div>

          {/* For customers section */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row-reverse items-center md:items-start justify-between gap-8 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-2 text-center md:text-right">
                  Για <span className="text-[#FB7600]">Ιδιώτες</span>
                </h2>
                <p className="text-gray-500 max-w-md text-center md:text-right">
                  Βρείτε τον κατάλληλο επαγγελματία γρήγορα και εύκολα για οποιαδήποτε εργασία.
                </p>
              </div>
              <Image 
                src="/customer.png" 
                alt="Customers" 
                width={180} 
                height={180}
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stepsIndividual.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#FB7600] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                    <Image src={step.icon} alt={step.title} width={24} height={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                  <Link 
                    href="/customer" 
                    className="inline-flex items-center text-[#FB7600] text-sm font-medium hover:underline"
                  >
                    {step.buttonText} →
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/customer"
                className="bg-[#FB7600] text-white px-6 py-3 rounded-lg inline-block font-medium hover:bg-[#E56A00] transition-colors"
              >
                Βρες Επαγγελματία
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const stepsMastoras = [
  {
    title: "Δημιούργησε το Προφίλ σου",
    description: "Συμπλήρωσε τα στοιχεία σου και πρόσθεσε τις υπηρεσίες που προσφέρεις για να ξεκινήσεις.",
    buttonText: "Γίνε Μέλος",
    icon: "/signup.png",
  },
  {
    title: "Διάλεξε ένα Πλάνο",
    description: "Επίλεξε το συνδρομητικό πλάνο που ταιριάζει στις ανάγκες και τον προϋπολογισμό σου.",
    buttonText: "Δες τα πλάνα",
    icon: "/choose.png",
  },
  {
    title: "Όρισε τους Όρους σου",
    description: "Καθόρισε τις υπηρεσίες που προσφέρεις, τις περιοχές και τη διαθεσιμότητά σου.",
    buttonText: "Ξεκίνα Τώρα",
    icon: "/money.png",
  },
  {
    title: "Ξεκλείδωσε αγγελίες",
    description: "Δες τις διαθέσιμες αγγελίες εργασίας και ξεκλείδωσε αυτές που σε ενδιαφέρουν.",
    buttonText: "Δες Αγγελίες",
    icon: "/unlock.png",
  },
  {
    title: "Επικοινώνησε με πελάτες",
    description: "Μίλησε απευθείας με τον πελάτη για τις λεπτομέρειες και κανόνισε το ραντεβού.",
    buttonText: "Γίνε Μέλος",
    icon: "/phone.png",
  },
  {
    title: "Προγραμμάτισε Ραντεβού",
    description: "Οργάνωσε το πρόγραμμά σου και εξασφάλισε ότι δεν θα χάσεις κανένα έργο.",
    buttonText: "Ξεκίνα Τώρα",
    icon: "/calendar.png",
  },
];

const stepsIndividual = [
  {
    title: "Δημιούργησε το Προφίλ σου",
    description: "Συμπλήρωσε τα στοιχεία σου για να λάβεις εξατομικευμένες προτάσεις από επαγγελματίες.",
    buttonText: "Γίνε Μέλος",
    icon: "/signup.png",
  },
  {
    title: "Ανέβασε την Αγγελία σου",
    description: "Δημιούργησε μια αγγελία περιγράφοντας ακριβώς τη δουλειά που χρειάζεσαι.",
    buttonText: "Ανέβασε Αγγελία",
    icon: "/listing.png",
  },
  {
    title: "Διάλεξε τον Κατάλληλο Μάστορα",
    description: "Σύγκρινε αξιολογήσεις, εμπειρία και τιμές για να βρεις τον ιδανικό επαγγελματία.",
    buttonText: "Βρες Μάστορα",
    icon: "/choose-worker.png",
  },
  {
    title: "Προγραμμάτισε τα Ραντεβού σου",
    description: "Κλείσε εύκολα το ραντεβού απευθείας με τον μάστορα χωρίς καθυστερήσεις.",
    buttonText: "Ξεκίνα Τώρα",
    icon: "/calendar.png",
  },
];