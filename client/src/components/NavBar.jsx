//Navigation Bar
export default function NavBar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-dark-navy/90 backdrop-blur-md text-white shadow-md">
            <div className="container mx-auto py-4 px-4 flex items-center justify-between">

                {/* Logo and Company Title */}
                <div className="flex items-center space-x-3">
                    <img
                        src="/sogas-logo.png"
                        alt="SOGAS Logo"
                        className="h-12 object-contain"
                    />
                    <span className="text-xl font-semibold hidden sm:inline">
                        Southern Gas Services
                    </span>    
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#hero" className="text-white hover:text-soft-blue transition">Home</a>
                    <a href="#about" className="text-white hover:text-soft-blue transition">About</a>
                    <a href="#services" className="text-white hover:text-soft-blue transition">Services</a>
                    <a href="#contact" className="text-white hover:text-soft-blue transition">Contact</a>
                    <a href="#gallery" className="text-white hover:text-soft-blue transition">Gallery</a>
                </nav>
            </div>
        </header>
    );
}