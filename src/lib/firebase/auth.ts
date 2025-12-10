"use client";

import type { User } from "firebase/auth";
import app from "./config";

// Lazy load Firebase auth to avoid SSR issues with undici
let authModule: any = null;
let auth: any = null;

const getAuthModule = async () => {
  if (typeof window === "undefined") {
    return null;
  }
  
  if (!authModule) {
    authModule = await import("firebase/auth");
  }
  
  if (!auth && authModule) {
    auth = authModule.getAuth(app);
  }
  
  return authModule;
};

// Initialize auth lazily - only when needed

// Initialize reCAPTCHA verifier
export const initializeRecaptcha = async (elementId: string = "recaptcha-container") => {
  if (typeof window === "undefined") return null;
  
  const module = await getAuthModule();
  if (!module || !auth) return null;
  
  const recaptchaVerifier = new module.RecaptchaVerifier(auth, elementId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved
    },
  });
  return recaptchaVerifier;
};

// Send OTP
export const sendOTP = async (phoneNumber: string, recaptchaVerifier: any) => {
  const module = await getAuthModule();
  if (!module || !auth) {
    throw new Error("Firebase auth not initialized");
  }
  
  try {
    const confirmationResult = await module.signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error: any) {
    throw new Error(error.message || "Failed to send OTP");
  }
};

// Verify OTP
export const verifyOTP = async (confirmationResult: any, code: string) => {
  try {
    const result = await confirmationResult.confirm(code);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message || "Invalid OTP");
  }
};

// Sign out
export const signOut = async () => {
  const module = await getAuthModule();
  if (!module || !auth) {
    throw new Error("Firebase auth not initialized");
  }
  
  try {
    await module.signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign out");
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const module = await getAuthModule();
  if (!module || !auth) {
    return null;
  }
  
  return new Promise((resolve) => {
    const unsubscribe = module.onAuthStateChanged(auth, (user: User | null) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Auth state observer
export const onAuthStateChange = async (callback: (user: User | null) => void) => {
  const module = await getAuthModule();
  if (!module || !auth) {
    return () => {};
  }
  
  return module.onAuthStateChanged(auth, callback);
};
