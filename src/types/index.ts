export interface User {
  id: string;
  phoneNumber: string;
  role: "customer" | "admin";
  addresses?: Address[];
  createdAt: any;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  categoryId: string;
  price: number;
  inInventory: boolean;
  stock?: number;
  rating?: number;
  isTrending?: boolean;
  isTopSelling?: boolean;
  discount?: number;
  createdAt: any;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  dhlShipmentId?: string;
  dhlTrackingNumber?: string;
  createdAt: any;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName?: string;
  rating: number;
  comment: string;
  enabled: boolean;
  adminReply?: string;
  createdAt: any;
}

export interface Consignment {
  id: string;
  orderIds: string[];
  status: string;
  dhlShipmentId?: string;
  createdAt: any;
}

