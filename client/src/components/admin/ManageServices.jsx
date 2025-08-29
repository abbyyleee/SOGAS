// src/components/admin/ManageServoces.jsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ManageServices() {
    return (
        <div className="min-h-screen bg-deep-blue text-white px-10 py-24 mx-auto">
            
            {/* Back To Dashboard */}
            <div className="mb-8">
                <Link
                    to="/admin"
                    className="inline-block px-4 py-2 rounded-xl bg-rust text-dark-navy hover:bg-soft-blue hover:text-dark-navy transition ring-1 ring-light-blue"
                >
                    ← Back to Admin Dashboard 
                </Link>    
            </div>

            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y:0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-bold mb-10"
            >
                Manage Services 
            </motion.div>

            {/* Add New Service */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-white mb-4">Add New Services</h2>
                
                {/* Service Form */}
                <div className="rounded-xl bg-soft-blue/10 p-6 ring-1 ring-light-blue">
                    <p className="text-white">Form Here</p>
                </div>
            </section>

            {/* Current Services */}
            <section>
                <h2 className="text-xl font-semibold text-white mb-4">Current Services</h2>
                
                {/* List of Services */}
                <div className="rounded-xl bg-soft-blue/10 p-6 ring-1 ring-light-blue">
                    <p className="text-white">List will go here.</p>
                </div>
            </section>    
        </div>
    );
}