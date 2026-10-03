export type CategoryType = 'books' | 'instruments' | 'apparel' | 'diagnostics';

export interface Product {
  id: number;
  name: string;
  category: CategoryType;
  price: string;
  rawPrice?: number;
  stock: 'in-stock' | 'stock-out';
  icon: string;
  image?: string;
  description: string;
  features?: string[];
  badge?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  notes?: string;
  createdAt: string;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
}
