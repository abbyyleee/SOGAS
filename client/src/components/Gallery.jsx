// src/components/Gallery.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Animation presets (consistent, subtle, premium)
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState({ type: "loading", message: "Loading..." });

  useEffect(() => {
    let mounted = true;

    const fetchJSON = async (url) => {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    };

    (async () => {
      setStatus({ type: "loading", message: "Loading..." });

      // 1) Future: dynamic API
      try {
        const api = await fetchJSON("/api/gallery");
        if (!mounted) return;
        setImages(Array.isArray(api?.images) ? api.images : []);
        setStatus({ type: "idle", message: "" });
        return;
      } catch (_) {
        // ignore and fall back
      }

      // 2) Today: static JSON in /public/images/gallery.json
      try {
        const local = await fetchJSON("/images/gallery.json");
        if (!mounted) return;
        setImages(Array.isArray(local?.images) ? local.images : []);
        setStatus({ type: "idle", message: "" });
      } catch (err) {
        if (!mounted) return;
        setStatus({
          type: "error",
          message: "Could not load gallery. Check /api/gallery or /public/images/gallery.json.",
        });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="gallery" className="w-full bg-light-blue text-deep-blue py-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          className="mb-10 md:mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Gallery</h1>
          <p className="mt-3 max-w-2xl text-deep-blue/80">
            Here is a showcase of our work.
          </p>
          <div className="mt-6 h-[3px] w-24 rounded-full bg-gradient-to-r from-reg-blue via-soft-blue to-light-blue" />
        </motion.div>

        {/* States */}
        {status.type === "loading" && (
          <div className="text-deep-blue/70">Loading gallery…</div>
        )}
        {status.type === "error" && (
          <div className="text-red-600 font-medium">{status.message}</div>
        )}
        {status.type === "idle" && images.length === 0 && (
          <div className="text-deep-blue/70">
            No images yet.
          </div>
        )}

        {/* Grid */}
        {images.length > 0 && (
          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {images.map((img, i) => (
              <motion.li
                key={img.id ?? i}
                variants={item}
                className="group relative overflow-hidden rounded-2xl bg-dark-navy/5 border border-light-blue/60 shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/3]">
                  <img
                    src={img.src}
                    alt={img.alt || "Gallery image"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                  />
                </div>

                {/* Hover depth */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {(img.caption || img.alt) && (
                  <div className="pointer-events-none absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-block text-white/95 text-xs md:text-sm font-medium bg-black/35 backdrop-blur-[2px] rounded-md px-2 py-1">
                      {img.caption || img.alt}
                    </span>
                  </div>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
