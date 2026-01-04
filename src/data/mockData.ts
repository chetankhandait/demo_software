// Mock data for the restaurant table management system
import { TableStatus } from '../types';
import type { Table, MenuItem } from '../types';

// Generate 10 tables (T1-T10), all starting as FREE
export const initialTables: Table[] = Array.from({ length: 10 }, (_, i) => ({
    id: `table-${i + 1}`,
    number: i + 1,
    status: TableStatus.FREE,
    orderId: null,
    almostFreeEndTime: null,
}));

// Menu items grouped by category
// Each category represents a different chef station
export const menuItems: MenuItem[] = [
    // South Indian Status
    { id: 'sth-1', name: 'Masala Dosa', category: 'South Indian', prepTime: 10, price: 150 },
    { id: 'sth-2', name: 'Idli Sambar', category: 'South Indian', prepTime: 8, price: 100 },
    { id: 'sth-3', name: 'Medu Vada', category: 'South Indian', prepTime: 10, price: 120 },

    // Chinese Station
    { id: 'chn-1', name: 'Veg Hakka Noodles', category: 'Chinese', prepTime: 12, price: 180 },
    { id: 'chn-2', name: 'Gobi Manchurian', category: 'Chinese', prepTime: 15, price: 190 },
    { id: 'chn-3', name: 'Veg Fried Rice', category: 'Chinese', prepTime: 12, price: 180 },

    // Indian Station
    { id: 'ind-1', name: 'Paneer Butter Masala', category: 'Indian', prepTime: 20, price: 250 },
    { id: 'ind-2', name: 'Dal Makhani', category: 'Indian', prepTime: 18, price: 220 },
    { id: 'ind-3', name: 'Butter Naan', category: 'Indian', prepTime: 5, price: 40 },

    // Mocktail Station
    { id: 'mck-1', name: 'Virgin Mojito', category: 'Mocktail', prepTime: 5, price: 140 },
    { id: 'mck-2', name: 'Blue Lagoon', category: 'Mocktail', prepTime: 5, price: 150 },
    { id: 'mck-3', name: 'Watermelon Cooler', category: 'Mocktail', prepTime: 5, price: 130 },

    // Continental Station
    { id: 'cnt-1', name: 'Veg Grilled Sandwich', category: 'Continental', prepTime: 10, price: 160 },
    { id: 'cnt-2', name: 'White Sauce Pasta', category: 'Continental', prepTime: 15, price: 240 },
    { id: 'cnt-3', name: 'Cheese Burger', category: 'Continental', prepTime: 15, price: 190 },
];

// Get unique categories from menu items
export const categories = [...new Set(menuItems.map(item => item.category))];

// Helper to get menu items by category
export const getMenuItemsByCategory = (category: string): MenuItem[] => {
    return menuItems.filter(item => item.category === category);
};

// Helper to get a menu item by ID
export const getMenuItemById = (id: string): MenuItem | undefined => {
    return menuItems.find(item => item.id === id);
};

// Default timer duration for ALMOST_FREE status (in milliseconds)
// Set to 2 minutes for demo purposes (would be 12 minutes in production)
export const ALMOST_FREE_DURATION = 2 * 60 * 1000; // 2 minutes for demo
