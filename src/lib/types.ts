export type Role = 'farmer' | 'officer' | 'ledger';

export type TenancyStatus = 'owner' | 'tenant';

export type VerificationStage =
  | 'Created'
  | 'AIScreened'
  | 'OfficerApproved'
  | 'OfficerRejected'
  | 'TenancyProofRequested'
  | 'DisbursementInitiated';

export type ApplicationStatus =
  | 'FastTrackApproved'
  | 'HighRiskFlagged'
  | 'TenancyVerificationRequired'
  | 'PendingReview'
  | 'Approved'
  | 'Rejected'
  | 'TenancyProofRequested'
  | 'Disbursed';

export interface TrustBadge {
  key: string;
  label: string;
  status: 'verified' | 'pending' | 'failed';
}

export interface SignalBreakdown {
  duplicateBankRisk: number;
  landOverlap: number;
  yieldConsistency: number;
  cropWeatherAlignment: number;
}

export interface Application {
  id: string;
  farmerName: string;
  credentialId: string;
  district: string;
  tenancyStatus: TenancyStatus;
  maskedBank: string;
  scheme: string;
  cropType: string;
  acreage: number;
  damagePct: number;
  hasGeoEvidence: boolean;
  eligibilityScore: number;
  fraudRiskScore: number;
  status: ApplicationStatus;
  signals: SignalBreakdown;
  badges: TrustBadge[];
  reasoning: string[];
  hash: string;
  createdAt: number;
  actorAddress: string;
}

export interface LedgerBlock {
  index: number;
  timestamp: number;
  applicationHash: string;
  stage: VerificationStage;
  actorAddress: string;
  prevHash: string;
  blockHash: string;
}

export interface VerificationStep {
  label: string;
  detail: string;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  farmerName: string;
  credentialId: string;
  district: string;
  tenancyStatus: TenancyStatus;
  maskedBank: string;
  scheme: string;
  cropType: string;
  acreage: number;
  damagePct: number;
  hasGeoEvidence: boolean;
  signals: SignalBreakdown;
  badges: TrustBadge[];
  eligibilityScore: number;
  fraudRiskScore: number;
  expectedStatus: ApplicationStatus;
  reasoning: string[];
}
