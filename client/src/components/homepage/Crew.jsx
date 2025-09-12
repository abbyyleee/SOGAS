// Crew.jsx

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.15 },
  },
};

const card = (index) => ({
  hidden: { opacity: 0, x: index % 2 === 0 ? -28 : 28, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 18,
      mass: 0.6,
    },
  },
});

export default function Crew({
  images = [
    "/images/train-guy.JPG",
    "/images/group.JPG",
    "/images/umbrella.jpg",
  ],
  id = "crew",
  heading = "Our Crew in Action",
  subheading = "Dedicated teams delivering excellence",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, once: true });

  return (
    <section
      id={id}
      className="relative w-full bg-deep-blue text-white py-20 px-6 md:px-16 overflow-hidden"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(179,205,224,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,91,150,0.10),transparent_60%)]" />
      </div>

      <div className="relative max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {heading}
          </h2>
          <p className="text-white font-semibold mt-1">{subheading}</p>
        </motion.div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {images.map((src, idx) => (
            <motion.figure
              key={idx}
              variants={card(idx)}
              className="group relative rounded-2xl overflow-hidden bg-dark-navy/60 border border-light-blue/20 shadow-xl"
              whileHover={{
                y: -8,
                rotateX: -1.5,
                rotateY: 2,
                transition: { type: "spring", stiffness: 180, damping: 16 },
              }}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={src}
                  alt={`Crew ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-[1300ms] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-gradient-to-bl from-reg-blue/30 to-transparent" />
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-dark-navy/60 backdrop-blur-sm border-t border-light-blue/10">
                <span className="text-sm text-light-blue/90">SOGAS</span>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-light-blue/20 group-hover:ring-reg-blue/30 transition-all duration-300" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_40px_0_rgba(100,151,177,0.15)] group-hover:shadow-[0_0_60px_0_rgba(0,91,150,0.25)] transition-shadow duration-300" />
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
