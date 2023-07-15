import { Customer } from './customer';
import { OrderItemGet, OrderItemPost } from './orderItem';

export interface OrderPost {
  customer_id: number;
  products: OrderItemPost[];
  status: string;
  paid: boolean;
  delivery_rule: string;
  observations: string;
}

export interface OrderGet {
  id: number;
  customer: Customer;
  products: OrderItemGet[];
  date: string;
  status: string;
  paid: boolean;
  delivery_rule: string;
  observations: string;
  total_cost: number;
}

export const getToPost = (order: OrderGet): OrderPost => ({
  customer_id: order.customer.id,
  products: order.products.map((product) => ({
    product_id: product.product.id,
    quantity: product.quantity,
  })),
  status: order.status,
  paid: order.paid,
  delivery_rule: order.delivery_rule,
  observations: order.observations,
});
