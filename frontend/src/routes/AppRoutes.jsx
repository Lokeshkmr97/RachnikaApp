import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Navbar from "../components/layout/Navbar";
import ProductDetails from "../pages/ProductDetails";
import SearchResults from "../pages/SearchResults";
import Cart from "../pages/Cart";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/api/auth/login/" element={<Login />} />
        <Route path="/api/auth/register" element={<Register />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        

        {/* 🔒 PROTECTED CART ROUTES */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
