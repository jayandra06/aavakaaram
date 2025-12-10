"use client";

import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChange } from "@/lib/firebase/auth";
import { getDocument } from "@/lib/firebase/firestore";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const setupAuth = async () => {
      unsubscribe = await onAuthStateChange(async (firebaseUser) => {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Fetch user data from Firestore
          const userDoc = await getDocument("users", firebaseUser.uid);
          setUserData(userDoc);
        } else {
          setUserData(null);
        }
        
        setLoading(false);
      });
    };
    
    setupAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { user, userData, loading, isAdmin: userData?.role === "admin" };
};

