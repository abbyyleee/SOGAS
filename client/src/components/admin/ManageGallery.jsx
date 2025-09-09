
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../lib/api";

export default function ManageGallery() {
    const [images, setImages] = useState([]);
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [newCaption, setNewCaption] = useState("");

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await api.get("/gallery");
            setImages(res.data);

        } catch (err) {
            console.error("Error fetching gallery images:", err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            return alert("PLease select a file.");
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("caption", caption);

        try {
            const res = await api.post("/gallery/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setImages([...images, {
                ...res.data,
                caption: caption
            }]);
            setFile(null);
            setCaption("");

        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    const handleDelete = async (publicId) => {
        const confirm = window.confirm("Are you sure you want to delete this image?");
        if (!confirm) return;

        try {
            await api.delete(`/gallery/${publicId}`);
            setImages((prev) => prev.filter((imag) => imag.public_id !== publicId));

        } catch (err) {
            console.error("Error deleting image:", err);
        }
    };

    const startEditing = (img) => {
        setEditingId(img.id);
        setNewCaption(img.caption);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setNewCaption("");
    };

    const saveCaption = async (img) => {
        try {
            await api.put(`/gallery/${img.public_id}`, { caption: newCaption });

            setImages((prev) => 
                prev.map((i) => 
                    i.id === img.id ? { ...i, caption: newCaption } : i 
                )
            );

            cancelEditing();

        } catch (err) {
            console.error("Error updating caption:", err);
        }
    };


    return (
        <div className="min-h-screen bg-deep-blue text-white px-10 py-24 mx-auto">

            {/* BAck To Dashboard */}
            <div className="mb-8">
                <Link
                    to="/admin"
                    className="inline-block px-4 py-2 rounded-xl bg-rust text-dark-navy hover:bg-soft-blue hover:text-dark-navy transition"
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
                Manage Gallery 
            </motion.h1>

            {/* Upload Form */}
            <section className="mb-12 py-10">
                <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
                <form 
                    onSubmit={handleUpload}
                    className="rounded-xl bg-light-blue p-6 ring-1 ring-light-blue space-y-4"
                >
                    <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full px-3 py-2 rounded bg-white text-dark-navy"
                    />
                    <input 
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Enter caption (optional)"
                        className="w-full px-3 py-2 rounded bg-white text-dark-navy"
                    />
                    <button 
                        type="submit"
                        className="bg-rust text-dark-navy px-4 py-2 rounded hover:bg-soft-blue transition"
                    >
                        Upload 
                    </button>        
                </form>    
            </section>

            {/* Gallery Display */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((img) => (
                        <div
                            key={img.public_id}
                            className="bg-white text-dark-navy p-4 rounded-2xl shadow ring-1 ring-dark-navy"
                        >
                            <img 
                                src={img.url}
                                alt={img.caption || "Gallery Image"}
                                className="w-full h-60 object-cover rounded"
                            />
                            {editingId === img.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={newCaption}
                                        onChange={(e) => setNewCaption(e.target.value)}
                                        className="w-full mt-2 px-2 py-1 rounded bg-light-blue text-dark-navy"
                                    />
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            onClick={() => saveCaption(img)}
                                            className="text-sm px-3 py-1 bg-rust hover:bg-white text-dark-navy rounded transition"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="text-sm px-3 py-1 bg-red-500 text-dark-navy rounded transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {img.caption && (
                                        <p className="mt-2 text-sm text-dark-navy">{img.caption}</p>
                                    )}
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            onClick={() => startEditing(img)}
                                            className="text-sm px-3 py-1 bg-soft-blue hover:bg-white text-dark-navy rounded transition"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(img.public_id)}
                                            className="text-sm px-3 py-1 bg-rust hover:bg-red-500 text-dark-navy rounded transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>    
        </div>
    );
}