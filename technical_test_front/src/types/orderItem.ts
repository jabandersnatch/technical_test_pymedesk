import { Product } from './product';

export interface OrderItemPost {
  product_id: number;
  quantity: number;
}

export interface OrderItemGet {
  id: number;
  product: Product;
  quantity: number;
  batch_cost: number;
  order: number;
}
