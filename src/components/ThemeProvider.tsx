"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, mounted } = useTheme();

  useEffect(() => {
    if (mounted) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  return <>{children}</>;
};

