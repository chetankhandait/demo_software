// Global state management using React Context and useReducer
// Handles all restaurant state: tables, orders, and order items

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { TableStatus, ItemStatus } from '../types';
import type {
  RestaurantState,
  RestaurantAction,
  Table,
  OrderItem,
  Order,
  CartItem,
} from '../types';
import { initialTables, ALMOST_FREE_DURATION } from '../data/mockData';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial state
const initialState: RestaurantState = {
  tables: initialTables,
  orders: [],
  orderItems: [],
};

/**
 * Restaurant Reducer
 * Handles all state transitions for the table management system
 * 
 * Table Status Flow:
 * FREE → OCCUPIED (order placed)
 * OCCUPIED → COOKING (any item starts cooking)
 * COOKING → EATING (first item served)
 * EATING → ALMOST_FREE (all items served, starts timer)
 * ALMOST_FREE → CLEANING (timer ends OR staff clicks "Customer Left")
 * CLEANING → FREE (cleaned)
 */
function restaurantReducer(state: RestaurantState, action: RestaurantAction): RestaurantState {
  switch (action.type) {
    case 'PLACE_ORDER': {
      const { tableId, items, totalAmount } = action.payload;
      const orderId = `ORD-${generateId()}`;
      
      // Create order items from cart
      const newOrderItems: OrderItem[] = items.flatMap(cartItem => 
        Array.from({ length: cartItem.quantity }, () => ({
          id: `item-${generateId()}`,
          menuItemId: cartItem.menuItem.id,
          menuItemName: cartItem.menuItem.name,
          category: cartItem.menuItem.category,
          tableId,
          orderId,
          status: ItemStatus.PENDING,
          prepTime: cartItem.menuItem.prepTime,
        }))
      );
      
      // Create the order
      const newOrder: Order = {
        id: orderId,
        tableId,
        items: newOrderItems,
        createdAt: Date.now(),
        totalAmount,
      };
      
      // Update table status to OCCUPIED
      const updatedTables = state.tables.map(table =>
        table.id === tableId
          ? { ...table, status: TableStatus.OCCUPIED, orderId }
          : table
      );
      
      return {
        ...state,
        tables: updatedTables,
        orders: [...state.orders, newOrder],
        orderItems: [...state.orderItems, ...newOrderItems],
      };
    }
    
    case 'START_COOKING': {
      const { orderItemId } = action.payload;
      
      // Update item status to COOKING
      const updatedOrderItems = state.orderItems.map(item =>
        item.id === orderItemId ? { ...item, status: ItemStatus.COOKING } : item
      );
      
      // Find the item to get its tableId
      const cookingItem = updatedOrderItems.find(item => item.id === orderItemId);
      if (!cookingItem) return state;
      
      // Update table to COOKING status if not already EATING
      const updatedTables = state.tables.map(table => {
        if (table.id === cookingItem.tableId && 
            (table.status === TableStatus.OCCUPIED || table.status === TableStatus.COOKING)) {
          return { ...table, status: TableStatus.COOKING };
        }
        return table;
      });
      
      return {
        ...state,
        orderItems: updatedOrderItems,
        tables: updatedTables,
      };
    }
    
    case 'MARK_READY': {
      const { orderItemId } = action.payload;
      
      // Update item status to READY
      const updatedOrderItems = state.orderItems.map(item =>
        item.id === orderItemId ? { ...item, status: ItemStatus.READY } : item
      );
      
      return {
        ...state,
        orderItems: updatedOrderItems,
      };
    }
    
    case 'MARK_SERVED': {
      const { orderItemId } = action.payload;
      
      // Update item status to SERVED
      const updatedOrderItems = state.orderItems.map(item =>
        item.id === orderItemId ? { ...item, status: ItemStatus.SERVED } : item
      );
      
      // Find the item to get its tableId and orderId
      const servedItem = updatedOrderItems.find(item => item.id === orderItemId);
      if (!servedItem) return state;
      
      // Get all items for this order
      const orderItems = updatedOrderItems.filter(item => item.orderId === servedItem.orderId);
      const allServed = orderItems.every(item => item.status === ItemStatus.SERVED);
      const anyServed = orderItems.some(item => item.status === ItemStatus.SERVED);
      
      // Update table status based on served items
      const updatedTables = state.tables.map(table => {
        if (table.id === servedItem.tableId) {
          if (allServed) {
            // All items served - start ALMOST_FREE countdown
            return {
              ...table,
              status: TableStatus.ALMOST_FREE,
              almostFreeEndTime: Date.now() + ALMOST_FREE_DURATION,
            };
          } else if (anyServed && table.status !== TableStatus.EATING) {
            // First item served - change to EATING
            return { ...table, status: TableStatus.EATING };
          }
        }
        return table;
      });
      
      return {
        ...state,
        orderItems: updatedOrderItems,
        tables: updatedTables,
      };
    }
    
    case 'CUSTOMER_LEFT': {
      const { tableId } = action.payload;
      
      // Set table to CLEANING status
      const updatedTables = state.tables.map(table =>
        table.id === tableId
          ? { ...table, status: TableStatus.CLEANING, almostFreeEndTime: null }
          : table
      );
      
      return {
        ...state,
        tables: updatedTables,
      };
    }
    
    case 'MARK_CLEANED': {
      const { tableId } = action.payload;
      
      // Find the table to get its orderId
      const table = state.tables.find(t => t.id === tableId);
      const orderId = table?.orderId;
      
      // Set table to FREE status and clear order reference
      const updatedTables = state.tables.map(t =>
        t.id === tableId
          ? { ...t, status: TableStatus.FREE, orderId: null, almostFreeEndTime: null }
          : t
      );
      
      // Remove order items for this table's order
      const updatedOrderItems = orderId
        ? state.orderItems.filter(item => item.orderId !== orderId)
        : state.orderItems;
      
      // Remove the order
      const updatedOrders = orderId
        ? state.orders.filter(order => order.id !== orderId)
        : state.orders;
      
      return {
        ...state,
        tables: updatedTables,
        orderItems: updatedOrderItems,
        orders: updatedOrders,
      };
    }
    
    case 'CHECK_TIMER': {
      const { tableId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      
      // If timer has expired, move to CLEANING
      if (table?.status === TableStatus.ALMOST_FREE && 
          table.almostFreeEndTime && 
          Date.now() >= table.almostFreeEndTime) {
        const updatedTables = state.tables.map(t =>
          t.id === tableId
            ? { ...t, status: TableStatus.CLEANING, almostFreeEndTime: null }
            : t
        );
        return { ...state, tables: updatedTables };
      }
      
      return state;
    }
    
    default:
      return state;
  }
}

// Context type
interface RestaurantContextType {
  state: RestaurantState;
  dispatch: React.Dispatch<RestaurantAction>;
}

// Create context
const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Provider component
export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);
  
  return (
    <RestaurantContext.Provider value={{ state, dispatch }}>
      {children}
    </RestaurantContext.Provider>
  );
}

// Custom hook to use restaurant context
export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
