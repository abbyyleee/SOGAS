// Services.jsx

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import api from "../../lib/api";

// Default services so the section is never empty
const DEFAULT_SERVICES = [
  {
    id: 1,
    title: "Natural Gas Pipeline",
    description:
      "Installation of natural gas pipelines for industrial, midstream, and utility clients.",
    status: "active",
  },
  {
    id: 2,
    title: "Natural Gas Marketing",
    description:
      "Provides natural gas energy solutions to end-users as well as producers of oil and gas.",
    status: "active",
  },
  {
    id: 3,
    title: "Natural Gas Consulting",
    description:
      "Custom natural gas solutions for infrastructure, planning, system upgrades, and supply pricing options.",
    status: "active",
  },
  {
    id: 4,
    title: "Operation / Maintenance",
    description: "Operation and maintenance options for proposals and existing natural gas facilities.",
    status: "active",
  },
  {
    id: 5,
    title: "Regulatory Compliance",
    description: "Full regulatory compliance on proposals and existing gas facilities.",
    status: "active",
  },
  {
    id: 6,
    title: "Facility Fabrication / Installation",
    description: "Fabrication and installation of natural gas facilities.",
    status: "active",
  },
];

export default function Services() {
  // Start with defaults
  const [services, setServices] = useState(DEFAULT_SERVICES);

  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.9, once: true });
  const controls = useAnimation();

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await api.get("/services");
        const data = res?.data;

        if (Array.isArray(data) && data.length > 0) {
          const activeServices = data.filter((service) => {
            const status = (service.status || "").toLowerCase();
            return status === "active";
          });

          // Only override defaults if we actually have active services
          if (activeServices.length > 0) {
            setServices(activeServices);
          }
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        // IMPORTANT: don't set services to [] here
        // We keep DEFAULT_SERVICES so the UI never goes blank
      }
    }

    fetchServices();
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.45,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section
      id="services"
      className="relative w-full py-20 bg-center"
      style={{ backgroundImage: "url('/textures/gray-carbon.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-gray/50"></div>

      <div className="max-w-screen-xl mx-auto relative z-10 text-white">
        <h2 className="text-4xl text-deep-blue md:text-5xl font-bold mb-6 text-center tracking-tight">
          Our Services
        </h2>
        <p className="text-2xl md:text-xl text-center mb-16 max-w-3xl mx-auto leading-relaxed text-deep-blue font-semibold">
          Southern Gas Services provides a full range of industrial-grade gas solutions with safety, efficiency, and precision at the forefront.
        </p>

        <div ref={ref} className="h-1 w-full"></div>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id || index}
              custom={index}
              initial="hidden"
              animate={controls}
              variants={fadeUp}
              className="bg-deep-blue text-white rounded-2xl p-6 shadow-2xl
                         hover:scale-105 hover:shadow-rust
                         transition-all duration-300 ease-out"
            >
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-md leading-relaxed text-[#EAEAEA]">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
