"use client";

import { ProductCard } from "./ProductCard";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  inStock?: boolean;
  discount?: number;
}

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  showViewAll?: boolean;
}

export const ProductSection = ({ title, subtitle, products, viewAllLink, showViewAll = true }: ProductSectionProps) => {
  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
          {showViewAll && viewAllLink && (
            <Link
              href={viewAllLink}
              className="hidden md:flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
            >
              View All
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {showViewAll && viewAllLink && (
          <div className="mt-8 text-center md:hidden">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
            >
              View All Products
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

