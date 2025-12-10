"use client";

import { useState, useEffect } from "react";
import { getDocuments } from "@/lib/firebase/firestore";
import { where, orderBy } from "firebase/firestore";
import type { Product } from "@/types";

export const useProducts = (filters?: {
  categoryId?: string;
  trending?: boolean;
  topSelling?: boolean;
  limit?: number;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const constraints: any[] = [];
        
        if (filters?.categoryId) {
          constraints.push(where("categoryId", "==", filters.categoryId));
        }
        
        if (filters?.trending) {
          constraints.push(where("isTrending", "==", true));
        }
        
        if (filters?.topSelling) {
          constraints.push(where("isTopSelling", "==", true));
        }
        
        constraints.push(orderBy("createdAt", "desc"));
        
        const fetchedProducts = await getDocuments("catalogue", constraints);
        let filteredProducts = fetchedProducts.filter((p: any) => p.inInventory);
        
        if (filters?.limit) {
          filteredProducts = filteredProducts.slice(0, filters.limit);
        }
        
        setProducts(filteredProducts as Product[]);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters?.categoryId, filters?.trending, filters?.topSelling, filters?.limit]);

  return { products, loading, error };
};

