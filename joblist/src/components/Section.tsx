"use client";

import Link from "next/link";
import { useState } from "react";

export function Section() {
  return (
    <div className="w-full flex flex-col align-center justify-center">
      <Problem />
      <Solution />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}

const Problem = () => {
  const content = [
    {
      heading: "Χαμένος Χρόνος & Τηλέφωνα",
      description:
        "Οι παραδοσιακές μέθοδοι αναζήτησης απαιτούν άπειρα τηλεφωνήματα, συστάσεις και δοκιμές, χωρίς καμία εγγύηση επιτυχίας.",
    },
    {
      heading: "Κρυφές Χρεώσεις & Μεσάζοντες",
      description:
        "Πλατφόρμες που υπόσχονται βοήθεια συχνά κρύβουν προμήθειες και επιπλέον κόστη, μειώνοντας την αξία της υπηρεσίας που λαμβάνεις.",
    },
    {
      heading: "Έλλειψη Διαφάνειας & Αξιοπιστίας",
      description:
        "Χωρίς κριτικές, σαφείς τιμές και εγγυήσεις, η επιλογή επαγγελματία γίνεται ρίσκο, αφήνοντας τους πελάτες σε αβεβαιότητα.",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-lg sm:text-xl text-[#FB7600]">
          ΠΡΟΒΛΗΜΑ
        </h2>
        <p className="mt-3 text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-600">
          Η αναζήτηση του σωστού επαγγελματία είναι δύσκολη.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#FB7600] mb-3">
                {item.heading}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Solution = () => {
  const content = [
    {
      heading: "Άμεση & Εύκολη Σύνδεση",
      description:
        "Με το JobList, οι ιδιώτες βρίσκουν τον κατάλληλο επαγγελματία χωρίς κόπο, ενώ οι επαγγελματίες αποκτούν πρόσβαση σε νέες ευκαιρίες εργασίας με ένα κλικ.",
    },
    {
      heading: "Χωρίς Μεσάζοντες, Χωρίς Κρυφές Χρεώσεις",
      description:
        "Ξεχάστε τις προμήθειες και τα περιττά κόστη. Οι ιδιώτες και οι επαγγελματίες έρχονται σε άμεση επαφή, εξασφαλίζοντας δίκαιες συμφωνίες.",
    },
    {
      heading: "Διαφάνεια & Αξιοπιστία",
      description:
        "Με κριτικές και επαληθευμένα προφίλ, οι πελάτες επιλέγουν σωστά, ενώ οι επαγγελματίες χτίζουν τη φήμη τους χωρίς μεσάζοντες.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-lg sm:text-xl text-[#FB7600]">ΛΥΣΗ</h2>
        <p className="mt-3 text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-600">
          <span className="text-[#FB7600]">JobList</span> – Η Έξυπνη Λύση για
          Ιδιώτες & Επαγγελματίες!
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#FB7600] mb-3">
                {item.heading}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const stepsCustomer = [
    {
      title: "Διάλεξε κατηγορία εργασίας",
      description:
        "Βρες την κατηγορία που ταιριάζει στην εργασία που θέλεις να αναθέσεις.",
    },
    {
      title: "Δημοσίευσε την αγγελία σου",
      description:
        "Περιέγραψε τι χρειάζεσαι και δώσε τις βασικές λεπτομέρειες για την εργασία σου.",
    },
    {
      title: "Επίλεξε τον κατάλληλο μάστορα",
      description:
        "Δες προσφορές από επαγγελματίες, σύγκρινε αξιολογήσεις και επίλεξε τον καλύτερο για εσένα.",
    },
  ];
  const stepsProfessional = [
    {
      title: "Δημιούργησε τον λογαριασμό σου",
      description: "Εγγράψου στην πλατφόρμα και συμπλήρωσε τα στοιχεία σου.",
    },
    {
      title: "Αγόρασε tokens μέσω συνδρομής",
      description:
        "Απόκτησε tokens για να ξεκλειδώσεις αγγελίες και να επικοινωνήσεις με πελάτες.",
    },
    {
      title: "Ξεκλείδωσε αγγελίες και βρες πελάτες",
      description:
        "Δες αγγελίες που σε ενδιαφέρουν και έλα σε επαφή με ιδιώτες που χρειάζονται τις υπηρεσίες σου.",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-lg sm:text-xl text-[#FB7600]">
          ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ
        </h2>
        <p className="mt-3 text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-600">
          Ξεκίνα σε μόνο 3 Βήματα.
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section - Looking for a Professional */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-[#FB7600] text-lg font-bold mb-6 text-center sm:text-left">
              ΨΑΧΝΩ ΜΑΣΤΟΡΑ
            </h3>
            <div className="space-y-6">
              {stepsCustomer.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#FB7600] bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-[#FB7600] font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{step.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link 
                href="/customer" 
                className="bg-[#FB7600] text-white px-6 py-2 rounded-lg inline-block font-medium hover:bg-[#E56A00] transition-colors"
              >
                Ξεκίνα ως Πελάτης
              </Link>
            </div>
          </div>

          {/* Right Section - I am a Professional */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-[#FB7600] text-lg font-bold mb-6 text-center sm:text-left">
              ΕΙΜΑΙ ΜΑΣΤΟΡΑΣ
            </h3>
            <div className="space-y-6">
              {stepsProfessional.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#FB7600] bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-[#FB7600] font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{step.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link 
                href="/worker" 
                className="bg-[#FB7600] text-white px-6 py-2 rounded-lg inline-block font-medium hover:bg-[#E56A00] transition-colors"
              >
                Ξεκίνα ως Μάστορας
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Κωνσταντίνος Κ.",
      stars: "⭐⭐⭐⭐",
      review:
        "Εξαιρετική εμπειρία! Η JobList με βοήθησε να βρω τον κατάλληλο επαγγελματία γρήγορα.",
      image: "/images/user1.jpg", // Replace with actual image path
    },
    {
      name: "Μαρία Π.",
      stars: "⭐⭐⭐⭐⭐",
      review: "Πολύ εύκολη πλατφόρμα και αξιόπιστοι επαγγελματίες!",
      image: "/images/user2.jpg",
    },
    {
      name: "Γιώργος Δ.",
      stars: "⭐⭐⭐",
      review: "Άψογη εξυπηρέτηση, θα την πρότεινα ανεπιφύλακτα!",
      image: "/images/user3.jpg",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-lg sm:text-xl text-[#FB7600]">
          ΤΙ ΛΕΝΕ ΓΙΑ ΕΜΑΣ
        </h2>
        <p className="mt-3 text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-600">
          Αληθινές εμπειρίες από πελάτες &<br className="hidden sm:block" />
          επαγγελματίες που εμπιστεύτηκαν τη{" "}
          <span className="text-[#FB7600]">JobList</span>.
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#FB7600] rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {testimonial.name.charAt(0)}
                </div>
              </div>
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
              <p className="mt-1">{testimonial.stars}</p>
              <p className="text-gray-600 mt-3 text-sm">{testimonial.review}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Πώς χρεώνεται η υπηρεσία;",
    answer:
      "Η εγγραφή και η αναζήτηση επαγγελματιών είναι δωρεάν για τους ιδιώτες. Οι επαγγελματίες εγγράφονται σε ένα από τα συνδρομητικά πακέτα και αποκτούν tokens για να ξεκλειδώνουν αγγελίες.",
  },
  {
    question: "Πώς επιλέγετε τους επαγγελματίες;",
    answer:
      "Όλοι οι επαγγελματίες περνούν από έλεγχο ταυτότητας και επαγγελματικών πιστοποιήσεων. Οι αξιολογήσεις των πελατών βοηθούν στη διατήρηση της ποιότητας των υπηρεσιών.",
  },
  {
    question: "Τι γίνεται αν δεν είμαι ικανοποιημένος/η με την υπηρεσία;",
    answer:
      "Προσφέρουμε διαδικασία επίλυσης διαφορών και υποστήριξη πελατών για να διασφαλίσουμε την ικανοποίησή σας. Μπορείτε πάντα να επικοινωνήσετε με το τμήμα εξυπηρέτησης για οποιοδήποτε ζήτημα.",
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-lg sm:text-xl text-[#FB7600]">
          ΣΥΧΝΕΣ ΕΡΩΤΗΣΕΙΣ
        </h2>
        <p className="mt-3 text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 mb-8">
          Ό,τι θέλεις να μάθεις για τη <span className="text-[#FB7600]">JobList</span>
        </p>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left font-medium flex justify-between items-center bg-white"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-gray-700">{item.question}</span>
                <span className="text-[#FB7600]">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </button>
              {activeIndex === index && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-16 px-4 bg-[#FB7600] bg-opacity-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Έτοιμοι να ξεκινήσετε;
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Εγγραφείτε σήμερα και ανακαλύψτε έναν καλύτερο τρόπο να συνδέετε ιδιώτες με επαγγελματίες.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/customer"
            className="bg-[#FB7600] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#E56A00] transition-colors"
          >
            Βρες Επαγγελματία
          </Link>
          <Link
            href="/worker"
            className="bg-white text-[#FB7600] border border-[#FB7600] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Γίνε Μέλος ως Επαγγελματίας
          </Link>
        </div>
      </div>
    </section>
  );
};
