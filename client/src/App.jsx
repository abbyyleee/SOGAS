// App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Home Page
import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import Gallery from "./components/Gallery.jsx";
import Footer from "./components/Footer.jsx";
import api from "./lib/api.js";

// Admin
import Admin from "./components/admin/Admin.jsx";
import ManageServices from "./components/admin/ManageServices.jsx";
import ManageGallery from "./components/admin/ManageGallery.jsx";
import ManageInfo from "./components/admin/ManageInfo.jsx";
import AdminLogin from "./components/admin/AdminLogin.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import AdminRegister from "./components/admin/AdminRegister.jsx";
import { useEffect } from "react";


//App Page
export default function App() {

  // Warm up the backend once on app load
  useEffect(() => {
    api.get("health").catch(() => {});
  }, []);
  
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
            <Route path="/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>} />
            <Route path="/admin/services" element={<ManageServices />} />
            <Route path="/admin/gallery" element={<ManageGallery />} />
            <Route path="/admin/info" element={<ManageInfo />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
          </Routes>
        </main>

        {/* Footer is always visible */}
        <Footer />
      </div>
    </Router>
  );
}
