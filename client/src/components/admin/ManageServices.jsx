// ManageServices.jsx

import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../lib/api";


const fadeIn = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ManageServices() {
    
    const [services, setServices] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newStatus, setNewStatus] = useState("Active");
    const [editService, setEditService] = useState(null);
    
    useEffect(() => {
        api.get("/services")
        .then((res) => setServices(res.data))
        .catch((err) => console.error("Error fetching services: ", err));
    }, []);

    async function handleDelete(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (confirmDelete) {
            try {
                await api.delete(`/services/${id}`);
                setServices((prev) => prev.filter((service) => service.id !== id));
            } catch (err) {
                console.error("Error deleting service: ", err);
            }
        }
    }
      
    
    return (
        <div className="min-h-screen bg-deep-blue text-white px-10 py-24 mx-auto">
            
            {/* Back To Dashboard */}
            <div className="mb-8">
                <Link
                    to="/admin?key=SoGas97"
                    className="inline-block px-4 py-2 rounded-xl bg-rust text-dark-navy hover:bg-soft-blue hover:text-dark-navy transition ring-1 ring-light-blue"
                >
                    ← Back to Admin Dashboard 
                </Link>    
            </div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-4xl font-bold mb-10 text-center"
            >
                Manage Services 
            </motion.div>

            {/* Current Services */}
            <section>
                <h2 className="text-xl font-semibold text-white mb-4">Current Services</h2>
                
                {/* List of Services */}
                <div className="rounded-xl bg-light-blue p-6 ring-1 ring-light-blue">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <motion.div 
                                key={service.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="bg-white text-dark-navy p-6 rounded-2xl shadow ring-1 ring-dark-navy"
                            >
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold">{service.title}</h3>
                                </div>
                                <p className="mt-2 text-sm text-dark-navy">{service.description}</p>
                                <div className="mt-4 text-sm font-medium py-4">
                                    Status:{" "}
                                    <span className={`px-4 py-1 rounded-full bg-emerald-500 text-deep-blue ring-1 ring-soft-blue
                                                     ${service.status.toLowerCase() === "inactive" ? "bg-red-500" : "bg-emerald-500"}
                                    }`}>
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

            {/* Edit Services Section */}
            {editService && (
                <section className="mb-12 py-12">
                    <h2 className="text-xl font-semibold text-white mb-4">Edit Service</h2>
                        <div className="rounded-xl bg-light-blue text-dark-navy p-6 ring-1 ring-light-blue bg-opacity">
                            <h3 className="text-lg font-semibold mb-4">Editing: {editService.title}</h3>

                            <form 
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        await api.put(`/services/${editService.id}`, editService);
                                        const updatedServices = services.map((service) =>
                                            service.id === editService.id ? editService : service 
                                        );
                                        setServices(updatedServices);
                                        setEditService(null);
                                    } catch (err) {
                                        console.error("Error updating service: ", err);
                                    }
                                }}
                            >
                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input 
                                        type="text"
                                        value={editService.title}
                                        onChange={(e) => setEditService({ ...editService, title: e.target.value })}
                                        className="w-full border rounded px-3 py-2 bg-white text-dark-navy"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea 
                                        value={editService.description}
                                        onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                                        className="w-full border rounded px-3 py-2 bg-white text-dark-navy"
                                    />    
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Status (Active / Inactive)</label>
                                    <select
                                        value={editService.status}
                                        onChange={(e) => 
                                            setEditService({...editService, status: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 bg-white text-dark-navy"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>    
                                    </select>    
                                </div>

                                <div className="flex space-x-3">
                                    <button 
                                        type="submit"
                                        className="bg-rust text-dark-navy px-4 py-2 rounded hover:text-dark-navy hover:bg-emerald-500"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setEditService(null)}
                                        className="bg-rust text-dark-navy px-4 py-2 rounded hover:bg-red-500 hover:text-dark-navy"
                                    >
                                        Cancel 
                                    </button>    
                                </div>
                            </form>
                        </div>
                </section>            
            )}  

            {/* Add New Service */}
            <section className="mb-12 py-10">
                <h2 className="text-xl font-semibold text-white mb-4">Add New Services</h2>
                
                {/* Service Form */}
                <div className="rounded-xl bg-light-blue p-6 ring-1 ring-light-blue">
                    
                    {/* Add New Service Form */}
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const newService = { title: newTitle, description: newDescription, status: newStatus };
                                const res = await api.post("/services", newService);
                                setServices([...services, { id: res.data.id, ...newService }]);
                                setNewTitle("");
                                setNewDescription("");
                                setNewStatus("Active");
                            } catch (err) {
                                console.error("Error adding service: ", err);
                            }
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block mb-1 text-dark-navy">Title</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-white text-dark-navy"
                                required
                            />    
                        </div>

                        <div>
                            <label className="block mb-1 text-dark-navy">Description</label>
                            <textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-white text-dark-navy"
                                required
                            />    
                        </div>

                        <div>
                            <label className="block mb-1 text-dark-navy">Status (Active / Inactive)</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-white text-dark-navy"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>    
                        </div>

                        <button
                            type="submit"
                            className="bg-rust text-dark-navy px-4 py-2 rounded hover:bg-soft-blue hover:text-dark-navy transition"
                        >
                            Add Service 
                        </button>    
                    </form>
                </div>
            </section>
        </div>
    );
}
