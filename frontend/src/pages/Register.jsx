import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../store/auth/authSlice";
import { ENDPOINTS } from "../api/endpoint";

export default function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    phone_number: "",
    password: "",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // ✅ Basic validation
    if (!form.email || !form.phone_number || !form.password) {
      setFormError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    dispatch(registerUser(form));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>

          {/* Email */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full border p-3 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full border p-3 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border p-3 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* Error Messages */}
          {(formError || error) && (
            <p className="text-red-600 text-sm mb-3">
              {formError || error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link
            to={ENDPOINTS.LOGIN}
            className="text-pink-600 font-medium hover:underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
