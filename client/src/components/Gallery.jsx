// src/components/Gallery.jsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Lightbox state
  const [openIndex, setOpenIndex] = useState(null);
  const closeBtnRef = useRef(null);

  // Fetch images (API first -> local fallback)
  useEffect(() => {
    let mounted = true;

    const fetchJSON = async (url) => {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    };

    (async () => {
      setStatus({ type: "loading", message: "Loading..." });

      try {
        const api = await fetchJSON("/api/gallery");
        if (!mounted) return;
        setImages(Array.isArray(api?.images) ? api.images : []);
        setStatus({ type: "idle", message: "" });
        return;
      } catch {}

      try {
        const local = await fetchJSON("/images/gallery.json");
        if (!mounted) return;
        setImages(Array.isArray(local?.images) ? local.images : []);
        setStatus({ type: "idle", message: "" });
      } catch {
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

  // Open / Close helpers
  const openLightbox = (idx) => setOpenIndex(idx);
  const closeLightbox = () => setOpenIndex(null);

  const showPrev = (e) => {
    e?.stopPropagation?.();
    setOpenIndex((i) => (i === null ? null : (i + images.length - 1) % images.length));
  };
  const showNext = (e) => {
    e?.stopPropagation?.();
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  };

  // Keyboard controls when lightbox is open
  useEffect(() => {
    if (openIndex === null) return;

    // Prevent body scroll while open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (ev) => {
      if (ev.key === "Escape") closeLightbox();
      if (ev.key === "ArrowLeft") showPrev();
      if (ev.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);

    // Focus close button on open
    setTimeout(() => closeBtnRef.current?.focus?.(), 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  return (
    <section
      id="gallery"
      className="w-full min-h-screen bg-light-blue text-deep-blue pt-[96px] pb-16"
    >
      {/* Full-bleed */}
      <div className="px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          className="mb-8 sm:mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Gallery</h1>
          <p className="mt-3 max-w-2xl text-deep-blue/80">A simple, premium showcase of our work.</p>
          <div className="mt-6 h-[3px] w-24 rounded-full bg-gradient-to-r from-reg-blue via-soft-blue to-light-blue" />
        </motion.div>

        {/* States */}
        {status.type === "loading" && <div className="text-deep-blue/70">Loading gallery…</div>}
        {status.type === "error" && <div className="text-red-600 font-medium">{status.message}</div>}
        {status.type === "idle" && images.length === 0 && <div className="text-deep-blue/70">No images yet.</div>}

        {/* Grid (larger tiles) */}
        {images.length > 0 && (
          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="
              grid gap-5 sm:gap-6 lg:gap-8
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              2xl:grid-cols-4
            "
          >
            {images.map((img, i) => (
              <motion.li
                key={img.id ?? i}
                variants={item}
                className="group relative overflow-hidden rounded-2xl bg-dark-navy/5 border border-light-blue/60 shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openLightbox(i)}
              >
                <div className="aspect-[16/10]">
                  <img
                    src={img.src}
                    alt={img.alt || "Gallery image"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                  />
                </div>

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

      {/* LIGHTBOX */}
      <AnimatePresence>
        {openIndex !== null && images[openIndex] && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox} // click backdrop to close
            aria-modal="true"
            role="dialog"
          >
            {/* Content wrapper to stop propagation so clicks on image/buttons don't close */}
            <motion.div
              className="relative max-w-[92vw] max-h-[86vh] w-[92vw] md:w-[80vw]"
              initial={{ scale: 0.98, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { duration: 0.2 } }}
              exit={{ scale: 0.98, y: 8, opacity: 0, transition: { duration: 0.2 } }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="w-full h-auto">
                <img
                  src={images[openIndex].src}
                  alt={images[openIndex].alt || "Expanded image"}
                  className="w-full h-[70vh] md:h-[76vh] object-contain rounded-xl shadow-2xl bg-black/20"
                />
              </div>

              {/* Caption */}
              {(images[openIndex].caption || images[openIndex].alt) && (
                <div className="mt-3 text-center text-white/90 text-sm md:text-base">
                  {images[openIndex].caption || images[openIndex].alt}
                </div>
              )}

              {/* Close button */}
              <button
                ref={closeBtnRef}
                onClick={closeLightbox}
                className="absolute top-3 right-3 rounded-lg px-3 py-2 bg-rust text-dark-navy hover:bg-white/20 text-white text-sm font-medium backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-white/60"
                aria-label="Close"
              >
                Close
              </button>

              {/* Prev / Next controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={showPrev}
                    className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 md:w-12 md:h-12 bg-rust text-dark-navy hover:bg-white/20 text-white text-xl backdrop-blur flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-white/60"
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    onClick={showNext}
                    className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 md:w-12 md:h-12 bg-rust text-dark-navy hover:bg-white/20 text-white text-xl backdrop-blur flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-white/60"
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
