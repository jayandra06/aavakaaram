"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductSection } from "@/components/ProductSection";
import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const { products: trendingProducts } = useProducts({ trending: true, limit: 8 });
  const { products: topSellingProducts } = useProducts({ topSelling: true, limit: 8 });
  const { products: allProducts } = useProducts({ limit: 12 });

  // Filter products with discounts for offers section
  const offerProducts = allProducts.filter((p: any) => p.discount && p.discount > 0).slice(0, 8);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors flex flex-col">
      <Header />

      {/* Hero Section - Modern Design */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-dark-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=1920&h=1080&fit=crop"
            alt="Spicy Pickles"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/80 to-dark-900/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                🎉 Special Offers This Week
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Authentic <span className="text-spicy-400">Spicy</span>
                <br />
                <span className="text-yellow-300">Pickles</span> Delivered
                <br />
                Fresh to You
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                Handcrafted with traditional recipes and premium ingredients. 
                Experience the authentic flavors of India with our carefully curated collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                >
                  Shop Now →
                </Link>
                <Link
                  href="/products?category=veg"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all backdrop-blur-sm"
                >
                  Browse Collection
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4 text-sm">
                <div>
                  <div className="text-2xl font-bold">5000+</div>
                  <div className="text-gray-300">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">4.8★</div>
                  <div className="text-gray-300">Average Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-gray-300">Products</div>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1606914509765-5c4a5c8e8b8c?w=800&h=1200&fit=crop"
                  alt="Premium Pickles"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      {offerProducts.length > 0 && (
        <ProductSection
          title="🔥 Special Offers"
          subtitle="Limited time deals you don't want to miss"
          products={offerProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.images?.[0] || "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop",
            rating: p.rating || 4.5,
            inStock: p.inInventory && (p.stock || 0) > 0,
            discount: p.discount,
          }))}
          viewAllLink="/products?offers=true"
        />
      )}

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <ProductSection
          title="🔥 Trending Now"
          subtitle="Most popular picks this week"
          products={trendingProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.images?.[0] || "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop",
            rating: p.rating || 4.5,
            inStock: p.inInventory && (p.stock || 0) > 0,
            discount: p.discount,
          }))}
          viewAllLink="/products?trending=true"
        />
      )}

      {/* Top Selling Products */}
      {topSellingProducts.length > 0 && (
        <ProductSection
          title="⭐ Top Selling"
          subtitle="Customer favorites"
          products={topSellingProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.images?.[0] || "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop",
            rating: p.rating || 4.5,
            inStock: p.inInventory && (p.stock || 0) > 0,
            discount: p.discount,
          }))}
          viewAllLink="/products?top-selling=true"
        />
      )}

      {/* Features Section - Modern */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-dark-800 dark:to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-primary-600">AavaKaaram</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We combine traditional recipes with modern quality standards
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "👨‍🍳",
                title: "Handcrafted Quality",
                description: "Made with traditional recipes passed down through generations. Every jar is carefully prepared with the finest ingredients.",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: "🌍",
                title: "Worldwide Delivery",
                description: "We ship our spicy pickles anywhere in the world. Fast, secure, and reliable delivery to your doorstep.",
                color: "from-blue-500 to-blue-700",
              },
              {
                icon: "🔥",
                title: "Fresh & Spicy",
                description: "Packed with authentic flavors and the perfect level of spice. Guaranteed to satisfy your cravings.",
                color: "from-spicy-500 to-spicy-700",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-dark-700 hover:border-primary-500"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 transform group-hover:scale-110 transition-transform`}>
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview - Modern */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by <span className="text-primary-600">Category</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explore our wide range of pickles and snacks
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Veg Pickles", emoji: "🥕", href: "/products?category=veg", color: "from-green-500 to-emerald-600", count: "15+" },
              { name: "Non-Veg Pickles", emoji: "🍗", href: "/products?category=non-veg", color: "from-red-500 to-red-700", count: "8+" },
              { name: "Snacks", emoji: "🍿", href: "/products?category=snacks", color: "from-yellow-500 to-orange-600", count: "12+" },
              { name: "Karappodi", emoji: "🌶️", href: "/products?category=karappodi", color: "from-spicy-500 to-spicy-700", count: "5+" },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${category.color} p-10 text-center h-64 flex flex-col items-center justify-center relative`}>
                  <div className="text-7xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count} Products</p>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-spicy-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=1920&h=600&fit=crop"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Spice Up Your Life?</h2>
          <p className="text-xl mb-10 text-gray-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who love our authentic pickles. 
            Order now and experience the difference!
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-5 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
          >
            Start Shopping Now 🛒
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
