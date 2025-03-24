export interface OrderProduct {
  cartId: number;
  orderId: number;
  email: string;
  dateAdded: string;
  quantity: number;
  price: number;
  productId: number;
  productName: string;
  productCategory: string;
  productSize: string;
  ordered: boolean;
}

export interface Order {
  orderId: number;
  orderBy: string;
  orderStatus: string;
  products: OrderProduct[];
}

export interface OrderResponse {
  status: string;
  message: string;
  orderlist: Order[];
  auth_TOKEN: string | null;
}
