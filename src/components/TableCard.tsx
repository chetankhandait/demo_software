// TableCard Component
// Displays a table with its status, color-coded badge, and countdown timer
// Used in Host Dashboard and Cleaning View

import { TableStatus } from '../types';
import type { Table } from '../types';
import { Timer } from './Timer';
import { useRestaurant } from '../context/RestaurantContext';

interface TableCardProps {
  table: Table;
  showActions?: boolean;
  onCustomerLeft?: () => void;
}

// Color mapping for each table status
const statusColors: Record<TableStatus, { bg: string; text: string; badge: string; border: string; glow: string }> = {
  [TableStatus.FREE]: {
    bg: 'bg-white',
    text: 'text-slate-800',
    badge: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-200',
    glow: 'shadow-emerald-500/10',
  },
  [TableStatus.OCCUPIED]: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    badge: 'bg-amber-200 text-amber-800',
    border: 'border-amber-200',
    glow: 'shadow-amber-500/20',
  },
  [TableStatus.COOKING]: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    badge: 'bg-blue-200 text-blue-800',
    border: 'border-blue-200',
    glow: 'shadow-blue-500/20',
  },
  [TableStatus.EATING]: {
    bg: 'bg-orange-50',
    text: 'text-orange-900',
    badge: 'bg-orange-200 text-orange-800',
    border: 'border-orange-200',
    glow: 'shadow-orange-500/20',
  },
  [TableStatus.ALMOST_FREE]: {
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    badge: 'bg-purple-200 text-purple-800',
    border: 'border-purple-200',
    glow: 'shadow-purple-500/20',
  },
  [TableStatus.CLEANING]: {
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    badge: 'bg-slate-200 text-slate-700',
    border: 'border-slate-200',
    glow: 'shadow-slate-500/10',
  },
};

// Human-readable status labels
const statusLabels: Record<TableStatus, string> = {
  [TableStatus.FREE]: 'Available',
  [TableStatus.OCCUPIED]: 'Occupied',
  [TableStatus.COOKING]: 'Cooking',
  [TableStatus.EATING]: 'Eating',
  [TableStatus.ALMOST_FREE]: 'Almost Free',
  [TableStatus.CLEANING]: 'Needs Cleaning',
};

export function TableCard({ table, showActions = false, onCustomerLeft }: TableCardProps) {
  const { dispatch } = useRestaurant();
  const colors = statusColors[table.status];

  // Handle timer expiration - move table to CLEANING
  const handleTimerExpire = () => {
    dispatch({ type: 'CUSTOMER_LEFT', payload: { tableId: table.id } });
  };

  return (
    <div
      className={`
        relative group overflow-hidden
        ${colors.bg} ${colors.text} border ${colors.border}
        rounded-2xl p-6 shadow-xl ${colors.glow}
        transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
        min-h-[220px] flex flex-col justify-between
      `}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-current opacity-[0.03] group-hover:scale-150 transition-transform duration-700 ease-out" />

      {/* Table Number & Status */}
      <div className="relative z-10 flex flex-col items-center">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${colors.badge}`}>
          {statusLabels[table.status]}
        </span>
        <div className="text-5xl font-black mb-2 tracking-tighter opacity-90">T{table.number}</div>
      </div>

      {/* Timer for ALMOST_FREE status */}
      {table.status === TableStatus.ALMOST_FREE && table.almostFreeEndTime && (
        <div className="relative z-10 flex flex-col items-center mt-2">
          <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">
            Time Remaining
          </div>
          <div className="bg-white/50 backdrop-blur-sm px-4 py-1 rounded-lg">
            <Timer
              endTime={table.almostFreeEndTime}
              onExpire={handleTimerExpire}
              className="text-3xl font-mono font-bold tracking-tight text-purple-900"
            />
          </div>
        </div>
      )}

      {/* Customer Left button for EATING and ALMOST_FREE */}
      {showActions && (table.status === TableStatus.EATING || table.status === TableStatus.ALMOST_FREE) && (
        <button
          onClick={onCustomerLeft}
          className="
            relative z-10 mt-4 w-full py-2.5 px-4 rounded-xl
            bg-white shadow-sm border border-slate-200
            hover:bg-slate-50 hover:shadow-md hover:border-slate-300
            text-slate-700 font-semibold text-sm
            transition-all duration-200 active:scale-95
          "
        >
          Mark Completed
        </button>
      )}
    </div>
  );
}
