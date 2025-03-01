"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Section() {
  return (
    <div className="w-full h-[auto] flex flex-col align-center justify-center">
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
      heading: "Χαμένος Χρόνος & \nΑτελείωτα Τηλέφωνα",
      description:
        "Οι παραδοσιακές μέθοδοι αναζήτησης απαιτούν άπειρα τηλεφωνήματα, συστάσεις και δοκιμές, χωρίς καμία εγγύηση επιτυχίας.",
    },
    {
      heading: "Κρυφές Χρεώσεις &\n Μεσάζοντες",
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
    <div className="problem">
      <h2 className="text-center text-xl md:text-md text-[#FB7600]">
        ΠΡΟΒΛΗΜΑ
      </h2>
      <p className="mt-4 text-center text-2xl font-bold md:text-4xl text-gray-600">
        Η αναζήτηση του σωστού επαγγελματία είναι δύσκολη.
      </p>

      <div className="mt-4 flex w-[80%] h-auto  mx-auto gap-12 items-center justify-center">
        {content.map((item, index) => (
          <div key={index} className="flex-1 h-auto max-w-[350px]">
            <div className="mx-auto flex-1 p-4 text-left text-[#FB7600] max-w-[450px]">
              <p
                className="text-xl font-bold  text-[#FB7600]"
                dangerouslySetInnerHTML={{
                  __html: item.heading.replace(/\n/g, "<br>"),
                }}
              ></p>
              <p className="text-gray-600 mt-4">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Solution = () => {
  const content = [
    {
      heading: "Άμεση & \nΕύκολη Σύνδεση",
      description:
        "Με το JobList, οι ιδιώτες βρίσκουν τον κατάλληλο επαγγελματία χωρίς κόπο, ενώ οι επαγγελματίες αποκτούν πρόσβαση σε νέες ευκαιρίες εργασίας με ένα κλικ.",
    },
    {
      heading: "Χωρίς Μεσάζοντες,\n Χωρίς Κρυφές Χρεώσεις",
      description:
        "Ξεχάστε τις προμήθειες και τα περιττά κόστη. Οι ιδιώτες και οι επαγγελματίες έρχονται σε άμεση επαφή, εξασφαλίζοντας δίκαιες συμφωνίες.",
    },
    {
      heading: "Διαφάνεια &\n Αξιοπιστία",
      description:
        "Με κριτικές και επαληθευμένα προφίλ, οι πελάτες επιλέγουν σωστά, ενώ οι επαγγελματίες χτίζουν τη φήμη τους χωρίς μεσάζοντες.",
    },
  ];

  return (
    <div className="problem mt-20">
      <h2 className="text-center text-xl md:text-md text-[#FB7600]">ΛΥΣΗ</h2>
      <p className="mt-4 text-center text-2xl font-bold md:text-4xl text-gray-600">
        <span className="text-[#FB7600]">JobList</span>– Η Έξυπνη Λύση για
        Ιδιώτες & Επαγγελματίες!
      </p>

      <div className="mt-4 flex w-[80%] h-auto  mx-auto gap-12 items-center justify-center">
        {content.map((item, index) => (
          <div key={index} className="flex-1 h-auto max-w-[350px]">
            <div className="mx-auto flex-1 p-4 text-left text-[#FB7600] max-w-[450px]">
              <p
                className="text-xl font-bold  text-[#FB7600]"
                dangerouslySetInnerHTML={{
                  __html: item.heading.replace(/\n/g, "<br>"),
                }}
              ></p>
              <p className="text-gray-600 mt-4">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
    <div className="how-it-works mt-20 w-[80%] mx-auto flex flex-col items-center justify-center">
      <h2 className="text-center text-xl md:text-md text-[#FB7600]">
        ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ
      </h2>
      <p className="mt-4 text-center text-2xl font-bold md:text-4xl text-gray-600">
        Ξεκίνα σε μόνο 3 Βήματα.
      </p>

      {/* Main Flex Container */}
      <div className="mt-10 flex justify-center items-start gap-10 h-auto">
        {/* Left Section - Looking for a Professional */}
        <div className="w-[40%] text-left">
          <h3 className="text-[#FB7600] text-lg font-bold mb-4">
            ΨΑΧΝΩ ΜΑΣΤΟΡΑ
          </h3>
          {stepsCustomer.map((step, index) => (
            <div key={index} className="mb-6 max-w-md">
              <p className="font-bold text-lg text-gray-600">
                {index + 1}. {step.title}
              </p>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Vertical Line Divider */}
        <div className="border-l-2 border-[#FB7600] h-auto min-h-[350px]"></div>

        {/* Right Section - I am a Professional */}
        <div className="w-[40%] text-left">
          <h3 className="text-[#FB7600] text-lg font-bold mb-4">
            ΕΙΜΑΙ ΜΑΣΤΟΡΑΣ
          </h3>
          {stepsProfessional.map((step, index) => (
            <div key={index} className="mb-6 max-w-md">
              <p className="font-bold text-lg text-gray-600">
                {index + 1}. {step.title}
              </p>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
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
    <div className="mt-20 ">
      <h2 className="text-center text-xl md:text-md text-[#FB7600]">
        ΤΙ ΛΕΝΕ ΓΙΑ ΕΜΑΣ
      </h2>
      <p className="mt-4 text-center text-2xl font-bold md:text-4xl text-gray-600">
        Αληθινές εμπειρίες από πελάτες & <br />
        επαγγελματίες που εμπιστεύτηκαν τη{" "}
        <span className="text-[#FB7600]">JobList</span>.
      </p>

      <div className="mt-20 flex flex-wrap justify-center gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative bg-[#606C3833] p-6 w-80 rounded-2xl text-center shadow-lg"
          >
            {/* Circular Image */}
            <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-md bg-[#FB7600]"
              />
            </div>

            <div className="mt-12">
              <p className="mt-2 font-bold text-gray-800">{testimonial.name}</p>
              <p className="mt-2">{testimonial.stars}</p>
              <p className="text-gray-800 mt-2">{testimonial.review}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "Πώς επιλέγω τον κατάλληλο επαγγελματία;",
      answer:
        "Μετά τη δημοσίευση της αγγελίας σας, οι επαγγελματίες θα σας στέλνουν προτάσεις. Μπορείτε να δείτε τα προφίλ τους, τις κριτικές και τις τιμές τους και να επιλέξετε αυτόν που σας ταιριάζει καλύτερα.",
    },
    {
      question: "Πώς πληρώνω τον επαγγελματία;",
      answer:
        "Η πληρωμή γίνεται απευθείας στον επαγγελματία με δική σας συνεννόηση.",
    },
    {
      question: "Τι γίνεται αν δεν βρω επαγγελματία;",
      answer:
        "Αν δεν λάβετε προτάσεις, μπορείτε να επεξεργαστείτε την αγγελία σας ή να επικοινωνήσετε με την υποστήριξη μας για βοήθεια.",
    },
    {
        question: "Ποια είναι τα διαθέσιμα πλάνα συνδρομής;",
        answer:
          "Έχουμε διάφορα πλάνα ανάλογα με τις ανάγκες σας. Κάθε πλάνο σας προσφέρει έναν ορισμένο αριθμό tokens και πρόσθετα perks, όπως προωθημένη εμφάνιση του προφίλ σας.",
      },
    {
      question: "Τι είναι τα tokens και πώς τα χρησιμοποιώ;",
      answer:
        'Τα tokens είναι η "νομισματική" μονάδα της πλατφόρμας. Χρειάζεστε tokens για να ξεκλειδώσετε αγγελίες και να επικοινωνήσετε με πελάτες. Τα tokens αποκτάτε μέσω της επιλογής πλάνου συνδρομής.',
    },
    {
      question: "Τι γίνεται αν τελειώσουν τα tokens μου;",
      answer:
        "Μπορείτε να αγοράσετε επιπλέον tokens ή να ανανεώσετε το πλάνο συνδρομής σας ανά πάσα στιγμή.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="FAQ mt-20">
      <h2 className="text-center text-xl md:text-md text-[#FB7600]">FAQ</h2>
      <p className="mt-4 text-center text-2xl font-bold md:text-4xl text-gray-600 mb-10">
        Συχνές Ερωτήσεις
      </p>
      {faqItems.map((item, index) => (
        <div
          key={index}
          className="mb-4 flex flex-col items-center justify-center"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-[80%] text-left p-4 bg-[#606C3833] rounded-lg focus:outline-none"
          >
            <span className="font-semibold text-gray-600 text-lg">{item.question}</span>
            <span className="float-right text-[#FB7600] text-lg font-bold">
              {activeIndex === index ? "-" : "+"}
            </span>
          </button>
          {activeIndex === index && (
            <div className=" w-[80%] p-4  border-b-2 border-l-2 border-r-2 border-[#606C3833] rounded-b-lg">
              <p className="text-gray-600 text-md text-left w-[800px]">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


const CTA = () => {
  return (
    <div className="problem mt-20 bg-[#606C3833] pt-20 pb-20">
      <h2 className="text-center text-xl md:text-md text-[#FB7600]">ΕΤΟΙΜΟΣ ΝΑ ΞΕΚΙΝΗΣΕΙΣ;</h2>
      <p className="mt-4 text-center text-2xl font-bold md:text-4xl text-gray-600">
        ΞΕΚΙΝΑ ΤΩΡΑ!
      </p>
      <div className="mt-4 flex justify-center gap-12">
      <Link
          href="/customer"
          className="hidden md:block border-[#FB7600] text-[#FB7600] border-2 px-10 py-3 rounded-lg text-lg font-bold hover:bg-[#FB7600] hover:text-white transition-colors"
        >
          Ιδιώτης
        </Link>
        <Link
          href="/worker"
          className="hidden md:block bg-[#FB7600] text-white px-10 py-3 rounded-lg text-lg font-bold hover:bg-[#E56A00] transition-colors"
        >
          Μάστορας
        </Link>
      </div>
    </div>
  );
};
