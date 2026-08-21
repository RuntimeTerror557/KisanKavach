import { ShieldCheck, Tractor, Landmark, Link2, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';
import { PRESETS } from '@/lib/mockData';
import type { Role, ScenarioPreset } from '@/lib/types';

const roles: { id: Role; label: string; icon: typeof Tractor }[] = [
  { id: 'farmer', label: 'Farmer Portal', icon: Tractor },
  { id: 'officer', label: 'Officer Review Desk', icon: Landmark },
  { id: 'ledger', label: 'Immutable Audit Ledger', icon: Link2 },
];

export function TopBar({ onPreset }: { onPreset: (p: ScenarioPreset) => void }) {
  const { role, setRole } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight text-slate-900">
                KisanKavach
              </div>
              <div className="hidden text-[11px] text-slate-500 sm:block">
                Right Farmer. Right Benefit. Right Time.
              </div>
            </div>
          </div>

          {/* Role switcher */}
          <nav className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm',
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{r.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Scenario selector bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1">
          <div className="flex shrink-0 items-center gap-1.5 pr-1 text-xs font-medium text-slate-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quick Scenario:</span>
          </div>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onPreset(p)}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
