// Kitchen Dashboard
// Route: /kitchen
// Shows order items grouped by category (chef station), with status progression buttons

import { useState } from 'react';
import { Layout } from '../components/Layout';
import { OrderItemCard } from '../components/OrderItem';
import { CategoryTabs } from '../components/CategoryTabs';
import { useRestaurant } from '../context/RestaurantContext';
import { categories } from '../data/mockData';
import { ItemStatus } from '../types';

export function KitchenDashboard() {
  const { state, dispatch } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState<string>('Pizza');

  // Filter active items by category (excluding SERVED)
  const filteredItems = state.orderItems.filter(
    item => (item.category === activeCategory || (activeCategory === 'All' && true)) && item.status !== ItemStatus.SERVED
  );

  const handleStatusChange = (orderItemId: string, newStatus: ItemStatus) => {
    if (newStatus === ItemStatus.COOKING) {
      dispatch({ type: 'START_COOKING', payload: { orderItemId } });
    } else if (newStatus === ItemStatus.READY) {
      dispatch({ type: 'MARK_READY', payload: { orderItemId } });
    } else if (newStatus === ItemStatus.SERVED) {
      dispatch({ type: 'MARK_SERVED', payload: { orderItemId } });
    }
  };

  const getTableNumber = (tableId: string) => {
    return state.tables.find(t => t.id === tableId)?.number || 0;
  };

  const pendingCount = state.orderItems.filter(i => i.status === ItemStatus.PENDING).length;
  const cookingCount = state.orderItems.filter(i => i.status === ItemStatus.COOKING).length;
  const readyCount = state.orderItems.filter(i => i.status === ItemStatus.READY).length;

  return (
    <Layout title="Kitchen Display System">
      {/* Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-slate-200">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending</div>
            <div className="text-2xl font-black text-slate-800">{pendingCount}</div>
          </div>
          <div className="text-2xl opacity-50">📝</div>
        </div>
        <div className="glass p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-blue-400">
          <div>
            <div className="text-blue-600 text-xs font-bold uppercase tracking-wider">Cooking</div>
            <div className="text-2xl font-black text-blue-900">{cookingCount}</div>
          </div>
          <div className="text-2xl opacity-50">🔥</div>
        </div>
        <div className="glass p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-emerald-400">
          <div>
            <div className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Ready</div>
            <div className="text-2xl font-black text-emerald-900">{readyCount}</div>
          </div>
          <div className="text-2xl opacity-50">✅</div>
        </div>
      </div>

      <div className="mb-8">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-300">
          <div className="text-6xl mb-4 opacity-50">🧑‍🍳</div>
          <h3 className="text-xl font-bold text-slate-700">No active orders</h3>
          <p className="text-slate-500">All caught up in this category!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <OrderItemCard
              key={item.id}
              item={item}
              tableNumber={getTableNumber(item.tableId)}
              onStartCooking={() => handleStatusChange(item.id, ItemStatus.COOKING)}
              onMarkReady={() => handleStatusChange(item.id, ItemStatus.READY)}
              onMarkServed={() => handleStatusChange(item.id, ItemStatus.SERVED)}
            />
          ))}
        </div>
      )}

      {/* Kitchen Tips */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">📝 Kitchen Workflow</h3>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. <strong>Start Cooking</strong> - When you begin preparing an item</li>
          <li>2. <strong>Mark Ready</strong> - When the item is ready for pickup</li>
          <li>3. <strong>Mark Served</strong> - When the server picks up the item</li>
        </ol>
      </div>
    </Layout>
  );
}
