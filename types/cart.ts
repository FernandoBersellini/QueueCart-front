export interface CartItemDTO {
  productId: number;
  quantity: number;
}

export interface CartDTO {
  id: number;
  userId: number;
  items: CartItemDTO[];
}

export interface AddCartItemDTO {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDTO {
  quantity: number;
}
