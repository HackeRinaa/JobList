"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";

export default function HowItWorks() {
  return (
    <div className="bg-white h-auto flex flex-col items-center justify-start gap-10">
      <Navbar />
      <div className="flex flex-col items-center justify-start gap-10 w-[80%]">
        <div className="mt-[150px] flex items-start justify-center gap-10 w-full">
          <h2 className="text-6xl font-bold text-gray-600 leading-normal">
            Πώς λειτουργεί για
            <br /> <span className="text-[#FB7600]">Μάστορες</span> &{" "}
            <span className="text-[#FB7600]">Ιδιώτες</span>
          </h2>
          <p className="mt-6 text-lg font-semibold text-gray-400 max-w-[300px]">
            Προγραμμάτισε τις δουλειές σου εύκολα και γρήγορα, βρίσκοντας
            κατάλληλους επαγγελματίες.
          </p>
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <Image
            src="/how-it-works.png"
            alt="How it works"
            width={500}
            height={400}
          />
          {/* Horizontal Line */}
          <div className="h-2 bg-[#FB7600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] blur-[10px] w-[1000px]"></div>
        </div>
        <HowItWorksMastoras />
        <HowItWorksIndividuals />
      </div>
      <footer className="bg-gray-800 text-white py-8 w-full">
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

const stepsMastoras = [
  {
    title: "Δημιούργησε το Προφίλ σου",
    description: "Συμπλήρωσε τα στοιχεία σου και πρόσθεσε τις υπηρεσίες που προσφέρεις. Ένα ολοκληρωμένο προφίλ αυξάνει τις πιθανότητες να σε επιλέξουν.",
    buttonText: "Γίνε Μέλος",
    icon: "/signup.png",
  },
  {
    title: "Διάλεξε ένα Πλάνο για εσένα",
    description: "Επίλεξε το συνδρομητικό πλάνο που ταιριάζει στις ανάγκες και τον προϋπολογισμό σου. Κάθε πλάνο προσφέρει διαφορετικά προνόμια και αριθμό αγγελιών που μπορείς να ξεκλειδώσεις.",
    buttonText: "Δες τα πλάνα",
    icon: "/choose.png",
  },
  {
    title: "Όρισε τους Δικούς σου Όρους",
    description: "Καθόρισε τις υπηρεσίες που προσφέρεις, τις περιοχές όπου δουλεύεις και τη διαθεσιμότητά σου. Έτσι, θα λαμβάνεις μόνο σχετικές αγγελίες που ταιριάζουν στις προτιμήσεις σου.",
    buttonText: "Ξεκίνα Τώρα",
    icon: "/money.png",
  },
  {
    title: "Αναζήτησε & Ξεκλείδωσε αγγελίες",
    description: "Δες τις διαθέσιμες αγγελίες εργασίας, ξεκλείδωσε αυτές που σε ενδιαφέρουν και επικοινώνησε με τους πελάτες για περισσότερες λεπτομέρειες.",
    buttonText: "Δες Αγγελίες",
    icon: "/unlock.png",
  },
  {
    title: "Επικοινώνησε με τους πελάτες σου",
    description: "Χρησιμοποίησε τη διαθέσιμη επικοινωνία για να μιλήσεις απευθείας με τον πελάτη. Συζήτησε τις λεπτομέρειες της εργασίας, συμφωνήστε την τιμή και κανονίστε το ραντεβού.",
    buttonText: "Γίνε Μέλος",
    icon: "/phone.png",
  },
  {
    title: "Προγραμμάτισε τα Ραντεβού σου",
    description: "Οργάνωσε το πρόγραμμα των ραντεβού σου, σημείωσε τις συμφωνημένες εργασίες και εξασφάλισε ότι δεν θα χάσεις κανένα σημαντικό έργο.",
    buttonText: "Ξεκίνα Τώρα	",
    icon: "/calendar.png",
  },
];


const HowItWorksMastoras = () => {
  return (
    <div className="w-[80%] mx-auto py-10 px-5">
      <div className="flex items-start justify-center gap-10 mb-10">
        <h2 className="text-4xl font-bold text-left text-gray-600 leading-snug">
          Πώς Λειτουργεί <br/>Για <br/><span className="text-[#FB7600]">Μάστορες</span>
        </h2>
        <Image src="/mastoras.png" alt="How it works" width={400} height={400} />
      </div>
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#FB7600] z-0"></div>
        
        <div className="relative z-10">
          {stepsMastoras.map((step, index) => (
            <div key={index} className="mb-20 relative">
              {/* Content container */}
              <div className={`w-full flex items-start ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Icon container - always in the middle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 bg-white p-2 rounded-full z-20">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#FB7600] bg-opacity-20 rounded-full">
                    <Image src={step.icon} alt={step.title} width={40} height={40} />
                  </div>
                </div>
                
                {/* Left or right content based on index */}
                <div className={`w-5/12 text-left pl-8`}>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">{step.title}</h3>
                  <p className="text-gray-600 mb-4 text-left">{step.description}</p>
                  <button className="bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all">
                    {step.buttonText}
                  </button>
                </div>
                
                {/* Empty space for the other side */}
                <div className="w-5/12"></div>
              </div>
              
              {/* Connector line to next step (except for the last one) */}
              {index < stepsMastoras.length - 2 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-14 h-16 w-1">
                  <svg className="w-full h-full" viewBox="0 0 10 40">
                    <path 
                      d={index % 2 === 0 
                        ? "M5,0 Q15,20 5,40" 
                        : "M5,0 Q-5,20 5,40"
                      } 
                      stroke="#FB7600" 
                      fill="none" 
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="-mt-10 text-center bg-[#FB7600] text-xl font-bold text-white py-2 rounded-lg w-[50%] mx-auto">
        Ολοκλήρωσες τα βήματα! Ώρα για δράση!
      </div>
    </div>
  );
};
const stepsIndividual = [
  {
    title: "Δημιούργησε το Προφίλ σου",
    description: "Συμπλήρωσε τα στοιχεία σου και πρόσθεσε πληροφορίες για τις εργασίες που αναζητάς. Ένα πλήρες προφίλ θα σε βοηθήσει να λάβεις καλύτερες προσφορές από μάστορες.",
    buttonText: "Γίνε Μέλος",
    icon: "/signup.png",
  },
  {
    title: "Ανέβασε Δωρεάν την Αγγελία σου",
    description: "Δημιούργησε μια αγγελία περιγράφοντας ακριβώς τη δουλειά που χρειάζεσαι. Πρόσθεσε λεπτομέρειες όπως ημερομηνίες, τοποθεσία και προϋπολογισμό για να λάβεις στοχευμένες προτάσεις.",
    buttonText: "Ανέβασε Αγγελία",
    icon: "/listing.png",
  },
  {
    title: "Διάλεξε τον Κατάλληλο Μάστορα",
    description: "Δες τα προφίλ των διαθέσιμων μαστόρων, σύγκρινε αξιολογήσεις, εμπειρία και τιμές. Επίλεξε τον επαγγελματία που ταιριάζει καλύτερα στις ανάγκες σου.",
    buttonText: "Βρες Μάστορα",
    icon: "/choose-worker.png",
  },
  {
    title: "Προγραμμάτισε τα Ραντεβού σου",
    description: "Κλείσε εύκολα το ραντεβού σου απευθείας με τον μάστορα. Συζήτησε τις λεπτομέρειες, συμφώνησε την τιμή και οργάνωσε τη δουλειά σου χωρίς καθυστερήσεις.",
    buttonText: "Ξεκίνα Τώρα",
    icon: "/calendar.png",
  },
];



const HowItWorksIndividuals = () => {
  return (
    <div className="w-[80%] mx-auto py-10 px-5">
      <div className="flex items-start justify-center gap-12 mb-10">
      <Image src="/customer.png" alt="How it works" width={400} height={400} />
        <h2 className="text-4xl font-bold text-right text-gray-600 leading-snug">
          Πώς Λειτουργεί <br/>Για <br/><span className="text-[#FB7600]">Ιδιώτες</span>
        </h2>
      </div>
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#FB7600] z-0"></div>
        
        <div className="relative z-10">
          {stepsIndividual.map((step, index) => (
            <div key={index} className="mb-20 relative">
              {/* Content container */}
              <div className={`w-full flex items-start ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Icon container - always in the middle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 bg-white p-2 rounded-full z-20">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#FB7600] bg-opacity-20 rounded-full">
                    <Image src={step.icon} alt={step.title} width={40} height={40} />
                  </div>
                </div>
                
                {/* Left or right content based on index */}
                <div className={`w-5/12 text-right pl-8`}>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-right">{step.title}</h3>
                  <p className="text-gray-600 mb-4 text-right">{step.description}</p>
                  <button className="bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all">
                    {step.buttonText}
                  </button>
                </div>
                
                {/* Empty space for the other side */}
                <div className="w-5/12"></div>
              </div>
              
              {/* Connector line to next step (except for the last one) */}
              {index < stepsIndividual.length - 2 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-14 h-16 w-1">
                  <svg className="w-full h-full" viewBox="0 0 10 40">
                    <path 
                      d={index % 2 === 0 
                        ? "M5,0 Q15,20 5,40" 
                        : "M5,0 Q-5,20 5,40"
                      } 
                      stroke="#FB7600" 
                      fill="none" 
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="-mt-10 text-center bg-[#FB7600] text-xl font-bold text-white py-2 px-2 rounded-lg w-[60%] mx-auto">
      Τώρα μένει μόνο να κανονίσεις τις λεπτομέρειες!
      </div>
    </div>
  );
};