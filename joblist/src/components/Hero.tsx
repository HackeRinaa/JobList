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
