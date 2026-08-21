import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Application, LedgerBlock, Role, VerificationStage, ApplicationStatus } from './types';
import { seedApplications, buildLedgerFromApplications, simulateHash, actorAddress } from './mockData';

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  ledger: LedgerBlock[];
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  selectedApp: Application | null;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('farmer');
  const [applications, setApplications] = useState<Application[]>(() => seedApplications());
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const addApplication = useCallback((app: Application) => {
    setApplications((prev) => [app, ...prev]);
  }, []);

  const updateApplicationStatus = useCallback((id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }, []);

  const ledger = useMemo(() => buildLedgerFromApplications(applications), [applications]);

  const selectedApp = useMemo(
    () => applications.find((a) => a.id === selectedAppId) ?? null,
    [applications, selectedAppId]
  );

  const value: AppState = {
    role,
    setRole,
    applications,
    addApplication,
    updateApplicationStatus,
    ledger,
    selectedAppId,
    setSelectedAppId,
    selectedApp,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { simulateHash, actorAddress, buildLedgerFromApplications };
export type { Application, LedgerBlock, Role, VerificationStage, ApplicationStatus };
