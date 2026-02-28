export interface ShippingInfo {
  name: string;
  type: string;
}

export interface OrderTotalAmount {
  subTotal: number;
  tax: number;
  shipping: ShippingInfo;
  discount: number;
  total: number;
}

export interface OrderInfo {
  productInfo: string;
  trackingNumber: string;
  status: string;
  isCancelled: boolean;
  quantity: number;
  totalAmount: OrderTotalAmount;
  orderBy: string;
  streetAddress?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  orderId: string;
  _id: string;
  customerInfo: CustomerInfo;
  orderInfo: OrderInfo[];
  totalAmount: number;
  deliveryCharge?: number;
  paymentInfo: string;
  trackingNumber?: string;
  courierProvider?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface OrderSummary {
  totalOrders: number;
  totalPendingOrders: number;
  totalCompletedOrders: number;
  totalPendingAmount: number;
  totalCompletedAmount: number;
}
