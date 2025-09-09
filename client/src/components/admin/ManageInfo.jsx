import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../lib/api";

export default function ManageInfo() {
    const [formData, setFormData] = useState({
        tagline: "",
        mission_title: "",
        mission_description: "",
        about_description: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        try {
            const res = await api.get("/info");
            setFormData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching site info:", err);
            setMessage("Failed to load info");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            await api.put("/info", formData);
            setMessage("Changes saved successfully!");
        } catch (err) {
            console.error("Error saving changes:", err);
            setMessage("Error saving changes.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-deep-blue text-white px-10 py-24 mx-auto">
            {/* Back to Dashboard */}
            <div className="mb-8">
                <Link 
                    to="/admin"
                    className="inline-block px-4 py-2 rounded-xl bg-rust text-dark-navy hover:bg-soft-blue transition"
                >
                    ← Back to Admin Dashboard
                </Link>
            </div>

            {/* Title */}
            <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-4xl font-bold mb-10 text-center"
            >
                Manage Site Info
            </motion.h1>

            {loading ? (
                <p>Loading Info...</p>
            ) : (
                <form 
                    onSubmit={handleSubmit}
                    className="space-y-12 bg-light-blue text-dark-navy p-10 rounded-2xl ring-1 ring-light-blue max-w-4xl mx-auto"
                >
                    {/* Hero Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
                        <textarea
                            name="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            className="w-full p-3 h-24 rounded bg-white text-dark-navy resize-none"
                            placeholder="Company Tagline"
                        />
                    </section>

                    {/* Mission Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Mission Section</h2>
                        <textarea
                            name="mission_title"
                            value={formData.mission_title}
                            onChange={handleChange}
                            className="w-full p-3 h-16 mb-4 rounded bg-white text-dark-navy resize-none"
                            placeholder="Mission Statement"
                        />
                        <textarea
                            name="mission_description"
                            value={formData.mission_description}
                            onChange={handleChange}
                            className="w-full p-3 h-28 rounded bg-white text-dark-navy resize-none"
                            placeholder="Mission Description"
                        />
                    </section>

                    {/* About Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">About Section</h2>
                        <textarea
                            name="about_description"
                            value={formData.about_description}
                            onChange={handleChange}
                            className="w-full p-3 h-28 rounded bg-white text-dark-navy resize-none"
                            placeholder="About Description"
                        />
                    </section>

                    {/* Contact Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
                        <input 
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded bg-white text-dark-navy"
                            placeholder="Phone Number"
                        />
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 h-20 rounded bg-white text-dark-navy resize-none"
                            placeholder="Business Address"
                        />
                    </section>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button 
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-rust text-dark-navy font-bold rounded hover:bg-emerald-500 transition"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                    {/* Feedback Message */}
                    {message && <p className="text-center font-semibold">{message}</p>}
                </form>
            )}
        </div>
    );
}
