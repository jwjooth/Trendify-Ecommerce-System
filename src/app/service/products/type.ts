export interface Product {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface createProductRequest {
  category_id: number;
  description: string;
  image_url: string;
  name: string;
  price: number;
  rating: number;
  review_count: number;
  sku: string;
  stock: number;
}
