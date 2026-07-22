export type Category = 'mens' | 'womens' | 'kids' | 'accessories' | 'jewelry' | 'perfumes' | 'others';

export type ConditionGrade = 'Like New' | 'Gently Loved' | 'Well-Loved';

export interface Product {
  id: string;
  name: string;
  price: number; // in PHP
  category: Category;
  size: string;
  condition: ConditionGrade;
  conditionNote: string;
  quantity: number; // usually 1 for 1-of-1 thrifted items
  images: string[]; // URLs or placeholders for multiple angles
  description: string;
  isSold: boolean;
  dateAdded: string; // e.g., '2026-06-28'
  soldAt?: string; // ISO timestamp when marked sold
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  contactMethod: 'phone' | 'email' | 'facebook';
  note?: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    size: string;
    condition: string;
    image: string;
  }[];
  subtotal: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'picked_up' | 'cancelled';
  paymentMethod: 'gcash' | 'cash';
  paymentStatus: 'unpaid' | 'gcash_pending' | 'paid' | 'refunded';
  dateCreated: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  dateCreated: string;
}

export interface ShopSettings {
  adminEmail?: string;
  notificationEmail?: string;
  shopName: string;
  ownerName: string;
  shopEmail: string;
  shopPhone: string;
  shopFacebook: string;
  shopInstagram: string;
  shopGcash: string;
  shopGcashName: string;
  shopAddress: string;
  shopTagline: string;
}

