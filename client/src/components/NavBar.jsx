// src/components/NavBar.jsx
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-navy/90 backdrop-blur-md text-white shadow-md">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">

        {/* Logo + Company Title (same layout/feel as your original) */}
        <RouterLink to="/" className="flex items-center space-x-3">
          <img
            src="/sogas-logo.png"     // put the file at: public/sogas-logo.png
            alt="SOGAS Logo"
            className="h-12 w-auto object-contain block"
          />
          <span className="text-white text-xl font-semibold hidden sm:inline">
            Southern Gas Services
          </span>
        </RouterLink>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Home always routes to "/" */}
          <RouterLink to="/" className="text-white hover:text-soft-blue transition">
            Home
          </RouterLink>

          {/* Section links: smooth scroll on home; route back when off home */}
          {isHome ? (
            <>
              <ScrollLink
                to="about"
                smooth
                duration={500}
                offset={-80}
                className="text-white hover:text-soft-blue transition cursor-pointer"
              >
                About
              </ScrollLink>
              <ScrollLink
                to="services"
                smooth
                duration={500}
                offset={-80}
                className="text-white hover:text-soft-blue transition cursor-pointer"
              >
                Services
              </ScrollLink>
              <ScrollLink
                to="contact"
                smooth
                duration={500}
                offset={-80}
                className="text-white hover:text-soft-blue transition cursor-pointer"
              >
                Contact
              </ScrollLink>
            </>
          ) : (
            <>
              <RouterLink to="/#about" className="text-white hover:text-soft-blue transition">
                About
              </RouterLink>
              <RouterLink to="/#services" className="text-white hover:text-soft-blue transition">
                Services
              </RouterLink>
              <RouterLink to="/#contact" className="text-white hover:text-soft-blue transition">
                Contact
              </RouterLink>
            </>
          )}

          {/* Separate page */}
          <RouterLink to="/gallery" className="text-white hover:text-soft-blue transition">
            Gallery
          </RouterLink>
        </nav>
      </div>
    </header>
  );
}
