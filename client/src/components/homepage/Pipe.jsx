// Pipe.jsx

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const card = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 20 },
  },
};

export default function Pipe({
  images = ["/images/kinder.jpg", "/images/train.JPG", "/images/slide.JPG"],
  id = "pipe",
  heading = "Projects",
  subheading = "Installations and Field Work",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <section
      id={id}
      className="relative w-full bg-deep-blue text-white py-20 px-6 md:px-16 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
        <div className="absolute -top-24 -left-32 h-72 w-72 rounded-full bg-light-blue/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-32 h-72 w-72 rounded-full bg-reg-blue/10 blur-3xl" />
      </div>

      <div className="relative max-w-screen-xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
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
          {images.slice(0, 3).map((src, idx) => (
            <motion.figure
              key={idx}
              variants={card}
              className="group relative rounded-2xl overflow-hidden bg-dark-navy/60 border border-light-blue/20 shadow-xl"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{
                y: -6,
                rotateX: 2,
                rotateY: -2,
                transition: { type: "spring", stiffness: 160, damping: 18 },
              }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={src}
                  alt={`Gallery ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-[700ms] group-hover:scale-105"
                  loading="lazy"
                />
                
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute -inset-x-10 -top-1/2 h-[200%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>

              {/* Footer strip */}
              <div className="flex items-center justify-between px-4 py-3 bg-dark-navy/60 backdrop-blur-sm border-t border-light-blue/10">
                <span className="text-sm text-light-blue/90">SOGAS</span>
              </div>

              {/* Glow ring */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-light-blue/20 group-hover:ring-reg-blue/30 transition-all duration-300" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_40px_0_rgba(100,151,177,0.15)] group-hover:shadow-[0_0_60px_0_rgba(0,91,150,0.25)] transition-shadow duration-300" />
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
