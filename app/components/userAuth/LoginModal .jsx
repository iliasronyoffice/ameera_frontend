"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import DeleteIcon from "@/app/components/icons/DeleteIcon";
import EyeOpen from "../icons/EyeOpen";
import EyeClose from "../icons/EyeClose";
import EmailIcon from "../icons/EmailIcon";
import PhoneIcon from "../icons/PhoneIcon";
import LockIcon from "../icons/LockIcon";
import GoogleIcon from "../icons/GoogleIcon";
import FacebookIcon from "../icons/FacebookIcon";
import AppleIcon from "../icons/AppleIcon";
import LoginIcon from "../icons/LoginIcon";
import XIcon from "../icons/XIcon";

export default function LoginModal({ open, onClose, onSwitch, onLoginSuccess }) {
  const [usePhone, setUsePhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  
  if (!open) return null;

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    // Basic validation
    if (!emailOrPhone || !password) {
      setErrors(["Please fill in all fields"]);
      setLoading(false);
      return;
    }

    const payload = {
      email: emailOrPhone, // The backend expects 'email' field
      password: password,
      login_by: usePhone ? "phone" : "email",
      user_type: "customer" // Add this if you want to specify user type
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: 'include', // Include cookies if needed
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.result === true) {
        toast.success("Login successful!");
        
        // Store user data and token
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // You might want to set a default authorization header for future requests
          // You can do this in a separate axios/fetch instance
        }

          // Call the onLoginSuccess prop with user data
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        
        // Close modal and reset form
        onClose();
        setEmailOrPhone("");
        setPassword("");
        
        // Optionally redirect or refresh user data
        // window.location.reload(); // Uncomment if you want to refresh the page
        
      } else {
        // Handle login errors
        if (Array.isArray(data.message)) {
          setErrors(data.message);
          toast.error(data.message[0]);
        } else if (typeof data.message === 'string') {
          setErrors([data.message]);
          toast.error(data.message);
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error, please try again.");
      setErrors(["Connection error. Please check your internet and try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-main/60 flex items-center justify-center z-[999]">
      <div className="bg-gradient-to-b from-[#EBEBFE] to-white w-80 2xl:w-[28%] md:w-[40%] lg:w-[40%] rounded-2xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-xl bg-red-500 rounded-2xl p-3 z-10"
        >
          <XIcon width={10} height={10} />
        </button>

        <div className="text-center">
          <div className="bg-white rounded-md p-4 inline-flex justify-center items-center">
            <LoginIcon width={29} height={29} />
          </div>
          <h3 className="text-3xl font-bold text-main py-5">
            Welcome Back! Log in
          </h3>
          <p className="text-md pb-5">
            Log in to enjoy exclusive deals and faster <br /> checkout
          </p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {errors.map((e, i) => (
              <p key={i} className="flex items-start gap-1">
                <span>•</span> <span>{e}</span>
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full">
          {/* Toggle Button */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              className="text-red-500 text-md hover:underline focus:outline-none"
              onClick={() => setUsePhone(!usePhone)}
              disabled={loading}
            >
              {usePhone ? "*Use Email Instead" : "*Use Number Instead"}
            </button>
          </div>

          {/* Email input field */}
          {!usePhone && (
            <div className="email-input flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-3">
              <EmailIcon width={20} height={15} />
              <input
                type="email"
                placeholder="Email"
                className="w-full focus:outline-none bg-transparent"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          {/* Phone input field */}
          {usePhone && (
            <div className="phone-input flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-3">
              <PhoneIcon width={24} height={24} />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full focus:outline-none bg-transparent"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          {/* Password input field */}
          <div className="password-input flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-4">
            <LockIcon width={15} height={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full focus:outline-none bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer flex justify-center items-center focus:outline-none"
            >
              {showPassword ? (
                <EyeOpen width={24} height={24} />
              ) : (
                <EyeClose width={24} height={24} />
              )}
            </button>
          </div>

          <Link 
            href="/forgot-password" 
            className="flex justify-end items-end text-main pb-3 hover:underline"
            onClick={onClose} // Close modal when clicking forgot password
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-main text-white py-3 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-main/90 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?
          <button
            type="button"
            className="text-main font-semibold focus:outline-none"
            onClick={onSwitch}
            disabled={loading}
          >
            <span className="text-red-500 text-md py-4 px-2 cursor-pointer hover:underline">
              Sign Up
            </span>
          </button>
        </p>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-dashed border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">Or Login with</span>
          <div className="flex-1 border-t border-dashed border-gray-300"></div>
        </div>

        <div className="social-login grid grid-cols-3 gap-4">
          <button className="social bg-gray-300 rounded-2xl p-4 flex justify-center items-center hover:bg-second transition-colors">
            <GoogleIcon width={24} height={24} />
          </button>
          <button className="social bg-gray-300 rounded-2xl p-4 flex justify-center items-center hover:bg-second transition-colors">
            <FacebookIcon width={24} height={24} />
          </button>
          <button className="social bg-gray-300 rounded-2xl p-4 flex justify-center items-center hover:bg-second transition-colors">
            <AppleIcon width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}