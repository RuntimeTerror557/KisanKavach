import type { ScenarioPreset, Application, LedgerBlock, VerificationStage } from './types';

export const SCHEMES = [
  'PM-Fasal Bima (Crop Insurance)',
  'Crop Loss Relief (Natural Calamity)',
  'PM-Kisan Samman Nidhi',
  'Soil Health Card Subsidy',
];

export const CROPS = ['Wheat', 'Rice (Paddy)', 'Cotton', 'Sugarcane', 'Maize', 'Soybean'];

export const DISTRICTS = [
  'Satara, Maharashtra',
  'Latur, Maharashtra',
  'Indore, Madhya Pradesh',
  'Karnal, Haryana',
  'Warangal, Telangana',
];

export const PRESETS: ScenarioPreset[] = [
  {
    id: 'happy',
    label: 'Happy Path (Smallholder Landowner)',
    description: 'Owns 1.8 acres, Wheat, weather matched, 0% land overlap, unique bank account.',
    farmerName: 'Ramesh Pawar',
    credentialId: 'KR-2019-0048217',
    district: 'Satara, Maharashtra',
    tenancyStatus: 'owner',
    maskedBank: 'HDFC••••4921',
    scheme: 'PM-Fasal Bima (Crop Insurance)',
    cropType: 'Wheat',
    acreage: 1.8,
    damagePct: 42,
    hasGeoEvidence: true,
    signals: {
      duplicateBankRisk: 3,
      landOverlap: 0,
      yieldConsistency: 91,
      cropWeatherAlignment: 94,
    },
    badges: [
      { key: 'bank', label: 'Bank Verified', status: 'verified' },
      { key: 'cultivation', label: 'Cultivation Verified', status: 'verified' },
      { key: 'cropHistory', label: 'Crop History Match', status: 'verified' },
      { key: 'tenancy', label: 'Land Ownership Confirmed', status: 'verified' },
    ],
    eligibilityScore: 94,
    fraudRiskScore: 4,
    expectedStatus: 'FastTrackApproved',
    reasoning: [
      'Bank account is unique — not linked to any prior claims in the registry.',
      'Satellite boundary overlay shows 0% overlap with neighbouring registered parcels.',
      'Reported crop (Wheat) matches the seasonal sowing window and historical pattern for Satara district.',
      'Weather records confirm unseasonal rainfall consistent with the reported 42% damage.',
    ],
  },
  {
    id: 'fraud',
    label: 'Sybil / Fraud Attempt (Duplicate Parcel & Bank)',
    description: 'Claims 5.5 acres, bank linked to 3 prior claims, 78% land parcel overlap.',
    farmerName: 'Anil Deshmukh',
    credentialId: 'KR-2017-0091302',
    district: 'Latur, Maharashtra',
    tenancyStatus: 'owner',
    maskedBank: 'SBI••••1180',
    scheme: 'Crop Loss Relief (Natural Calamity)',
    cropType: 'Soybean',
    acreage: 5.5,
    damagePct: 60,
    hasGeoEvidence: true,
    signals: {
      duplicateBankRisk: 88,
      landOverlap: 78,
      yieldConsistency: 52,
      cropWeatherAlignment: 61,
    },
    badges: [
      { key: 'bank', label: 'Bank Linked to 3 Prior Claims', status: 'failed' },
      { key: 'cultivation', label: 'Cultivation Overlap Detected', status: 'failed' },
      { key: 'cropHistory', label: 'Yield Inconsistency', status: 'failed' },
      { key: 'tenancy', label: 'Land Ownership Disputed', status: 'pending' },
    ],
    eligibilityScore: 12,
    fraudRiskScore: 88,
    expectedStatus: 'HighRiskFlagged',
    reasoning: [
      'Bank account SBI••••1180 is linked to 3 prior disbursed claims under different farmer IDs — classic Sybil duplication signal.',
      'Satellite boundary overlay shows 78% overlap with an already-registered parcel owned by a different farmer.',
      'Reported acreage (5.5) is 3.2x the district median for this scheme — statistically anomalous.',
      'Crop-weather alignment is low: no corroborating weather event for the claimed damage window.',
    ],
  },
  {
    id: 'tenant',
    label: 'Tenant Farmer Inclusion (Social Impact Hero)',
    description: 'Landless tenant farmer, cultivation evidence present, crop/weather matched, 0 fraud flags.',
    farmerName: 'Sunita Kale',
    credentialId: 'KR-2021-0077551',
    district: 'Indore, Madhya Pradesh',
    tenancyStatus: 'tenant',
    maskedBank: 'CANARA••••3340',
    scheme: 'PM-Fasal Bima (Crop Insurance)',
    cropType: 'Cotton',
    acreage: 2.2,
    damagePct: 35,
    hasGeoEvidence: true,
    signals: {
      duplicateBankRisk: 2,
      landOverlap: 0,
      yieldConsistency: 84,
      cropWeatherAlignment: 89,
    },
    badges: [
      { key: 'bank', label: 'Bank Verified', status: 'verified' },
      { key: 'cultivation', label: 'Cultivation Evidence Present', status: 'verified' },
      { key: 'cropHistory', label: 'Crop History Match', status: 'verified' },
      { key: 'tenancy', label: 'Tenancy Proof Required', status: 'pending' },
    ],
    eligibilityScore: 78,
    fraudRiskScore: 6,
    expectedStatus: 'TenancyVerificationRequired',
    reasoning: [
      'No land ownership record found for this credential — traditional systems would exclude this farmer outright.',
      'However, geotagged cultivation evidence and 3-year crop history are consistent and fraud-free.',
      'Bank account is unique and weather data corroborates the reported damage.',
      'Recommended for Tenancy Inclusion Fallback: route to alternative tenant verification instead of rejection.',
    ],
  },
];

// Deterministic pseudo-SHA-256 (visual only — not cryptographic)
export function simulateHash(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ (c + 0x9e3779b9), 0x85ebca6b);
  }
  const a = (h1 >>> 0).toString(16).padStart(8, '0');
  const b = (h2 >>> 0).toString(16).padStart(8, '0');
  const c = (Math.imul(h1 ^ h2, 0xc2b2ae35) >>> 0).toString(16).padStart(8, '0');
  const d = (Math.imul(h2 ^ 0xdeadbeef, 0x27d4eb2f) >>> 0).toString(16).padStart(8, '0');
  return (a + b + c + d).padEnd(64, '0').slice(0, 64);
}

export function actorAddress(seed: string): string {
  return '0x' + simulateHash(seed).slice(0, 40);
}

const GENESIS_HASH = '0'.repeat(64);

export function buildLedgerFromApplications(apps: Application[]): LedgerBlock[] {
  const blocks: LedgerBlock[] = [];
  let prev = GENESIS_HASH;
  let index = 0;

  const sorted = [...apps].sort((a, b) => a.createdAt - b.createdAt);

  for (const app of sorted) {
    const stages: { stage: VerificationStage; time: number }[] = [
      { stage: 'Created', time: app.createdAt },
      { stage: 'AIScreened', time: app.createdAt + 1 },
    ];
    if (app.status === 'Approved' || app.status === 'Disbursed') {
      stages.push({ stage: 'OfficerApproved', time: app.createdAt + 2 });
    }
    if (app.status === 'Rejected') {
      stages.push({ stage: 'OfficerRejected', time: app.createdAt + 2 });
    }
    if (app.status === 'TenancyProofRequested') {
      stages.push({ stage: 'TenancyProofRequested', time: app.createdAt + 2 });
    }
    if (app.status === 'Disbursed') {
      stages.push({ stage: 'DisbursementInitiated', time: app.createdAt + 3 });
    }

    for (const { stage, time } of stages) {
      const content = `${app.hash}|${stage}|${time}|${prev}`;
      const blockHash = simulateHash(content);
      blocks.push({
        index,
        timestamp: time,
        applicationHash: app.hash,
        stage,
        actorAddress: app.actorAddress,
        prevHash: prev,
        blockHash,
      });
      prev = blockHash;
      index++;
    }
  }

  return blocks;
}

export function seedApplications(): Application[] {
  const now = Date.now();
  const presets = PRESETS;
  return presets.map((p, i) => {
    const created = now - (presets.length - i) * 1000 * 60 * 37;
    const hash = simulateHash(p.credentialId + p.scheme + created);
    return {
      id: 'APP-' + (1000 + i),
      farmerName: p.farmerName,
      credentialId: p.credentialId,
      district: p.district,
      tenancyStatus: p.tenancyStatus,
      maskedBank: p.maskedBank,
      scheme: p.scheme,
      cropType: p.cropType,
      acreage: p.acreage,
      damagePct: p.damagePct,
      hasGeoEvidence: p.hasGeoEvidence,
      eligibilityScore: p.eligibilityScore,
      fraudRiskScore: p.fraudRiskScore,
      status: p.expectedStatus,
      signals: p.signals,
      badges: p.badges,
      reasoning: p.reasoning,
      hash,
      createdAt: created,
      actorAddress: actorAddress(p.credentialId),
    };
  });
}
