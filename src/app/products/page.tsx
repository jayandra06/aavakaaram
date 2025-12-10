"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { useProducts } from "@/hooks/useProducts";
import { getDocuments } from "@/lib/firebase/firestore";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState<string>(searchParam || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch all products
  const { products: allProducts, loading: productsLoading } = useProducts({});

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getDocuments("categories", []);
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Update category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      const category = categories.find((c) => c.slug === selectedCategory);
      if (category) {
        filtered = filtered.filter((p: any) => p.categoryId === category.id);
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p: any) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a: any, b: any) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a: any, b: any) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      default: // newest
        filtered.sort((a: any, b: any) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });
    }

    return filtered;
  }, [allProducts, selectedCategory, searchQuery, priceRange, sortBy, categories]);

  const maxPrice = Math.max(...allProducts.map((p: any) => p.price || 0), 1000);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {selectedCategory !== "all"
              ? categories.find((c) => c.slug === selectedCategory)?.name || "Products"
              : "All Products"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mb-6">
          <SearchBar />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Category
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === "all"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">All Products</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.slug}
                        checked={selectedCategory === category.slug}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </button>
            </div>

            {productsLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-600 dark:text-gray-400">Loading products...</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                  No products found
                </div>
                <p className="text-gray-500 dark:text-gray-500">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.images?.[0] || "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"}
                    rating={product.rating || 4.5}
                    inStock={product.inInventory && (product.stock || 0) > 0}
                    discount={product.discount}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-dark-900 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
