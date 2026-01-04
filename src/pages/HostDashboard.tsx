// Host / Floor Dashboard
// Route: /host
// Shows grid of all tables with color-coded status, countdown timers, and "Customer Left" action

import { Layout } from '../components/Layout';
import { TableCard } from '../components/TableCard';
import { useRestaurant } from '../context/RestaurantContext';
import { TableStatus } from '../types';
import { Link } from 'react-router-dom';

export function HostDashboard() {
  const { state, dispatch } = useRestaurant();

  // Handle customer left action
  const handleCustomerLeft = (tableId: string) => {
    dispatch({ type: 'CUSTOMER_LEFT', payload: { tableId } });
  };

  // Count tables by status for summary
  const statusCounts = {
    free: state.tables.filter(t => t.status === TableStatus.FREE).length,
    occupied: state.tables.filter(t => t.status === TableStatus.OCCUPIED).length,
    cooking: state.tables.filter(t => t.status === TableStatus.COOKING).length,
    eating: state.tables.filter(t => t.status === TableStatus.EATING).length,
    almostFree: state.tables.filter(t => t.status === TableStatus.ALMOST_FREE).length,
    cleaning: state.tables.filter(t => t.status === TableStatus.CLEANING).length,
  };

  return (
    <Layout title="Host Dashboard">
      {/* Status Legend */}
      <div className="mb-8 glass rounded-3xl p-6">
        <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
          Table Status Legend
        </h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge color="bg-white border-emerald-200 shadow-emerald-500/10 text-emerald-700" dot="bg-emerald-500" label="Available" count={statusCounts.free} />
          <StatusBadge color="bg-amber-50 border-amber-200 shadow-amber-500/10 text-amber-900" dot="bg-amber-500" label="Occupied" count={statusCounts.occupied} />
          <StatusBadge color="bg-blue-50 border-blue-200 shadow-blue-500/10 text-blue-900" dot="bg-blue-500" label="Cooking" count={statusCounts.cooking} />
          <StatusBadge color="bg-orange-50 border-orange-200 shadow-orange-500/10 text-orange-900" dot="bg-orange-500" label="Eating" count={statusCounts.eating} />
          <StatusBadge color="bg-purple-50 border-purple-200 shadow-purple-500/10 text-purple-900" dot="bg-purple-500" label="Almost Free" count={statusCounts.almostFree} />
          <StatusBadge color="bg-slate-50 border-slate-200 shadow-slate-500/10 text-slate-600" dot="bg-slate-400" label="Needs Cleaning" count={statusCounts.cleaning} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Link
          to="/cleaning"
          className="
            flex-1 min-w-[200px] px-6 py-4 rounded-2xl font-bold
            bg-white border border-slate-200 text-slate-700
            hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg
            transition-all duration-300 group
          "
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">🧹</span>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Action Needed</div>
              <div>View Cleaning Queue ({statusCounts.cleaning})</div>
            </div>
          </div>
        </Link>
        <Link
          to="/kitchen"
          className="
            flex-1 min-w-[200px] px-6 py-4 rounded-2xl font-bold
            bg-white border border-slate-200 text-slate-700
            hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg
            transition-all duration-300 group
          "
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">👨‍🍳</span>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Monitor</div>
               <div>Kitchen Dashboard</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {state.tables.map(table => (
          <TableCard
            key={table.id}
            table={table}
            showActions={true}
            onCustomerLeft={() => handleCustomerLeft(table.id)}
          />
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <h3 className="relative z-10 text-xl font-bold mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>Pro Tips for Host</span>
        </h3>
        <div className="relative z-10 grid sm:grid-cols-2 gap-6 text-slate-300 text-sm font-medium">
          <ul className="space-y-3">
            <li className="flex gap-2">
              <span className="text-purple-400">•</span>
              <span><strong>Almost Free (Purple)</strong> tables have a countdown timer indicating customers have finished eating.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">•</span>
              <span>Click <strong>"Mark Completed"</strong> promptly when guests leave to notify cleaning staff.</span>
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span><strong>Cleaning</strong> tables should be cleared within 5 minutes to maximize turnover.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">•</span>
              <span>Keep an eye on the <strong>Kitchen Dashboard</strong> to anticipate food delivery times.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
        <h3 className="font-semibold text-orange-800 mb-2">🎮 Demo Mode</h3>
        <p className="text-sm text-orange-700">
          To simulate a customer order, click "Demo Order" in the navigation bar or visit{' '}
          <code className="bg-orange-100 px-1 rounded">/table/1</code> through{' '}
          <code className="bg-orange-100 px-1 rounded">/table/10</code>
        </p>
      </div>
    </Layout>
  );
}

// Helper component for status badges in legend
const StatusBadge = ({ color, dot, label, count }: { color: string; dot: string; label: string; count: number }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${color} text-xs font-bold uppercase tracking-wider`}>
    <span className={`w-2 h-2 rounded-full ${dot}`} />
    <span>{label}: {count}</span>
  </div>
);

