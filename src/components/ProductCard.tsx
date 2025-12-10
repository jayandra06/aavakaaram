"use client";

import Image from "next/image";
import Link from "next/link";
import { StarIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  inStock?: boolean;
  discount?: number;
}

export const ProductCard = ({ id, name, price, image, rating = 4.5, inStock = true, discount }: ProductCardProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          i < fullStars ? (
            <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
          ) : i === fullStars && hasHalfStar ? (
            <div key={i} className="relative">
              <StarOutline className="w-4 h-4 text-gray-300" />
              <StarIcon className="w-4 h-4 text-yellow-400 absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} />
            </div>
          ) : (
            <StarOutline key={i} className="w-4 h-4 text-gray-300" />
          )
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <Link href={`/products/${id}`}>
      <div className="group relative bg-white dark:bg-dark-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-dark-700">
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3 z-10 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discount}%
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-100 dark:bg-dark-700">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {name}
          </h3>
          
          {renderStars(rating)}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-baseline gap-2">
              {discount ? (
                <>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ₹{Math.round(price * (1 - discount / 100))}
                  </span>
                  <span className="text-sm text-gray-500 line-through">₹{price}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{price}</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
              className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              disabled={!inStock}
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

