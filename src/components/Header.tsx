"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/store/cart";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";

export const Header = () => {
  const { user } = useAuth();
  const itemCount = useCart((state) => state.getItemCount());

  return (
    <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <div className="flex items-center gap-8 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-spicy-500 bg-clip-text text-transparent">
                AavaKaaram
              </span>
              <span className="text-xs text-spicy-500 font-semibold">🔥 SPICY</span>
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/products?category=veg"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Veg Pickles
              </Link>
              <Link
                href="/products?category=non-veg"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Non-Veg
              </Link>
              <Link
                href="/products?category=snacks"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Snacks
              </Link>
              <Link
                href="/products?category=karappodi"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Karappodi
              </Link>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/dashboard"
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <UserIcon className="w-6 h-6" />
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};

