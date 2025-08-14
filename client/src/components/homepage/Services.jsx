import { motion } from "framer-motion";

export default function Services() {
    const services = [
        {
            title: "Natural Gas Pipeline",
            description: "Installation of natural gas pipelines for industrial, midstream, and utility clients.",
        },
        {
            title: "Natural Gas Marketing",
            description: "Provides natural gas _____ solutions to end-users and oil & gas producers. ",
        },
        {
            title: "Natural Gas Consulting",
            description: "Custom tailored natural gas solutions for infrastructure, planning, systems upgrades, and supply pricing options."
                           
        },
        {
            title: "Operation/Maintenance Services",
            description: "Operation and maintenance options for proposes and exisiting natural gas facilities.",
        },
        {
            title: "Regulatory Compliance",
            description: "Full regulatory compliance on proposes and exisiting natural gas facilities.",
        },
        {
            title: "Facilites Fabricated/Installation",
            description: "Fabrication and installation of natural gas facilities.",
        },
    ];

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.6,
                ease: "easeOut"
            }
        })
    };

    return (
        <section
            id="services"        
            className="relative w-full py-20 bg-center"
            style={{ backgroundImage: "url('/textures/gray-carbon.png')" }}
        >
            {/* Gray Overlay */}
            <div className="absolute inset-0 z-0 bg-gray/50"></div>

            <div className="max-w-screen-xl mx-auto relative z-10 text-white">
                <h2 className="text-4xl text-deep-blue md:text-5xl font-bold mb-6 text-center tracking-tight">
                    Our Services
                </h2>
                <p className="text-2xl md:text-xl text-center mb-16 max-w-3xl mx-auto leading-relaxed text-deep-blue font-semibold">
                    Southern Gas Services provides a full range of industrial-grade gas solutions with safety, efficiency, and precision at the forefront.
                </p>

                <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeUp}
                            className="bg-deep-blue text-white rounded-2xl p-6 shadow-2xl
                                       hover:scale-105 hover:shadow-rust
                                       transition-all duration-300 ease-out"
                        >
                            <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                            <p className="text-md leading-relaxed text-[#EAEAEA]">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
