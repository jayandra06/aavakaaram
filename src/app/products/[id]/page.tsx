"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/store/cart";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { getDocument, getDocuments, createDocument, updateDocument } from "@/lib/firebase/firestore";
import { where, orderBy, limit } from "firebase/firestore";
import { Product, Review } from "@/types";
import toast from "react-hot-toast";
import {
  StarIcon,
  ShoppingCartIcon,
  ShareIcon,
  MinusIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { StarIcon as StarOutline, CheckIcon } from "@heroicons/react/24/outline";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [category, setCategory] = useState<any>(null);
  
  const { user, userData } = useAuth();
  const { addItem } = useCart();
  const { products: relatedProducts } = useProducts({
    categoryId: product?.categoryId,
    limit: 4,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getDocument("catalogue", productId);
        
        if (!productData) {
          toast.error("Product not found");
          router.push("/products");
          return;
        }

        setProduct(productData as Product);

        // Fetch category
        if (productData.categoryId) {
          const categoryData = await getDocument("categories", productData.categoryId);
          setCategory(categoryData);
        }

        // Fetch reviews
        try {
          const reviewsData = await getDocuments("reviews", [
            where("productId", "==", productId),
            where("enabled", "==", true),
            orderBy("createdAt", "desc"),
          ]);
          setReviews(reviewsData as Review[]);
        } catch (error) {
          // If query fails (e.g., no index), try without orderBy
          try {
            const reviewsData = await getDocuments("reviews", [
              where("productId", "==", productId),
              where("enabled", "==", true),
            ]);
            // Sort manually
            reviewsData.sort((a: any, b: any) => {
              const aTime = a.createdAt?.toMillis?.() || 0;
              const bTime = b.createdAt?.toMillis?.() || 0;
              return bTime - aTime;
            });
            setReviews(reviewsData as Review[]);
          } catch (err) {
            console.error("Error fetching reviews:", err);
            setReviews([]);
          }
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load product");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    if (!product.inInventory || (product.stock && product.stock < quantity)) {
      toast.error("Insufficient stock");
      return;
    }

    addItem(
      {
        productId: product.id,
        productName: product.name,
        price: product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price,
        image: product.images?.[0] || "",
      },
      quantity
    );

    toast.success(`${product.name} added to cart!`);
    setQuantity(1);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: product?.name || "Product",
      text: product?.description || "",
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Product shared!");
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !product) return;

    if (!reviewComment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      await createDocument("reviews", {
        productId: product.id,
        userId: user.uid,
        userName: userData?.phoneNumber || "Anonymous",
        rating: reviewRating,
        comment: reviewComment,
        enabled: true,
      });

      toast.success("Review submitted! Thank you for your feedback.");
      setReviewComment("");
      setReviewRating(5);
      setShowReviewForm(false);

      // Refresh reviews
      const reviewsData = await getDocuments("reviews", [
        where("productId", "==", productId),
        where("enabled", "==", true),
        orderBy("createdAt", "desc"),
      ]);
      setReviews(reviewsData as Review[]);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            {star <= rating ? (
              <StarIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <StarOutline className="w-5 h-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product?.rating || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading product...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const inStock = product.inInventory && (product.stock === undefined || product.stock > 0);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </Link>
          {" / "}
          <Link href="/products" className="hover:text-primary-600 dark:hover:text-primary-400">
            Products
          </Link>
          {category && (
            <>
              {" / "}
              <Link
                href={`/products?category=${category.slug}`}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {category.name}
              </Link>
            </>
          )}
          {" / "}
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 dark:bg-dark-800 rounded-2xl overflow-hidden group">
              <Image
                src={product.images?.[selectedImageIndex] || product.images?.[0] || "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=800&h=800&fit=crop"}
                alt={product.name}
                fill
                className="object-cover cursor-zoom-in"
                onClick={() => setImageZoom(true)}
                priority
              />
              <button
                onClick={() => setImageZoom(true)}
                className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-dark-900/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
              
              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-4 left-4 bg-primary-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  -{product.discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary-600 dark:border-primary-400"
                        : "border-transparent hover:border-gray-300 dark:hover:border-dark-700"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                {renderStars(averageRating)}
                <span className="text-gray-600 dark:text-gray-400">
                  {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  ₹{finalPrice}
                </span>
                {product.discount && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">₹{product.price}</span>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {inStock ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckIcon className="w-5 h-5" />
                    <span className="font-semibold">
                      {product.stock !== undefined ? `${product.stock} in stock` : "In Stock"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Description</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-lg font-semibold text-gray-900 dark:text-white">Quantity:</label>
              <div className="flex items-center gap-3 border-2 border-gray-300 dark:border-dark-700 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!inStock || (product.stock !== undefined && quantity >= product.stock)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                Add to Cart
              </button>
              <button
                onClick={handleShare}
                className="px-8 py-4 bg-gray-200 dark:bg-dark-800 hover:bg-gray-300 dark:hover:bg-dark-700 text-gray-900 dark:text-white rounded-xl font-bold text-lg transition-all"
              >
                <ShareIcon className="w-6 h-6 inline mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 dark:border-dark-800 pt-12 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reviews ({reviews.length})
            </h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && user && (
            <div className="mb-8 p-6 bg-gray-50 dark:bg-dark-800 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Write a Review
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Rating
                  </label>
                  {renderStars(reviewRating, true, setReviewRating)}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Share your thoughts about this product..."
                  />
                </div>
                <button
                  onClick={handleSubmitReview}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 bg-gray-50 dark:bg-dark-800 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {review.userName || "Anonymous"}
                        </h4>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.createdAt?.toDate?.()
                          ? new Date(review.createdAt.toDate()).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                  {review.adminReply && (
                    <div className="mt-4 pl-4 border-l-4 border-primary-600 dark:border-primary-400">
                      <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1">
                        Admin Reply:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">{review.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 dark:border-dark-800 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    name={relatedProduct.name}
                    price={relatedProduct.price}
                    image={relatedProduct.images?.[0] || ""}
                    rating={relatedProduct.rating || averageRating}
                    inStock={relatedProduct.inInventory && (relatedProduct.stock || 0) > 0}
                    discount={relatedProduct.discount}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {imageZoom && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageZoom(false)}
        >
          <button
            onClick={() => setImageZoom(false)}
            className="absolute top-4 right-4 text-white text-2xl font-bold"
          >
            ×
          </button>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={product.images?.[selectedImageIndex] || product.images?.[0] || "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=1200&h=1200&fit=crop"}
              alt={product.name}
              width={1200}
              height={1200}
              className="object-contain max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-dark-900 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
          <Footer />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
