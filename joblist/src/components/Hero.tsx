"use client";
import React, { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

// Export TextParallaxContentExample as default
export default function TextParallaxContentExample() {
  return (
    <div className="bg-white">
      <TextParallaxContent
        imgUrl="/bg1.png"
        subheading="Νέα εποχή εύρεσης επαγγελματιών"
        heading="JOBLIST"
      >
        <ExampleContent id={0} />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="/bg2.png"
        subheading=""
        heading="Είσαι Μάστορας;"
      >
        <ExampleContent id={1} />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="/bg3.png"
        subheading=""
        heading="Ψάχνεις Μάστορα;"
      >
        <ExampleContent id={2} />
      </TextParallaxContent>
    </div>
  );
}

const IMG_PADDING = 12;

interface TextParallaxContentProps {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: ReactNode;
}

// Export TextParallaxContent if needed elsewhere
export const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children,
}: TextParallaxContentProps) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

interface StickyImageProps {
  imgUrl: string;
}

// Export StickyImage if needed elsewhere
export const StickyImage = ({ imgUrl }: StickyImageProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

interface OverlayCopyProps {
  subheading: string;
  heading: string;
}

// Export OverlayCopy if needed elsewhere
export const OverlayCopy = ({ subheading, heading }: OverlayCopyProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="text-center text-4xl font-bold md:text-7xl text-[#FB7600]">
        {heading}
      </p>
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl text-[#FB7600]">
        {subheading}
      </p>
    </motion.div>
  );
};

interface ExampleContentProps {
  id: number;
}
export const ExampleContent = ({ id }: ExampleContentProps) => {
  const content = [
    {
      heading: "Δίκαιο & Απλό Μοντέλο",
      description:
        "Συνδέουμε Ιδιώτες με Εξειδικευμένους Επαγγελματίες Χωρίς Κρυφές Προμήθειες.\nΒρίσκεις τον κατάλληλο επαγγελματία <strong>Εύκολα, Γρήγορα και Δίκαια</strong> και\n<strong>ΧΩΡΙΣ ΜΕΣΑΖΟΝΤΕΣ</strong>.",
      button: "Μάθε περισσότερα",
    },
    {
      heading: "Ανακάλυψε Πελάτες & Ανάπτυξε τη Δουλειά σου",
      description:
        "✔ Δημιούργησε λογαριασμό & απόκτησε <strong>Άμεση πρόσβαση σε αγγελίες</strong>.\n✔ Αγόρασε <strong>tokens</strong> & ξεκλείδωσε τις <strong>Καλύτερες ευκαιρίες</strong>.\n✔ Χτίσε σχέσεις εμπιστοσύνης – <strong>ΧΩΡΙΣ ΠΡΟΜΗΘΕΙΕΣ</strong>!",
      button: "Γίνε Μέλος",
    },
    {
      heading: "Η Εργασία που Χρειάζεσε, σε 1 Μόνο Βήμα",
      description:
        "✔ Ανάρτησε <strong>Δωρεάν</strong> την αγγελία σου & λάβε <strong>Προτάσεις από επαγγελματίες</strong>.\n✔ Επίλεξε τον Ιδανικό για τις Ανάγκες σου.\n✔ Επικοινώνησε άμεσα – <strong>ΧΩΡΙΣ ΜΕΣΑΖΟΝΤΕΣ, ΧΩΡΙΣ ΚΡΥΦΕΣ ΧΡΕΩΣΕΙΣ</strong>!",
      button: "Ανέβασε την αγγελία σου",
    },
  ];

  const currentContent = content[id];

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
      <h2 className="col-span-1 text-3xl font-bold md:col-span-4 text-gray-600">
        {currentContent.heading}
      </h2>
      <div className="col-span-1 md:col-span-8">
        <p
          className="mb-4 text-xl text-neutral-600 md:text-2xl whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: currentContent.description.replace(/\n/g, "<br>"),
          }}
        />
        <button className="w-full rounded-xl bg-[#FB7600] px-6 py-4 text-xl text-white transition-colors hover:bg-[#FB7600] md:w-fit">
          {currentContent.button} <FiArrowUpRight className="inline" />
        </button>
      </div>
    </div>
  );
};

export function Section ()  {
  return (
    <div className="mt-[300px] w-full h-[100vh] flex flex-col align-center justify-center">
        <Problem />
        <Solution />
        <HowItWorks />
        <div className="testimonials">
          <h2>Πελατών</h2>
        </div>
        <div className="faq">
          <h2>Συχνές ερωτήσεις</h2>
        </div>
        <div className="cta">
          <h2>Γίνε Μέλος</h2>
        </div>
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
        <div className="mt-10 flex justify-center items-start gap-10">
          {/* Left Section - Looking for a Professional */}
          <div className="w-[40%] text-left">
            <h3 className="text-[#FB7600] text-lg font-bold mb-4">
              ΨΑΧΝΩ ΜΑΣΤΟΡΑ
            </h3>
            {stepsCustomer.map((step, index) => (
              <div key={index} className="mb-6 max-w-md">
                <p className="font-bold text-lg">
                  {index + 1}. {step.title}
                </p>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Vertical Line Divider */}
          <div className="h-full w-[4px] bg-[#FB7600]"></div>

          {/* Right Section - I am a Professional */}
          <div className="w-[40%] text-left">
            <h3 className="text-[#FB7600] text-lg font-bold mb-4">
              ΕΙΜΑΙ ΜΑΣΤΟΡΑΣ
            </h3>
            {stepsProfessional.map((step, index) => (
              <div key={index} className="mb-6 max-w-md">
                <p className="font-bold text-lg">
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
