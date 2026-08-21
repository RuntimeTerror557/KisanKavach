import { useState, useEffect, useRef } from 'react';
import {
  User, MapPin, Landmark, Banknote, Sprout, Ruler, CloudRain,
  Upload, CheckCircle2, ArrowRight, ArrowLeft, Loader2, ShieldCheck,
  AlertTriangle, FileCheck2, XCircle, RotateCcw, Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card, Button, Badge, Progress, StatusBadge } from '@/components/ui';
import { PRESETS, SCHEMES, CROPS, DISTRICTS } from '@/lib/mockData';
import { simulateHash, actorAddress, useApp } from '@/lib/store';
import { VERIFICATION_STEPS, EMPTY_FORM, presetToForm, type FarmerFormState } from '@/lib/farmerForm';
import type { Application, ScenarioPreset, TrustBadge } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PresetSignal {
  preset: ScenarioPreset;
  nonce: number;
}

export function FarmerPortal({ presetSignal }: { presetSignal: PresetSignal | null }) {
  const [form, setForm] = useState<FarmerFormState>(EMPTY_FORM);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [verifying, setVerifying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<Application | null>(null);
  const { addApplication } = useApp();
  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    if (presetSignal) {
      setForm(presetToForm(presetSignal.preset));
      setStep(1);
      setResult(null);
      setVerifying(false);
      setStepIdx(0);
    }
  }, [presetSignal]);

  const set = <K extends keyof FarmerFormState>(k: K, v: FarmerFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canStep1 = form.farmerName && form.credentialId && form.district && form.maskedBank;
  const canStep2 = form.scheme && form.cropType && form.acreage && form.damagePct;

  function runVerification() {
    setVerifying(true);
    setStepIdx(0);
    setResult(null);
  }

  useEffect(() => {
    if (!verifying) return;
    if (stepIdx >= VERIFICATION_STEPS.length) {
      // compute result
      const presetMatch = PRESETS.find(
        (p) => p.credentialId === formRef.current.credentialId
      );
      const base = presetMatch ?? PRESETS[0];
      const created = Date.now();
      const hash = simulateHash(formRef.current.credentialId + formRef.current.scheme + created);
      const app: Application = {
        id: 'APP-' + Math.floor(1000 + Math.random() * 9000),
        farmerName: formRef.current.farmerName,
        credentialId: formRef.current.credentialId,
        district: formRef.current.district,
        tenancyStatus: formRef.current.tenancyStatus,
        maskedBank: formRef.current.maskedBank,
        scheme: formRef.current.scheme,
        cropType: formRef.current.cropType,
        acreage: parseFloat(formRef.current.acreage) || 0,
        damagePct: parseFloat(formRef.current.damagePct) || 0,
        hasGeoEvidence: formRef.current.hasGeoEvidence,
        eligibilityScore: base.eligibilityScore,
        fraudRiskScore: base.fraudRiskScore,
        status: base.expectedStatus,
        signals: base.signals,
        badges: base.badges,
        reasoning: base.reasoning,
        hash,
        createdAt: created,
        actorAddress: actorAddress(formRef.current.credentialId),
      };
      setResult(app);
      addApplication(app);
      setVerifying(false);
      setStep(3);
      if (app.status === 'FastTrackApproved') {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#34d399', '#6ee7b7'] });
      }
      return;
    }
    const t = setTimeout(() => setStepIdx((i) => i + 1), 1100);
    return () => clearTimeout(t);
  }, [verifying, stepIdx, addApplication]);

  function reset() {
    setForm(EMPTY_FORM);
    setStep(1);
    setResult(null);
    setVerifying(false);
    setStepIdx(0);
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {[
          { n: 1, label: 'Profile' },
          { n: 2, label: 'Claim' },
          { n: 3, label: 'Result' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                step >= (s.n as 1 | 2 | 3)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              )}
            >
              {step > (s.n as 1 | 2 | 3) ? <CheckCircle2 className="h-4 w-4" /> : s.n}
            </div>
            <span className="ml-1.5 text-xs font-medium text-slate-600">{s.label}</span>
            {i < 2 && <div className="mx-2 h-px w-8 bg-slate-200" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card className="p-6">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Profile & Credentials</h2>
          <p className="mb-5 text-sm text-slate-500">Tell us about you and your farming identity.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field icon={User} label="Farmer Name">
              <input className={inputCls} value={form.farmerName} onChange={(e) => set('farmerName', e.target.value)} placeholder="e.g. Ramesh Pawar" />
            </Field>
            <Field icon={FileCheck2} label="Farmer Credential ID">
              <input className={inputCls} value={form.credentialId} onChange={(e) => set('credentialId', e.target.value)} placeholder="KR-2019-XXXXXXX" />
            </Field>
            <Field icon={MapPin} label="Location / District">
              <select className={inputCls} value={form.district} onChange={(e) => set('district', e.target.value)}>
                <option value="">Select district…</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field icon={Banknote} label="Masked Bank Account">
              <input className={inputCls} value={form.maskedBank} onChange={(e) => set('maskedBank', e.target.value)} placeholder="HDFC••••1234" />
            </Field>
            <Field icon={Landmark} label="Land Ownership vs. Tenancy" full>
              <div className="flex gap-2">
                {(['owner', 'tenant'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => set('tenancyStatus', t)}
                    className={cn(
                      'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                      form.tenancyStatus === t
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    )}
                  >
                    {t === 'owner' ? 'Land Owner' : 'Tenant / Sharecropper'}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!canStep1}>
              Continue to Claim <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Benefit / Claim Submission</h2>
          <p className="mb-5 text-sm text-slate-500">Tell us about the crop damage and the scheme you're claiming under.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field icon={ShieldCheck} label="Scheme" full>
              <select className={inputCls} value={form.scheme} onChange={(e) => set('scheme', e.target.value)}>
                <option value="">Select scheme…</option>
                {SCHEMES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field icon={Sprout} label="Crop Type">
              <select className={inputCls} value={form.cropType} onChange={(e) => set('cropType', e.target.value)}>
                <option value="">Select crop…</option>
                {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field icon={Ruler} label="Claimed Acreage">
              <input type="number" step="0.1" className={inputCls} value={form.acreage} onChange={(e) => set('acreage', e.target.value)} placeholder="1.8" />
            </Field>
            <Field icon={CloudRain} label="Damage Percentage (%)">
              <input type="number" className={inputCls} value={form.damagePct} onChange={(e) => set('damagePct', e.target.value)} placeholder="42" />
            </Field>
            <Field icon={Upload} label="Geotagged Plot Evidence" full>
              <button
                onClick={() => set('hasGeoEvidence', !form.hasGeoEvidence)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 text-sm transition-all',
                  form.hasGeoEvidence
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                )}
              >
                {form.hasGeoEvidence ? <CheckCircle2 className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                {form.hasGeoEvidence ? 'Geotagged plot evidence attached (simulated)' : 'Click to attach geotagged plot evidence (simulated)'}
              </button>
            </Field>
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button variant="success" onClick={runVerification} disabled={!canStep2}>
              <ShieldCheck className="h-4 w-4" /> Submit & Verify
            </Button>
          </div>

          {verifying && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                KisanKavach verification in progress…
              </div>
              <div className="space-y-3">
                {VERIFICATION_STEPS.map((s, i) => {
                  const done = i < stepIdx;
                  const active = i === stepIdx;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : active ? (
                          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-slate-200" />
                        )}
                      </div>
                      <div>
                        <div className={cn('text-sm font-medium', done ? 'text-slate-700' : active ? 'text-slate-700' : 'text-slate-400')}>
                          {s.label}
                        </div>
                        {(done || active) && <div className="text-xs text-slate-400">{s.detail}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      )}

      {step === 3 && result && (
        <ResultCard app={result} onReset={reset} />
      )}
    </div>
  );
}

function ResultCard({ app, onReset }: { app: Application; onReset: () => void }) {
  const isApproved = app.status === 'FastTrackApproved';
  const isFlagged = app.status === 'HighRiskFlagged';
  const isTenancy = app.status === 'TenancyVerificationRequired';

  return (
    <div className="space-y-4">
      <Card className={cn('overflow-hidden p-0', isApproved && 'ring-2 ring-emerald-400', isFlagged && 'ring-2 ring-rose-400', isTenancy && 'ring-2 ring-amber-400')}>
        {/* Header band */}
        <div className={cn(
          'px-6 py-5 text-white',
          isApproved && 'bg-gradient-to-r from-emerald-500 to-emerald-700',
          isFlagged && 'bg-gradient-to-r from-rose-500 to-rose-700',
          isTenancy && 'bg-gradient-to-r from-amber-500 to-amber-600'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isApproved && <CheckCircle2 className="h-8 w-8" />}
              {isFlagged && <AlertTriangle className="h-8 w-8" />}
              {isTenancy && <ShieldCheck className="h-8 w-8" />}
              <div>
                <div className="text-lg font-semibold">
                  {isApproved && 'Fast-Track Approved'}
                  {isFlagged && 'High-Risk Flagged'}
                  {isTenancy && 'Tenancy Verification Required'}
                </div>
                <div className="text-sm text-white/80">
                  {isApproved && 'Your claim has been auto-approved and routed for disbursement.'}
                  {isFlagged && 'This claim has been flagged for human officer review due to fraud signals.'}
                  {isTenancy && 'Ownership not found, but cultivation verified — routing to alternative tenant verification.'}
                </div>
              </div>
            </div>
            <Sparkles className="h-6 w-6 opacity-50" />
          </div>
        </div>

        <div className="p-6">
          {/* Scores */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Eligibility Score</div>
              <div className="mt-1 flex items-end justify-between">
                <span className="text-3xl font-bold text-emerald-600">{app.eligibilityScore}%</span>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <Progress value={app.eligibilityScore} variant="success" className="mt-2" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Fraud Risk Score</div>
              <div className="mt-1 flex items-end justify-between">
                <span className={cn('text-3xl font-bold', app.fraudRiskScore > 50 ? 'text-rose-600' : 'text-emerald-600')}>{app.fraudRiskScore}%</span>
                {app.fraudRiskScore > 50 ? <AlertTriangle className="h-5 w-5 text-rose-500" /> : <ShieldCheck className="h-5 w-5 text-emerald-500" />}
              </div>
              <Progress value={app.fraudRiskScore} variant={app.fraudRiskScore > 50 ? 'danger' : 'success'} className="mt-2" />
            </div>
          </div>

          {/* Trust badges */}
          <div className="mb-5">
            <div className="mb-2 text-sm font-semibold text-slate-700">Kisan Trust Profile</div>
            <div className="flex flex-wrap gap-2">
              {app.badges.map((b: TrustBadge) => (
                <Badge
                  key={b.key}
                  variant={b.status === 'verified' ? 'success' : b.status === 'failed' ? 'danger' : 'warning'}
                  dot
                >
                  {b.status === 'verified' && <CheckCircle2 className="h-3 w-3" />}
                  {b.status === 'failed' && <XCircle className="h-3 w-3" />}
                  {b.status === 'pending' && <AlertTriangle className="h-3 w-3" />}
                  {b.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Reasoning */}
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="mb-2 text-sm font-semibold text-slate-700">Why this decision?</div>
            <ul className="space-y-1.5">
              {app.reasoning.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Hash */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Application Hash (anchored to ledger)</div>
              <div className="font-mono text-xs text-emerald-400">{app.hash.slice(0, 32)}…</div>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className="mt-5 flex justify-end">
            <Button variant="secondary" onClick={onReset}>
              <RotateCcw className="h-4 w-4" /> Submit Another Claim
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-colors';

function Field({
  icon: Icon,
  label,
  children,
  full,
}: {
  icon: typeof User;
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn(full && 'sm:col-span-2')}>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        {label}
      </label>
      {children}
    </div>
  );
}
