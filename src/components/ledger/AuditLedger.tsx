import { useMemo, useState } from 'react';
import {
  Search, Link2, ShieldCheck, Lock, Eye, EyeOff, CheckCircle2,
  FileEdit, FileCheck2, Banknote, XCircle, FileQuestion, Box,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useApp } from '@/lib/store';
import type { LedgerBlock, VerificationStage } from '@/lib/types';
import { cn } from '@/lib/utils';

const stageMeta: Record<VerificationStage, { icon: typeof Box; color: string; bg: string; ring: string; label: string }> = {
  Created: { icon: FileEdit, color: 'text-slate-600', bg: 'bg-slate-100', ring: 'ring-slate-300', label: 'Created' },
  AIScreened: { icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-100', ring: 'ring-indigo-300', label: 'AI Screened' },
  OfficerApproved: { icon: FileCheck2, color: 'text-emerald-600', bg: 'bg-emerald-100', ring: 'ring-emerald-300', label: 'Officer Approved' },
  OfficerRejected: { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-100', ring: 'ring-rose-300', label: 'Officer Rejected' },
  TenancyProofRequested: { icon: FileQuestion, color: 'text-amber-600', bg: 'bg-amber-100', ring: 'ring-amber-300', label: 'Tenancy Proof Requested' },
  DisbursementInitiated: { icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-100', ring: 'ring-emerald-300', label: 'Disbursement Initiated' },
};

export function AuditLedger() {
  const { ledger, applications } = useApp();
  const [query, setQuery] = useState('');
  const [showRaw, setShowRaw] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return ledger;
    const q = query.toLowerCase();
    return ledger.filter(
      (b) =>
        b.applicationHash.toLowerCase().includes(q) ||
        b.blockHash.toLowerCase().includes(q) ||
        b.stage.toLowerCase().includes(q) ||
        b.actorAddress.toLowerCase().includes(q)
    );
  }, [ledger, query]);

  const matchedApp = useMemo(() => {
    if (!query.trim()) return null;
    return applications.find(
      (a) => a.hash.toLowerCase().includes(query.toLowerCase()) || a.id.toLowerCase().includes(query.toLowerCase())
    ) ?? null;
  }, [query, applications]);

  return (
    <div className="space-y-5">
      {/* Privacy banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-slate-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800">Privacy-by-Design</div>
          <div className="text-sm text-slate-600">
            Zero raw sensitive personal identifiers are stored on-chain. Only cryptographic proofs, consent hashes, and lifecycle state changes are recorded.
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Verify by Application Hash, App ID, or Actor Address…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowRaw((v) => !v)}>
              {showRaw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showRaw ? 'Hide' : 'Show'} Raw Hashes
            </Button>
            <Badge variant="info" dot>{ledger.length} Blocks</Badge>
          </div>
        </div>
        {matchedApp && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Matched application <span className="font-semibold">{matchedApp.id}</span> — {matchedApp.farmerName} ({matchedApp.scheme})
          </div>
        )}
      </Card>

      {/* Chain timeline */}
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200" />
        <div className="space-y-3">
          {filtered.map((block) => (
            <BlockCard key={block.index} block={block} showRaw={showRaw} />
          ))}
          {filtered.length === 0 && (
            <Card className="p-8 text-center text-sm text-slate-400">
              No blocks found matching "{query}".
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function BlockCard({ block, showRaw }: { block: LedgerBlock; showRaw: boolean }) {
  const meta = stageMeta[block.stage];
  const Icon = meta.icon;
  const time = new Date(block.timestamp).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <div className="relative flex gap-4 pl-0">
      {/* node */}
      <div className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-2', meta.bg, meta.ring)}>
        <Icon className={cn('h-5 w-5', meta.color)} />
      </div>
      <Card className="flex-1 p-4 transition-all hover:shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-mono text-white">
              <Box className="h-3 w-3" /> #{block.index}
            </span>
            <Badge variant="info" dot>{meta.label}</Badge>
          </div>
          <span className="text-xs text-slate-400">{time}</span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          <HashField label="Application Hash" value={block.applicationHash} show={showRaw} />
          <HashField label="Block Hash" value={block.blockHash} show={showRaw} />
          <HashField label="Prev Hash" value={block.prevHash} show={showRaw} />
          <div>
            <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">Actor Address</div>
            <div className="font-mono text-slate-600">{showRaw ? block.actorAddress : block.actorAddress.slice(0, 14) + '…'}</div>
          </div>
        </div>

        {/* chain link indicator */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Link2 className="h-3 w-3" />
          Chained to block #{block.index - 1 >= 0 ? block.index - 1 : 'genesis'}
        </div>
      </Card>
    </div>
  );
}

function HashField({ label, value, show }: { label: string; value: string; show: boolean }) {
  return (
    <div>
      <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className="font-mono text-slate-600 break-all">{show ? value : value.slice(0, 24) + '…'}</div>
    </div>
  );
}
