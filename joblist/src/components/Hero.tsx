"use client";
import React, { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";

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

const IMG_PADDING = { 
  desktop: 12,
  mobile: 8
};

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
      className="px-2 sm:px-4 md:px-6"
      style={{
        paddingLeft: `max(${IMG_PADDING.mobile}px, 2vw)`,
        paddingRight: `max(${IMG_PADDING.mobile}px, 2vw)`,
      }}
    >
      <div className="relative h-[120vh] sm:h-[150vh]">
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
        height: `calc(100vh - ${IMG_PADDING.mobile * 2}px)`,
        top: IMG_PADDING.mobile,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-xl sm:rounded-3xl"
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

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white px-4"
    >
      <p className="text-center text-3xl sm:text-4xl md:text-6xl font-bold text-[#FB7600]">
        {heading}
      </p>
      {subheading && (
        <p className="mb-2 text-center text-base sm:text-xl md:text-2xl text-[#FB7600] mt-2">
          {subheading}
        </p>
      )}
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
      link: "/how-it-works"
    },
    {
      heading: "Ανακάλυψε Πελάτες & Ανάπτυξε τη Δουλειά σου",
      description:
        "✔ Δημιούργησε λογαριασμό & απόκτησε <strong>Άμεση πρόσβαση σε αγγελίες</strong>.\n✔ Αγόρασε <strong>tokens</strong> & ξεκλείδωσε τις <strong>Καλύτερες ευκαιρίες</strong>.\n✔ Χτίσε σχέσεις εμπιστοσύνης – <strong>ΧΩΡΙΣ ΠΡΟΜΗΘΕΙΕΣ</strong>!",
      button: "Γίνε Μέλος",
      link: "/worker"
    },
    {
      heading: "Η Εργασία που Χρειάζεσε, σε 1 Μόνο Βήμα",
      description:
        "✔ Ανάρτησε <strong>Δωρεάν</strong> την αγγελία σου & λάβε <strong>Προτάσεις από επαγγελματίες</strong>.\n✔ Επίλεξε τον Ιδανικό για τις Ανάγκες σου.\n✔ Επικοινώνησε άμεσα – <strong>ΧΩΡΙΣ ΜΕΣΑΖΟΝΤΕΣ, ΧΩΡΙΣ ΚΡΥΦΕΣ ΧΡΕΩΣΕΙΣ</strong>!",
      button: "Ανέβασε την αγγελία σου",
      link: "/customer"
    },
  ];

  const currentContent = content[id];

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:gap-8 px-4 pb-12 sm:pb-24 pt-8 sm:pt-12 md:grid-cols-12">
      <h2 className="col-span-1 text-xl sm:text-2xl font-bold md:col-span-4 text-gray-600">
        {currentContent.heading}
      </h2>
      <div className="col-span-1 md:col-span-8">
        <p
          className="mb-4 text-base sm:text-lg md:text-xl text-neutral-600 whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: currentContent.description.replace(/\n/g, "<br>"),
          }}
        />
        <Link 
          href={currentContent.link} 
          className="block sm:inline-block text-center rounded-lg bg-[#FB7600] px-5 py-3 text-white transition-colors hover:bg-[#E56A00]"
        >
          {currentContent.button} <FiArrowUpRight className="inline" />
        </Link>
      </div>
    </div>
  );
};
