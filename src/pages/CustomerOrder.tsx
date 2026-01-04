// Customer Order Screen
// Route: /table/:tableId
// Shows menu grouped by category, allows adding items to cart, and placing prepaid orders

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MenuItemCard } from '../components/MenuItem';
import { CategoryTabs } from '../components/CategoryTabs';
import { useRestaurant } from '../context/RestaurantContext';
import { menuItems, categories } from '../data/mockData';
import { TableStatus } from '../types';
import type { CartItem } from '../types';

export function CustomerOrder() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useRestaurant();
  
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const tableNumber = parseInt(tableId || '1');
  const currentTable = state.tables.find(t => t.number === tableNumber);

  // Check if table is already occupied
  const isTableOccupied = currentTable?.status !== TableStatus.FREE;

  // Get quantity of an item in cart
  const getQuantity = (itemId: string): number => {
    const cartItem = cart.find(c => c.menuItem.id === itemId);
    return cartItem?.quantity || 0;
  };

  // Add item to cart
  const handleAdd = (menuItem: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(c =>
          c.menuItem.id === menuItem.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  // Remove item from cart
  const handleRemove = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(c =>
          c.menuItem.id === itemId
            ? { ...c, quantity: c.quantity - 1 }
            : c
        );
      }
      return prev.filter(c => c.menuItem.id !== itemId);
    });
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Simulate payment and place order
  const handlePlaceOrder = async () => {
    if (cart.length === 0 || !currentTable) return;

    setIsProcessing(true);

    // Simulate payment processing (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Place the order
    dispatch({
      type: 'PLACE_ORDER',
      payload: {
        tableId: currentTable.id,
        items: cart,
        totalAmount: total,
      },
    });

    setIsProcessing(false);
    setOrderPlaced(true);
  };

  // Filter menu items by active category
  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  // Show success screen after order is placed
  if (orderPlaced) {
    return (
      <Layout title={`Table ${tableNumber} - Order Confirmed`}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Payment of ₹{total} completed
          </p>
          <p className="text-gray-600 mb-8">
            Your food is being prepared. Track your order on the kitchen display.
          </p>
          <div className="bg-orange-100 text-orange-800 px-6 py-3 rounded-xl font-medium">
            Order Total: ₹{total} ({totalItems} items)
          </div>
          <button
            onClick={() => navigate('/kitchen')}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            View Kitchen Dashboard →
          </button>
        </div>
      </Layout>
    );
  }

  // Show occupied message if table is not free
  if (isTableOccupied) {
    return (
      <Layout title={`Table ${tableNumber}`}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-8xl mb-6">🍽️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Table Currently Occupied
          </h2>
          <p className="text-gray-600 mb-4">
            This table already has an active order.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Status: <span className="font-medium">{currentTable?.status}</span>
          </p>
          <button
            onClick={() => navigate('/host')}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            View Host Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Table ${tableNumber} - Order`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          {/* Category Tabs */}
          <div className="mb-6">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={getQuantity(item.id)}
                onAdd={() => handleAdd(item)}
                onRemove={() => handleRemove(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Cart Section - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Cart</h2>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                  {cart.map(item => (
                    <div
                      key={item.menuItem.id}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.menuItem.name}</p>
                        <p className="text-sm text-gray-500">₹{item.menuItem.price} × {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{item.menuItem.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">₹{total}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{totalItems} items</p>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg
                    transition-all duration-300
                    ${isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-[1.02]'
                    }
                  `}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Processing Payment...
                    </span>
                  ) : (
                    `💳 Pay ₹${total} & Place Order`
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden z-50">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <p className="text-xs text-gray-500">{totalItems} items</p>
              <p className="text-lg font-bold text-gray-800">₹{total}</p>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className={`
                px-6 py-3 rounded-xl font-bold
                transition-all duration-300
                ${isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
                }
              `}
            >
              {isProcessing ? 'Processing' : 'View Cart & Pay'}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
