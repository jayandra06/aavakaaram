"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "@/lib/firebase/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user, userData, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error: any) {
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {isAdmin ? "Admin Dashboard" : "Customer Dashboard"}
        </h1>

        {isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/catalogue"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Catalogue Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add, edit, and manage products in the catalogue
              </p>
            </Link>

            <Link
              href="/admin/inventory"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Inventory Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage stock and promote items from catalogue
              </p>
            </Link>

            <Link
              href="/admin/categories"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Categories
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage product categories
              </p>
            </Link>

            <Link
              href="/admin/orders"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Orders
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage customer orders
              </p>
            </Link>

            <Link
              href="/admin/reviews"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Reviews & Ratings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Moderate customer reviews and ratings
              </p>
            </Link>

            <Link
              href="/admin/consignments"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Consignments
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage consignments
              </p>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/products"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Browse Products
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our collection of spicy pickles
              </p>
            </Link>

            <Link
              href="/orders"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                My Orders
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                View your order history and track current orders
              </p>
            </Link>

            <Link
              href="/addresses"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Addresses
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your shipping addresses
              </p>
            </Link>

            <Link
              href="/cart"
              className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Shopping Cart
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                View items in your cart
              </p>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

