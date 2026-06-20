import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { logout } from "../../store/auth/authSlice";
import { ENDPOINTS } from "../../api/endpoint";
import api from "../../api/axios";

const AUTH_ROUTES = [ENDPOINTS.LOGIN, ENDPOINTS.REGISTER];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { totalQuantity } = useSelector((s) => s.cart); // ✅ CART STATE

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const hideAuth = AUTH_ROUTES.includes(location.pathname);

  // ======================
  // FETCH CATEGORIES
  // ======================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(ENDPOINTS.CATEGORIES);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Category fetch failed", err);
      }
    };
    fetchCategories();
  }, []);

  // ======================
  // HANDLERS
  // ======================
  const handleLogout = () => {
    dispatch(logout());
    setAccountOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/search?query=${encodeURIComponent(search)}`);
    setSearch("");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">

        {/* TOP BAR */}
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-pink-600">
            Rachnika
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm">

            {/* MEGA MENU */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className="flex items-center hover:text-pink-600">
                Shop by Category <ChevronDown size={14} />
              </button>

              {megaOpen && (
                <div className="absolute left-0 top-8 w-[600px] bg-white border shadow-lg rounded-lg p-6 grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="hover:text-pink-600 font-medium"
                      onClick={() => setMegaOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/hero-products">Hero Products</Link>
            <Link to="/sale">Sale</Link>
          </nav>

          {/* SEARCH */}
          <form onSubmit={handleSearch} className="hidden md:flex">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full border rounded pl-10 pr-4 py-2 text-sm"
              />
            </div>
          </form>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-4">

            {!isAuthenticated && !hideAuth && (
              <>
                <Link to={ENDPOINTS.REGISTER}>Sign Up</Link>
                <Link to={ENDPOINTS.LOGIN}>Login</Link>
              </>
            )}

            {isAuthenticated && (
              <div
                className="relative"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button className="flex items-center gap-1">
                  <User size={18} />
                  {user?.username || "My Account"}
                  <ChevronDown size={14} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-8 w-44 bg-white border rounded shadow">
                    <Link to="/account" className="block px-4 py-2 hover:bg-pink-50">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-pink-50">
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-pink-50 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CART */}
            <Link to="/cart" className="relative">
              <ShoppingCart />

              {totalQuantity > 0 && (
                <span
                  className="
                    absolute
                    -top-2
                    -right-2
                    bg-pink-600
                    text-white
                    text-xs
                    w-5
                    h-5
                    flex
                    items-center
                    justify-center
                    rounded-full
                  "
                >
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">

            <form onSubmit={handleSearch}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full border px-4 py-2 rounded"
              />
            </form>

            <Link to="/hero-products" onClick={() => setMobileOpen(false)}>
              Hero Products
            </Link>
            <Link to="/sale" onClick={() => setMobileOpen(false)}>
              Sale
            </Link>

            <Link to="/cart" className="flex items-center gap-2">
              <ShoppingCart />
              Cart ({totalQuantity})
            </Link>

            {!isAuthenticated && !hideAuth && (
              <div className="flex gap-3">
                <Link
                  to={ENDPOINTS.REGISTER}
                  className="flex-1 border py-2 text-center"
                >
                  Sign Up
                </Link>
                <Link
                  to={ENDPOINTS.LOGIN}
                  className="flex-1 bg-pink-600 text-white py-2 text-center"
                >
                  Login
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <>
                <Link to="/account">My Account</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
