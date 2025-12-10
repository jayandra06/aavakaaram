"use client";

import Link from "next/link";
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon
} from "@heroicons/react/24/outline";

export const Footer = () => {
  return (
    <footer className="bg-dark-900 dark:bg-black text-gray-300 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-spicy-500 bg-clip-text text-transparent">
                AavaKaaram
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Premium handcrafted pickles made with traditional recipes. 
              Spicy, hot, and delicious - delivered fresh to your doorstep worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors text-2xl">
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors text-2xl">
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors text-2xl">
                🐦
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-primary-500 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=veg" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Veg Pickles
                </Link>
              </li>
              <li>
                <Link href="/products?category=non-veg" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Non-Veg Pickles
                </Link>
              </li>
              <li>
                <Link href="/products?category=snacks" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Snacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact & Admin</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <PhoneIcon className="w-5 h-5" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <EnvelopeIcon className="w-5 h-5" />
                <span>info@aavakaaram.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPinIcon className="w-5 h-5" />
                <span>India</span>
              </li>
              <li className="pt-2 border-t border-dark-800">
                <Link
                  href="/admin/login"
                  className="text-primary-500 hover:text-primary-400 font-semibold transition-colors flex items-center gap-2"
                >
                  🔐 Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AavaKaaram. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

