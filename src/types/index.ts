export type ProductCategory = "tshirt" | "hoodie";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock: boolean;
  featured?: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  rating: number;
  author: string;
  date: string;
  text: string;
}

export interface UserUpload {
  id: string;
  userId: string;
  imageUrl: string;
  date: string;
  status: "pending" | "processing" | "completed" | "rejected";
}

export interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

export interface CustomPrintRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  imageUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
} 