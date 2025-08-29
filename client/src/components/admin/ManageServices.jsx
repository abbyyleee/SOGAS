// src/components/admin/ManageServoces.jsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ManageServices() {
    return (
        <motion.div
            className="min-h-screen bg-deep-blue text-white px-4 py-32"
            variants={fadeIn}
            initials="hidden"
            animate="show"
        >
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    to="/admin"
                    className="inline-block px-4 py-2 rounded-xl bg-rust text-dark-navy hover:bg-light-blue transition ring-1 ring-light-blue"
                >
                    ← Back to Admin Dashboard 
                </Link>    
            </div>

            {/* Place Holder for management features */}
            <div className="bg-light-blue/10 border border-light-blue/30 rounded-2xl p-8">
                <p className="text-white/70 text-lg">
                    Service management tools will go here.
                </p>
            </div>
        </motion.div>
    );
}