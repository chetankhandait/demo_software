// Main App Component
// Sets up routing and wraps the app with RestaurantProvider

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { CustomerOrder } from './pages/CustomerOrder';
import { KitchenDashboard } from './pages/KitchenDashboard';
import { HostDashboard } from './pages/HostDashboard';
import { CleaningView } from './pages/CleaningView';

function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        <Routes>
          {/* Host Dashboard - Main screen */}
          <Route path="/host" element={<HostDashboard />} />
          
          {/* Kitchen Dashboard - Chef view */}
          <Route path="/kitchen" element={<KitchenDashboard />} />
          
          {/* Customer Order Screen - QR scanned route */}
          <Route path="/table/:tableId" element={<CustomerOrder />} />
          
          {/* Cleaning View */}
          <Route path="/cleaning" element={<CleaningView />} />
          
          {/* Redirect root to host dashboard */}
          <Route path="/" element={<Navigate to="/host" replace />} />
          
          {/* Catch all - redirect to host */}
          <Route path="*" element={<Navigate to="/host" replace />} />
        </Routes>
      </BrowserRouter>
    </RestaurantProvider>
  );
}

export default App;
