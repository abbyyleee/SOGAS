// App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import Gallery from "./components/Gallery.jsx";
import Footer from "./components/Footer.jsx";
import Admin from "./components/admin/Admin.jsx";
import ManageServices from "./components/admin/ManageServices.jsx";
import ManageGallery from "./components/admin/ManageGallery.jsx";
import ManageInfo from "./components/admin/ManageInfo.jsx";


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
            <Route path="/admin/info" element={<ManageInfo />} />
          </Routes>
        </main>

        {/* Footer is always visible */}
        <Footer />
      </div>
    </Router>
  );
}
