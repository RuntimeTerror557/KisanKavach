import { useMemo, useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Inbox, Zap, ShieldAlert, Users, Search, X, CheckCircle2,
  XCircle, FileQuestion, Link2, AlertTriangle, Lightbulb,
} from 'lucide-react';
import { Card, Button, Badge, Progress, StatusBadge } from '@/components/ui';
import { useApp } from '@/lib/store';
import type { Application, ApplicationStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'flagged' | 'tenancy' | 'approved';

export function OfficerDesk() {
  const { applications, updateApplicationStatus } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [inspectId, setInspectId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const kpis = useMemo(() => {
    const total = applications.length;
    const disbursed = applications.filter((a) => a.status === 'FastTrackApproved' || a.status === 'Disbursed').length;
    const flagged = applications.filter((a) => a.status === 'HighRiskFlagged' || a.status === 'Rejected').length;
    const tenancy = applications.filter((a) => a.status === 'TenancyVerificationRequired' || a.status === 'TenancyProofRequested').length;
    return { total, disbursed, flagged, tenancy };
  }, [applications]);

  const filtered = useMemo(() => {
    let list = applications;
    if (filter === 'flagged') list = list.filter((a) => a.status === 'HighRiskFlagged' || a.status === 'Rejected');
    if (filter === 'tenancy') list = list.filter((a) => a.status === 'TenancyVerificationRequired' || a.status === 'TenancyProofRequested');
    if (filter === 'approved') list = list.filter((a) => a.status === 'FastTrackApproved' || a.status === 'Disbursed' || a.status === 'Approved');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.farmerName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.credentialId.toLowerCase().includes(q));
    }
    return list;
  }, [applications, filter, search]);

  const inspectApp = applications.find((a) => a.id === inspectId) ?? null;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={Inbox} label="Total Applications" value={kpis.total} tone="slate" />
        <Kpi icon={Zap} label="Fast-Track Disbursed" value={kpis.disbursed} tone="emerald" />
        <Kpi icon={ShieldAlert} label="Flagged / Fraud" value={kpis.flagged} tone="rose" />
        <Kpi icon={Users} label="Tenancy Inclusions Pending" value={kpis.tenancy} tone="amber" />
      </div>

      {/* Queue */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Application Queue</h2>
            <Badge variant="neutral">{filtered.length}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search farmer, ID…"
                className="w-44 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {([
                { id: 'all', label: 'All' },
                { id: 'flagged', label: 'Flagged' },
                { id: 'tenancy', label: 'Tenancy' },
                { id: 'approved', label: 'Approved' },
              ] as { id: Filter; label: string }[]).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    filter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">App ID</th>
                <th className="px-4 py-3">Farmer</th>
                <th className="px-4 py-3">Scheme</th>
                <th className="px-4 py-3">Eligibility</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{a.farmerName}</div>
                    <div className="text-xs text-slate-400">{a.district}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{a.scheme}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-9 text-xs font-semibold text-emerald-600">{a.eligibilityScore}%</span>
                      <Progress value={a.eligibilityScore} variant="success" className="w-16" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-9 text-xs font-semibold', a.fraudRiskScore > 50 ? 'text-rose-600' : 'text-emerald-600')}>{a.fraudRiskScore}%</span>
                      <Progress value={a.fraudRiskScore} variant={a.fraudRiskScore > 50 ? 'danger' : 'success'} className="w-16" />
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" onClick={() => setInspectId(a.id)}>
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">No applications match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {inspectApp && (
        <InspectDrawer
          app={inspectApp}
          onClose={() => setInspectId(null)}
          onAction={(status) => {
            updateApplicationStatus(inspectApp.id, status);
            setInspectId(null);
          }}
        />
      )}
    </div>
  );
}

function Kpi({
  icon: Icon, label, value, tone,
}: {
  icon: typeof Inbox; label: string; value: number; tone: 'slate' | 'emerald' | 'rose' | 'amber';
}) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    rose: 'bg-rose-100 text-rose-600',
    amber: 'bg-amber-100 text-amber-600',
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-2xl font-bold text-slate-800">{value}</span>
      </div>
      <div className="mt-2 text-xs font-medium text-slate-500">{label}</div>
    </Card>
  );
}

function InspectDrawer({
  app, onClose, onAction,
}: {
  app: Application;
  onClose: () => void;
  onAction: (status: ApplicationStatus) => void;
}) {
  const radarData = [
    { signal: 'Dup Bank Risk', value: app.signals.duplicateBankRisk },
    { signal: 'Land Overlap %', value: app.signals.landOverlap },
    { signal: 'Yield Consistency', value: app.signals.yieldConsistency },
    { signal: 'Crop-Weather', value: app.signals.cropWeatherAlignment },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <div className="text-xs font-medium text-slate-400">Application {app.id}</div>
            <div className="text-base font-semibold text-slate-900">{app.farmerName}</div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 p-3">
              <div className="text-xs text-emerald-600">Eligibility</div>
              <div className="text-xl font-bold text-emerald-700">{app.eligibilityScore}%</div>
            </div>
            <div className="rounded-xl bg-rose-50 p-3">
              <div className="text-xs text-rose-600">Fraud Risk</div>
              <div className="text-xl font-bold text-rose-700">{app.fraudRiskScore}%</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Credential ID" value={app.credentialId} />
            <Info label="District" value={app.district} />
            <Info label="Tenancy" value={app.tenancyStatus === 'owner' ? 'Land Owner' : 'Tenant'} />
            <Info label="Bank" value={app.maskedBank} />
            <Info label="Scheme" value={app.scheme} />
            <Info label="Crop" value={app.cropType} />
            <Info label="Acreage" value={`${app.acreage} acres`} />
            <Info label="Damage" value={`${app.damagePct}%`} />
          </div>

          {/* XAI Radar */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <AlertTriangle className="h-4 w-4 text-indigo-500" /> Explainable AI — Signal Breakdown
            </div>
            <Card className="p-3">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="signal" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Signal bars */}
          <div className="space-y-3">
            <SignalBar label="Duplicate Bank Account Risk" value={app.signals.duplicateBankRisk} danger />
            <SignalBar label="Land Overlap %" value={app.signals.landOverlap} danger />
            <SignalBar label="Historical Yield Consistency" value={app.signals.yieldConsistency} />
            <SignalBar label="Crop-Weather Alignment" value={app.signals.cropWeatherAlignment} />
          </div>

          {/* Reasoning */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-700">
              <Lightbulb className="h-4 w-4" /> Why was this flagged / recommended?
            </div>
            <ul className="space-y-1.5">
              {app.reasoning.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Hash */}
          <div className="rounded-xl bg-slate-900 p-3">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Application Hash</div>
            <div className="font-mono text-xs text-emerald-400 break-all">{app.hash}</div>
          </div>

          {/* Actions */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Human-in-the-loop decision</div>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="success" onClick={() => onAction('Disbursed')}>
                <CheckCircle2 className="h-4 w-4" /> Approve & Anchor to Ledger
              </Button>
              <Button variant="warning" onClick={() => onAction('TenancyProofRequested')}>
                <FileQuestion className="h-4 w-4" /> Request Tenancy Proof
              </Button>
              <Button variant="danger" onClick={() => onAction('Rejected')}>
                <XCircle className="h-4 w-4" /> Reject with Justification
              </Button>
            </div>
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
              <Link2 className="h-3 w-3" /> Every action is cryptographically anchored to the immutable audit ledger.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-sm font-medium text-slate-700">{value}</div>
    </div>
  );
}

function SignalBar({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className={cn('font-semibold', danger ? (value > 50 ? 'text-rose-600' : 'text-emerald-600') : (value > 70 ? 'text-emerald-600' : 'text-amber-600'))}>{value}%</span>
      </div>
      <Progress value={value} variant={danger ? (value > 50 ? 'danger' : 'success') : (value > 70 ? 'success' : 'warning')} />
    </div>
  );
}
