// Hero.jsx

import { useEffect, useState } from "react";

const DEFAULT_TAGLINE = 
"SOGAS provides dependable natural gas solutions across the Gulf Coast with a reputation built on service, safety, and trust."

export default function Hero() {
    const [tagline, setTagline] = useState(DEFAULT_TAGLINE);

    useEffect(() => {
        async function fetchTagline() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/info`);

                if (!res.ok) {
                    throw new Error(`failed to fetch tagling: ${res.status}`);
                }

                const data = await res.json();
                
                if (data && data.tagline) {
                    setTagline(data.tagline);
                }

            } catch (error) {
                console.error("Failed to fetch tagline:", error);
            }
        }

        fetchTagline();
    }, []);

    return (
        <section
            id="hero"
            className="min-h-screen w-full pt-[80px] relative flex items-center justify-center text-white overflow-hidden"
        >
            {/* Background Image Overlay */}
            <div className="absolute inset-0 z-5 bg-gradient-to-t from-black/30 via-black/20 to-transparent">
                <img
                    src="/gray-pipe.jpg"
                    alt="Pipeline Project from Kinder"
                    className="h-full w-full object-cover animate-zoom-in"
                />
                <div className="absolute inset-0 bg-black/25"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 text-center max-w-4xl px-6 md:px-12 animate-fade-up"
                 style={{
                    animationDuration: "0.45s",
                    animationTimingFunction: "ease-out",
                  }}>
                    
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.75)] mb-6">
                    Welcome to <br />
                    Southern Gas Services
                </h1>
                <p className="text-lg md:text-2xl text-white font-bold mb-8 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                    {tagline}
                </p>
            </div>
        </section>
    );
}
