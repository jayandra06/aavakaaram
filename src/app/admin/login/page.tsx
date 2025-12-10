"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { initializeRecaptcha, sendOTP, verifyOTP } from "@/lib/firebase/auth";
import { createDocument, getDocument, updateDocument } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Header } from "@/components/Header";
import { User } from "@/types";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, userData } = useAuth();

  useEffect(() => {
    if (user && userData?.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [user, userData, router]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recaptchaVerifier = await initializeRecaptcha();
      if (!recaptchaVerifier) {
        toast.error("reCAPTCHA not available");
        return;
      }

      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
      const result = await sendOTP(formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setStep("otp");
      toast.success("OTP sent to your phone");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await verifyOTP(confirmationResult, otp);
      
      // Check if user exists in Firestore
      const userDoc = await getDocument("users", user.uid) as User | null;
      
      if (!userDoc) {
        // Create new admin user
        await createDocument("users", {
          phoneNumber: user.phoneNumber || phoneNumber,
          role: "admin",
          addresses: [],
        });
      } else if (userDoc.role !== "admin") {
        // Update to admin (for testing - remove in production)
        await updateDocument("users", user.uid, { role: "admin" });
      }

      toast.success("Admin login successful!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-800 p-8 rounded-xl shadow-2xl border-2 border-primary-500">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🔐 Admin Login
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {step === "phone" ? "Enter your admin phone number" : "Enter the OTP sent to your phone"}
            </p>
          </div>

          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="mt-8 space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-dark-700 rounded-lg shadow-sm bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div id="recaptcha-container"></div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-dark-700 rounded-lg shadow-sm bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-2xl tracking-widest"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Change phone number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

