// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Import Navigation Bar
import NavBar from "./components/NavBar";
//Import Home Page
import Home from "./components/Home";
//Import Gallery Page
import Gallery from "./components/Gallery";
//Import Footer
import Footer from "./components/Footer";

// Import Admin page
import Admin from "./components/admin/Admin.jsx";
// Import Manage Services
import ManageServices from "./components/admin/ManageServices";
// Import Manage Gallery
import ManageGallery from "./components/admin/ManageGallery";

//App Page
export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* NavBar is always visible */}
        <NavBar />

        {/* Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            {/* Admin */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/services" element={<ManageServices />} />
            <Route path="/admin/gallery" element={<ManageGallery />} />
          </Routes>
        </main>

        {/* Footer is always visible */}
        <Footer />
      </div>
    </Router>
  );
}
