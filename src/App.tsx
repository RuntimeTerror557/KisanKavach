import { useState, useCallback } from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { TopBar } from '@/components/TopBar';
import { FarmerPortal } from '@/components/farmer/FarmerPortal';
import { OfficerDesk } from '@/components/officer/OfficerDesk';
import { AuditLedger } from '@/components/ledger/AuditLedger';
import type { ScenarioPreset } from '@/lib/types';

interface PresetSignal {
  preset: ScenarioPreset;
  nonce: number;
}

function RoleView() {
  const { role, setRole } = useApp();
  const [signal, setSignal] = useState<PresetSignal | null>(null);

  const handlePreset = useCallback((p: ScenarioPreset) => {
    setSignal({ preset: p, nonce: Date.now() });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar onPreset={handlePreset} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {role === 'farmer' && <FarmerPortal presetSignal={signal} />}
        {role === 'officer' && <OfficerDesk />}
        {role === 'ledger' && <AuditLedger />}
      </main>
      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-slate-400 sm:px-6">
        KisanKavach — AI Trust &amp; Verification Layer for Agricultural Farmer Benefits · Simulated blockchain ledger · No real personal data stored
      </footer>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <RoleView />
    </AppProvider>
  );
}

export default App;
