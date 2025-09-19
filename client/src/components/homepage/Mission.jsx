// Mission.jsx

import { useRef, useEffect, useState } from "react";
import { useInView, useAnimation, motion } from "framer-motion";

export default function Mission() {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.9, once: true });

  const titleControls = useAnimation();
  const textControls = useAnimation();
  const buttonControls = useAnimation();
  const imageControls = useAnimation();
  const accentControls = useAnimation();

  const [missionTitle, setMissionTitle] = useState("");
  const [missionDescription, setMissionDescription] = useState("");

  useEffect(() => {
    fetch("http://sogas-backend.onrender.com/api/info")
      .then((res) => res.json())
      .then((data) => {
        setMissionTitle(data.mission_title || "");
        setMissionDescription(data.mission_description || "");
      })
      .catch((err) => console.error("Error fetching mission info:", err));
  }, []);

  useEffect(() => {
    if (inView) {
      titleControls.start("visible");
      textControls.start("visible");
      buttonControls.start("visible");
      imageControls.start("visible");
      accentControls.start("visible");
    }
  }, [inView, titleControls, textControls, buttonControls, imageControls, accentControls]);

  return (
    <>
      {/* TOP DIVIDER */}
      <div className="w-full overflow-hidden leading-none bg-white" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block w-full text-rust"
        >
          <polygon points="0,0 1440,80 1440,0" fill="currentColor" />
        </svg>
      </div>

      <section
        id="mission"
        className="w-full bg-white text-dark-navy py-20 px-6 md:px-16 overflow-hidden"
      >
        <div ref={ref} className="h-1 w-full"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left relative">
            <motion.div
              initial="hidden"
              animate={accentControls}
              variants={{
                hidden: { width: 0, opacity: 0 },
                visible: { width: "60px", opacity: 1, transition: { duration: 0.8 } },
              }}
              className="h-[4px] bg-rust mb-4 rounded-full"
            />

            <motion.p
              initial="hidden"
              animate={titleControls}
              variants={{
                hidden: { opacity: 0, y: -30 },
                visible: { opacity: 1, y: 0, transition: { duration: 1 } },
              }}
              className="text-sm font-semibold text-deep-blue uppercase mb-2"
            >
              Trusted by Energy Leaders
            </motion.p>

            <motion.h2
              initial="hidden"
              animate={titleControls}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2 } },
              }}
              className="text-3xl md:text-4xl font-bold text-dark-navy mb-4"
            >
              {missionTitle || "Our mission is to deliver safe and reliable natural gas solutions with integrity and expertise."}
            </motion.h2>

            <motion.p
              initial="hidden"
              animate={textControls}
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.4 } },
              }}
              className="text-dark-navy font-semibold mb-6 max-w-xl"
            >
              {missionDescription || `Southern Gas Services has proudly served the energy sector for over 30 years delivering tailored
              natural gas solutions with dedication and precision. 
              SOGAS supports small and mid-sized industrial clients as well as midstream and municipal services
              across the Gulf Coast with dependable, high-quality supply, and support services.`}
            </motion.p>

            <motion.button
              initial="hidden"
              animate={buttonControls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.6 } },
              }}
              className="bg-rust text-dark-navy hover:text-dark-navy font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 hover:scale-105"
            >
              Contact Us
            </motion.button>

            <motion.div
              initial="hidden"
              animate={textControls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.8 } },
              }}
              className="mt-8"
            >
              <p className="font-signature font-bold text-6xl text-dark-navy antialiased">
                Steve Lee
              </p>
              <p className="text-md text-deep-blue">Founder & CEO</p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            animate={imageControls}
            variants={{
              hidden: { opacity: 0, scale: 0.9, rotate: -2 },
              visible: {
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: { duration: 1.2, delay: 0.3 },
              },
            }}
            className="flex-1"
          >
            <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-lg">
              <img
                src="/images/workers-dark.JPG"
                alt="Oil and Gas Operator"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* BOTTOM DIVIDER */}
      <div className="w-full overflow-hidden leading-none bg-white" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block w-full text-rust"
        >
          <polygon points="0,80 0,0 1440,80" fill="currentColor" />
        </svg>
      </div>
    </>
  );
}
