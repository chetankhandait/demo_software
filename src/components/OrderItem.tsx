// OrderItem Component
// Displays a kitchen order item with status and action buttons
// Used in Kitchen Dashboard

import { ItemStatus } from '../types';
import type { OrderItem as OrderItemType } from '../types';

interface OrderItemProps {
  item: OrderItemType;
  tableNumber: number;
  onStartCooking: () => void;
  onMarkReady: () => void;
  onMarkServed: () => void;
}

// Status colors for order items
const statusStyles: Record<ItemStatus, { bg: string; text: string; border: string }> = {
  [ItemStatus.PENDING]: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  [ItemStatus.COOKING]: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  [ItemStatus.READY]: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  [ItemStatus.SERVED]: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export function OrderItemCard({ item, tableNumber, onStartCooking, onMarkReady, onMarkServed }: OrderItemProps) {
  const styles = statusStyles[item.status];

  return (
    <div className={`
      relative overflow-hidden
      bg-white rounded-xl shadow-sm border ${styles.border}
      transition-all duration-300 hover:shadow-md hover:-translate-y-1
    `}>
      {/* Visual Status Indicator Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.text.replace('text', 'bg')}`} />

      <div className="p-5 pl-7">
        {/* Header with table number and status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-md">
              <span>Table</span>
              <span className="text-sm text-slate-900">{tableNumber}</span>
            </span>
            <h3 className="text-lg font-bold mt-3 text-slate-800 leading-snug">{item.menuItemName}</h3>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles.bg} ${styles.text} ${styles.border}`}>
            {item.status}
          </span>
        </div>

        {/* Prep time indicator */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-5 bg-slate-50 p-2 rounded-lg inline-block">
          <span>⏱️</span>
          <span className="font-medium">Prep time: {item.prepTime} min</span>
        </div>

        {/* Action buttons based on current status */}
        <div className="flex gap-2">
          {item.status === ItemStatus.PENDING && (
            <button
              onClick={onStartCooking}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
              🔥 Start Cooking
            </button>
          )}

          {item.status === ItemStatus.COOKING && (
            <button
              onClick={onMarkReady}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
            >
              ✅ Mark Ready
            </button>
          )}

          {item.status === ItemStatus.READY && (
            <button
              onClick={onMarkServed}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/30 transition-all active:scale-95"
            >
              🍽️ Mark Served
            </button>
          )}

          {item.status === ItemStatus.SERVED && (
            <div className="w-full py-2.5 px-4 text-center text-emerald-600 font-bold bg-emerald-50 rounded-xl border border-emerald-100">
              ✓ Served
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
