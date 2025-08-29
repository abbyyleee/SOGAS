// src/components/admin/ManageServices.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ManageServices() {
    const [services, setServices] = useState([
        {
            id: 1,
            title: "Pipeline Installation",
            description: "Expert setup and underground natural gas installation servoces.",
            status: "Active"
        },
        {
            id: 2,
            title: "Emergency Repair",
            description: "24/7 emergency response for pipeline leaks.",
            status: "Active"
        },
    ]);

    const [editService, setEditService] = useState(null);

    function handleDelete(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (confirmDelete) {
            setServices((prev) => prev.filter((service) => service.id !== id));
        }
    }

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
                animate={{ opacity: 1, y: 0 }}
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
                    {editService && (
                        <div className="mt-6 bg-white text-dark-navy p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Editing: {editService.title}</h3>

                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const updatedServices = services.map((service) =>
                                        service.id === editService.id ? editService : service
                                    );
                                    setServices(updatedServices);
                                    setEditService(null);
                                }}
                            >
                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input 
                                        type="text"
                                        value={editService.title}
                                        onChange={(e) => setEditService({ ...editService, title: e.target.value })}
                                        className="w-full border rounded px-3 py-2 bg-light-blue"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea 
                                        value={editService.description}
                                        onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                                        className="w-full border rounded px-3 py-2 bg-light-blue"
                                    />    
                                </div>

                                <div className="flex space-x-3">
                                    <button 
                                        type="submit"
                                        className="bg-deep-blue text-white px-4 py-2 rounded hover:text-dark-navy hover:bg-emerald-500"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setEditService(null)}
                                        className="bg-deep-blue text-white px-4 py-2 rounded hover:bg-red-500 hover:text-dark-navy"
                                    >
                                        Cancel 
                                    </button>    
                                </div>
                            </form>
                        </div>    
                    )}
                </div>
            </section>

            {/* Current Services */}
            <section>
                <h2 className="text-xl font-semibold text-white mb-4">Current Services</h2>
                
                {/* List of Services */}
                <div className="rounded-xl bg-soft-blue/10 p-6 ring-1 ring-light-blue">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <motion.div 
                                key={service.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="bg-light-blue text-dark-navy p-6 rounded-2xl shadow ring-1 ring-dark-navy"
                            >
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold">{service.title}</h3>
                                </div>
                                <p className="mt-2 text-sm text-dark-navy">{service.description}</p>
                                <div className="mt-4 text-sm font-medium">
                                    Status:{" "}
                                    <span className="px-4 py-1 rounded-full bg-emerald-500 text-deep-blue ring-1 ring-soft-blue">
                                        {service.status}
                                    </span>
                                </div>

                                {/* Edit and Delete Services */}
                                <div className="mt-4 flex gap-2">
                                    <button 
                                        onClick={() => setEditService(service)}
                                        className="px-3 py-1 bg-rust text-dark-navy rounded-lg text-sm hover:bg-light-blue hover:text-dark-navy transition"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(service.id)}
                                        className="px-3 py-1 bg-rust text-dark-navy rounded-lg text-sm hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>    
        </div>
    );
}
