import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products/Products";
import Contact from "./pages/Contact";
import Service from "./pages/Service";
import Saaspage from "./pages/Products/Saaspage";
import Crmpage from "./pages/Products/Crmpage";
import Erppage from "./pages/Products/Erppage";
import Lmspage from "./pages/Products/Lmspage";
import Billingpage from "./pages/Products/Billingpage";
import Floatingaction from "./components/Floatingaction";
import ScrollToTop from "./components/ScrollToTop";

import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./pages/AdminLogin";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    window.location.href = "/admin/login";
    return null;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname.startsWith("/admin") &&
    location.pathname !== "/admin/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {!hideNavbar && <Floatingaction />}
      {!hideNavbar && <ScrollToTop />}

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Website */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/saas" element={<Saaspage />} />
        <Route path="/products/crm" element={<Crmpage />} />
        <Route path="/products/erp" element={<Erppage />} />
        <Route path="/products/lms" element={<Lmspage />} />
        <Route path="/products/billing" element={<Billingpage />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
