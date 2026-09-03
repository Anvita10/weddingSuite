import { useState } from 'react';
import { getStoredCode, clearStoredCode } from './adminApi.js';
import AdminLogin from './AdminLogin.jsx';
import EnquiriesTab from './EnquiriesTab.jsx';
import CalendarTab from './CalendarTab.jsx';
import RatesTab from './RatesTab.jsx';

const TABS = [
  { key: 'enquiries', label: 'Enquiries' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'rates', label: 'Rates' },
];

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(!!getStoredCode());
  const [tab, setTab] = useState('enquiries');

  if (!loggedIn) {
    return <AdminLogin onSuccess={() => setLoggedIn(true)} />;
  }

  function handleLogout() {
    clearStoredCode();
    setLoggedIn(false);
  }

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-line bg-card px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <p className="font-display text-base font-bold">The Grand Aranya</p>
            <p className="text-xs text-espresso/50">Wedding Sales Dashboard</p>
          </div>
          <button onClick={handleLogout} className="text-xs font-semibold text-espresso/50 hover:text-espresso">
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
        <div className="mb-6 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                tab === t.key ? 'bg-espresso text-ivory' : 'bg-card text-espresso/60 border border-line'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'enquiries' && <EnquiriesTab />}
        {tab === 'calendar' && <CalendarTab />}
        {tab === 'rates' && <RatesTab />}
      </div>
    </div>
  );
}
