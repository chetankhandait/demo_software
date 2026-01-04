// Cleaning View
// Route: /cleaning
// Shows tables that need cleaning with "Mark Cleaned" action

import { Layout } from '../components/Layout';
import { useRestaurant } from '../context/RestaurantContext';
import { TableStatus } from '../types';
import { Link } from 'react-router-dom';

export function CleaningView() {
  const { state, dispatch } = useRestaurant();

  // Get tables that need cleaning
  const cleaningTables = state.tables.filter(t => t.status === TableStatus.CLEANING);

  // Handle mark cleaned action
  const handleMarkCleaned = (tableId: string) => {
    dispatch({ type: 'MARK_CLEANED', payload: { tableId } });
  };

  return (
    <Layout title="Cleaning Queue">
      {/* Back to Host Dashboard */}
      <div className="mb-6">
        <Link
          to="/host"
          className="
            inline-flex items-center gap-2 px-4 py-2
            bg-gray-100 text-gray-700 rounded-lg
            hover:bg-gray-200 transition-colors
          "
        >
          ← Back to Host Dashboard
        </Link>
      </div>

      {cleaningTables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 border border-slate-200 border-dashed rounded-3xl">
          <div className="text-8xl mb-6 opacity-30">✨</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            All Tables are Clean!
          </h2>
          <p className="text-slate-500">
            Great job! No tables currently require cleaning.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cleaningTables.map(table => (
            <div
              key={table.id}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-lg mb-2">
                    Needs Action
                  </span>
                  <div className="text-4xl font-black text-slate-800">
                    Table {table.number}
                  </div>
                </div>
                <div className="text-3xl animate-pulse-slow">🧹</div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm text-slate-600">
                <p className="mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Sanitize table surface
                </p>
                <p className="mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Reset cutlery & napkins
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Floor check
                </p>
              </div>

              <button
                onClick={() => handleMarkCleaned(table.id)}
                className="
                  w-full py-3 px-4 rounded-xl
                  bg-emerald-500 hover:bg-emerald-600 
                  text-white font-bold shadow-lg shadow-emerald-500/20
                  transition-all active:scale-95 flex items-center justify-center gap-2
                "
              >
                <span>✨ Mark as Cleaned</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cleaning Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">🧹 Cleaning Checklist</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Clear all dishes and utensils</li>
          <li>• Wipe down table surface</li>
          <li>• Replace napkins and condiments</li>
          <li>• Check chairs and floor area</li>
          <li>• Mark as cleaned when ready for next guest</li>
        </ul>
      </div>
    </Layout>
  );
}
