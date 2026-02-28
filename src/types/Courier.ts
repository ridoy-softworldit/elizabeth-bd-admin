export type CourierProvider = 'steadfast' | 'pathao';

export interface SteadfastForm {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
  alternative_phone?: string;
  recipient_email?: string;
  item_description?: string;
  total_lot?: number;
  delivery_type?: number;
}

export interface PathaoForm {
  store_id: number;
  merchant_order_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  delivery_type: 48 | 12;
  item_type: 1 | 2;
  special_instruction: string;
  item_quantity: number;
  item_weight: string;
  item_description: string;
  amount_to_collect: number;
}

export interface CourierResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface PendingStatusUpdate {
  orderId: string;
  newStatus: string;
}
