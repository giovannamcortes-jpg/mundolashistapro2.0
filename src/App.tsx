/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { AdminPanel } from './components/AdminPanel';
import { LashistaPanel } from './components/LashistaPanel';
import { ClientBookingPage } from './components/ClientBookingPage';
import { SupportChatbot } from './components/SupportChatbot';

const AppContent: React.FC = () => {
  const { currentRole, setCurrentRole } = useApp();
  const [bookingLashId, setBookingLashId] = useState<string | null>(null);

  // Check query parameters on mount or when location changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingParam = params.get('booking');
    if (bookingParam) {
      setBookingLashId(bookingParam);
    }
  }, []);

  if (bookingLashId) {
    return (
      <ClientBookingPage 
        lashistaId={bookingLashId} 
        onClose={() => {
          // Clean up search query param smoothly
          const url = new URL(window.location.href);
          url.searchParams.delete('booking');
          window.history.replaceState({}, '', url.pathname + url.search);
          setBookingLashId(null);
        }} 
      />
    );
  }

  return (
    <>
      {(() => {
        switch (currentRole) {
          case 'admin':
            return <AdminPanel />;
          case 'lashista':
            return <LashistaPanel />;
          case 'public':
          default:
            return <LandingPage />;
        }
      })()}
      <SupportChatbot />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
