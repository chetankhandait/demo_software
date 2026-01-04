// MenuItem Component
// Displays a menu item with add/remove buttons
// Used in Customer Order Screen

import type { MenuItem as MenuItemType } from '../types';

interface MenuItemProps {
  item: MenuItemType;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function MenuItemCard({ item, quantity, onAdd, onRemove }: MenuItemProps) {
  // Category badge colors
  const categoryColors: Record<string, string> = {
    'South Indian': 'bg-orange-100 text-orange-700',
    'Chinese': 'bg-red-100 text-red-700',
    'Indian': 'bg-amber-100 text-amber-700',
    'Mocktail': 'bg-blue-100 text-blue-700',
    'Continental': 'bg-emerald-100 text-emerald-700',
  };

  const badgeColor = categoryColors[item.category] || 'bg-gray-100 text-gray-700';

  return (
    <div className="
      group bg-white rounded-2xl p-5 shadow-sm border border-slate-100
      hover:shadow-xl hover:border-slate-200 transition-all duration-300
      flex flex-col h-full
    ">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
          {item.category}
        </span>
        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium bg-slate-50 px-2 py-1 rounded-full">
          <span>⏱️</span>
          <span>{item.prepTime}m</span>
        </div>
      </div>

      {/* Item info */}
      <div className="mb-6 flex-grow">
        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">
          {item.name}
        </h3>
        <div className="text-2xl font-black text-slate-900">
          <span className="text-sm align-top text-slate-400 font-medium mr-1">₹</span>
          {item.price}
        </div>
      </div>

      {/* Quantity controls */}
      <div className="mt-auto">
        {quantity === 0 ? (
          <button
            onClick={onAdd}
            className="
              w-full py-3 px-4 rounded-xl
              bg-slate-900 text-white font-semibold
              shadow-lg shadow-slate-900/10
              hover:bg-amber-600 hover:shadow-amber-500/20
              transition-all duration-300 active:scale-95
              flex items-center justify-center gap-2
            "
          >
            <span>Add to Order</span>
            <span className="text-xs opacity-60 bg-white/20 px-1.5 py-0.5 rounded ml-1">
              +
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <button
              onClick={onRemove}
              className="
                w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200
                text-slate-600 font-bold text-lg
                hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200
                transition-all active:scale-90 flex items-center justify-center
              "
            >
              −
            </button>
            <span className="text-lg font-black text-slate-900 w-8 text-center">{quantity}</span>
            <button
              onClick={onAdd}
              className="
                w-10 h-10 rounded-lg bg-slate-900 shadow-md text-white font-bold text-lg
                hover:bg-amber-600 hover:shadow-amber-500/30
                transition-all active:scale-90 flex items-center justify-center
              "
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
