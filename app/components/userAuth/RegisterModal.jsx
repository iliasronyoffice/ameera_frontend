"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import EyeOpen from "../icons/EyeOpen";
import EyeClose from "../icons/EyeClose";
import LockIcon from "../icons/LockIcon";
import PhoneIcon from "../icons/PhoneIcon";
import EmailIcon from "../icons/EmailIcon";
import SignUpIcon from "../icons/SignUpIcon";
import GoogleIcon from "../icons/GoogleIcon";
import FacebookIcon from "../icons/FacebookIcon";
import AppleIcon from "../icons/AppleIcon";
import XIcon from "../icons/XIcon";

export default function RegisterModal({ open, onClose, onSwitch, onRegisterSuccess }) {
  const [usePhone, setUsePhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  if (!open) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    // Basic validation
    if (!name || !emailOrPhone || !password || !confirmPass) {
      setErrors(["Please fill in all fields"]);
      setLoading(false);
      return;
    }

    if (password !== confirmPass) {
      setErrors(["Password confirmation does not match"]);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrors(["Password must be at least 6 characters"]);
      setLoading(false);
      return;
    }

    // Validate based on registration type
    if (usePhone) {
      if (!/^\d+$/.test(emailOrPhone)) {
        setErrors(["Phone number must contain only digits"]);
        setLoading(false);
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrPhone)) {
        setErrors(["Please enter a valid email address"]);
        setLoading(false);
        return;
      }
    }

    // Payload matching your backend
    const payload = {
      name: name,
      email_or_phone: emailOrPhone,
      password: password,
      password_confirmation: confirmPass,
      register_by: usePhone ? "phone" : "email",
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      // Check if registration was successful
      if (data.result === true) {
        // toast.success("Registration successful!");
        
        // Store user data and token (from loginSuccess method)
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Call the success callback with user data
        if (onRegisterSuccess) {
          onRegisterSuccess(data.user);
        }
        
        // Close modal and reset form
        onClose();
        setName("");
        setEmailOrPhone("");
        setPassword("");
        setConfirmPass("");
        
      } else {
        // Handle validation errors
        if (data.message && Array.isArray(data.message)) {
          setErrors(data.message);
          toast.error(data.message[0]);
        } else if (data.message && typeof data.message === 'string') {
          setErrors([data.message]);
          toast.error(data.message);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Network error, please try again.");
      setErrors(["Connection error. Please check your internet and try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-main/60 flex items-center justify-center z-[999]">
      <div className="bg-gradient-to-b from-[#EBEBFE] to-white w-80 2xl:w-[28%] md:w-[40%] lg:w-[40%] rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-xl bg-red-500 rounded-2xl p-3 z-10"
        >
          <XIcon width={10} height={10} />
        </button>

        <div className="text-center">
          <div className="bg-white rounded-md p-4 inline-flex justify-center items-center">
            <SignUpIcon width={50} height={50} />
          </div>
          <h3 className="text-3xl font-bold text-main py-5">Create Account</h3>
          <p className="text-md pb-5">
            Sign up to enjoy exclusive deals and faster checkout
          </p>
        </div>

        {/* ERROR MESSAGES */}
        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {errors.map((e, i) => (
              <p key={i} className="flex items-start gap-1">
                <span>•</span> <span>{e}</span>
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleRegister} className="w-full">
          {/* NAME */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full focus:outline-none bg-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* TOGGLE BUTTON */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              className="text-red-500 text-md hover:underline focus:outline-none"
              onClick={() => {
                setUsePhone(!usePhone);
                setEmailOrPhone("");
              }}
              disabled={loading}
            >
              {usePhone ? "Use Email Instead" : "Use Number Instead"}
            </button>
          </div>

          {/* EMAIL_OR_PHONE FIELD */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-3">
            {!usePhone ? (
              <EmailIcon width={20} height={15} />
            ) : (
              <PhoneIcon width={20} height={20} />
            )}
            <input
              type={usePhone ? "tel" : "email"}
              placeholder={usePhone ? "Phone Number" : "Email"}
              className="w-full focus:outline-none bg-transparent"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-3">
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
              className="cursor-pointer focus:outline-none"
            >
              {showPassword ? (
                <EyeOpen width={24} height={24} />
              ) : (
                <EyeClose width={24} height={24} />
              )}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-4">
            <LockIcon width={15} height={20} />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full focus:outline-none bg-transparent"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="cursor-pointer focus:outline-none"
            >
              {showConfirm ? (
                <EyeOpen width={24} height={24} />
              ) : (
                <EyeClose width={24} height={24} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-main text-white py-3 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-main/90 transition-colors"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?
          <button
            type="button"
            className="text-main font-semibold focus:outline-none"
            onClick={onSwitch}
            disabled={loading}
          >
            <span className="text-red-500 px-2 cursor-pointer hover:underline">
              Log In
            </span>
          </button>
        </p>

        {/* SOCIAL LOGIN */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-dashed border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">Or sign up with</span>
          <div className="flex-1 border-t border-dashed border-gray-300"></div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button 
            type="button"
            className="bg-gray-300 rounded-2xl p-4 flex justify-center hover:bg-main transition-colors"
            disabled={loading}
          >
            <GoogleIcon width={24} height={24} />
          </button>
          <button 
            type="button"
            className="bg-gray-300 rounded-2xl p-4 flex justify-center hover:bg-main transition-colors"
            disabled={loading}
          >
            <FacebookIcon width={24} height={24} />
          </button>
          <button 
            type="button"
            className="bg-gray-300 rounded-2xl p-4 flex justify-center hover:bg-main transition-colors"
            disabled={loading}
          >
            <AppleIcon width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}