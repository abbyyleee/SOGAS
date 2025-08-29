// src/components/admin/ManageServices.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
};

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${API_BASE}/services`);
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    }
    fetchServices();
  }, []);

  function openModal() {
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Submit to backend
    console.log("Submitted:", formData);
    closeModal();
  }

  return (
    <div className="min-h-screen bg-deep-blue text-white px-4 py-12">
      <motion.div variants={fadeIn} initial="hidden" animate="show">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold">Manage Services</h1>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-soft-blue text-dark-navy rounded-xl ring-1 ring-light-blue hover:bg-light-blue transition"
            >
              + Add Service
            </button>
          </div>

          {/* Services List */}
          <div className="grid gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                className="p-6 bg-light-blue text-dark-navy rounded-xl shadow ring-1 ring-dark-navy/10"
              >
                <h2 className="text-xl font-semibold">{service.name}</h2>
                <p className="mt-1 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-dark-navy rounded-2xl p-8 w-full max-w-md shadow-lg ring-1 ring-light-blue"
            >
              <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg ring-1 ring-light-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg ring-1 ring-light-blue focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl bg-deep-blue text-white hover:bg-soft-blue ring-1 ring-light-blue"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-soft-blue text-dark-navy hover:bg-light-blue ring-1 ring-light-blue"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
