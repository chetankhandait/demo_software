// TypeScript interfaces for the restaurant table management system

// Table status enum - represents the lifecycle of a table
export enum TableStatus {
  FREE = 'FREE',           // Table is available for new customers
  OCCUPIED = 'OCCUPIED',   // Order placed, waiting for kitchen
  COOKING = 'COOKING',     // At least one item is being prepared
  EATING = 'EATING',       // At least one item has been served
  ALMOST_FREE = 'ALMOST_FREE', // All items served, countdown active
  CLEANING = 'CLEANING'    // Customer left, needs cleaning
}

// Order item status enum - tracks individual item progress
export enum ItemStatus {
  PENDING = 'PENDING',     // Waiting to be prepared
  COOKING = 'COOKING',     // Currently being prepared
  READY = 'READY',         // Ready to be served
  SERVED = 'SERVED'        // Delivered to customer
}

// Menu item definition
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  prepTime: number;  // in minutes
  price: number;
}

// Order item - an instance of a menu item in an order
export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  category: string;
  tableId: string;
  orderId: string;
  status: ItemStatus;
  prepTime: number;
}

// Order - collection of items for a table
export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  createdAt: number;  // timestamp
  totalAmount: number;
}

// Table definition
export interface Table {
  id: string;
  number: number;
  status: TableStatus;
  orderId: string | null;
  almostFreeEndTime: number | null;  // timestamp when ALMOST_FREE timer ends
}

// Cart item for customer ordering
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

// Restaurant state for context
export interface RestaurantState {
  tables: Table[];
  orders: Order[];
  orderItems: OrderItem[];
}

// Action types for reducer
export type RestaurantAction =
  | { type: 'PLACE_ORDER'; payload: { tableId: string; items: CartItem[]; totalAmount: number } }
  | { type: 'START_COOKING'; payload: { orderItemId: string } }
  | { type: 'MARK_READY'; payload: { orderItemId: string } }
  | { type: 'MARK_SERVED'; payload: { orderItemId: string } }
  | { type: 'CUSTOMER_LEFT'; payload: { tableId: string } }
  | { type: 'MARK_CLEANED'; payload: { tableId: string } }
  | { type: 'CHECK_TIMER'; payload: { tableId: string } };
