export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItemDTO {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDTO {
  id: number;
  userId: number;
  status: OrderStatus;
  items: OrderItemDTO[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRequestDTO {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface CreateOrderDTO {
  userId: number;
  items: OrderItemRequestDTO[];
}
