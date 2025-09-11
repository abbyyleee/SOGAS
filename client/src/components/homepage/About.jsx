import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

function StatCard({ end, suffix, label, duration = 2 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div
      ref={ref}
      className="bg-dark-navy rounded-xl shadow-lg p-6 text-center hover:scale-105 transition-transform duration-300 border-b-4 border-reg-blue"
    >
      <p className="text-2xl font-extrabold">
        {inView ? <CountUp start={0} end={end} duration={duration} suffix={suffix} /> : `0${suffix}`}
      </p>
      <p className="text-sm font-medium mt-1">{label}</p>
    </div>
  );
}

export default function About() {
  const [aboutDescription, setAboutDescription] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/info")
      .then((res) => res.json())
      .then((data) => setAboutDescription(data.about_description || ""))
      .catch((err) => console.error("Error fetching about info:", err));
  }, []);

  return (
    <section id="about" className="relative w-full bg-white text-deep-blue overflow-hidden">
      {/* TOP DIAGONAL DIVIDER (flipped upright) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,0 C150,100 350,0 500,100 L500,0 L0,0 Z" fill="#FFDE00" />
        </svg>
      </div>

      {/* TOP CONTENT */}
      <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-6 md:px-16 py-12">
        {/* LEFT: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            About Southern Gas Services
          </h2>

          <p className="text-base leading-relaxed font-semibold">
            {aboutDescription || `SOGAS is a Louisiana interstate pipeline energy support company specializing in the
            installation of natural gas facilities to provide reliable natural gas supply services
            as well as natural gas marketing, operations & maintenance, and regulatory compliance
            services for clients with existing pipeline facilities.`}
          </p>

          <div className="space-y-4">
            <p className="border-l-4 border-reg-blue pl-4 font-medium">
              30+ years of providing natural gas solutions
            </p>
            <p className="border-l-4 border-reg-blue pl-4 font-medium">
              Over 50 pipeline facilities completed
            </p>
            <p className="border-l-4 border-reg-blue pl-4 font-medium">
              Experienced and highly qualified personnel
            </p>
          </div>
        </motion.div>

        {/* RIGHT: Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="overflow-hidden rounded-2xl shadow-xl"
        >
          <img
            src="/images/white-blue-pipe.JPG"
            alt="Industrial pipeline infrastructure"
            className="w-full h-full object-cover transition-transform ease-in-out hover:scale-105"
            style={{ transitionDuration: "1000ms" }}
          />
        </motion.div>
      </div>

      {/* STATS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-screen-xl mx-auto mt-6 mb-20 grid grid-cols-2 sm:grid-cols-4 gap-6 px-6 text-white z-10 relative"
      >
        <StatCard end={30} suffix="+" label="Years in Business" duration={2.5} />
        <StatCard end={50} suffix="+" label="Pipeline Facilities" duration={2.5} />
        <StatCard end={100} suffix="%" label="Client Satisfaction" duration={2.5} />
        <StatCard end={0} suffix="" label="Major Safety Incidents" duration={2.5} />
      </motion.div>

      {/* BOTTOM DIAGONAL DIVIDER */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,0 C150,100 350,0 500,100 L500,00 L0,0 Z" fill="#FFDE00" />
        </svg>
      </div>
    </section>
  );
}
