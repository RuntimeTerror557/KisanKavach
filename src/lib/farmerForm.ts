import type { ScenarioPreset } from './types';

export interface FarmerFormState {
  farmerName: string;
  credentialId: string;
  district: string;
  tenancyStatus: 'owner' | 'tenant';
  maskedBank: string;
  scheme: string;
  cropType: string;
  acreage: string;
  damagePct: string;
  hasGeoEvidence: boolean;
}

export const EMPTY_FORM: FarmerFormState = {
  farmerName: '',
  credentialId: '',
  district: '',
  tenancyStatus: 'owner',
  maskedBank: '',
  scheme: '',
  cropType: '',
  acreage: '',
  damagePct: '',
  hasGeoEvidence: false,
};

export function presetToForm(p: ScenarioPreset): FarmerFormState {
  return {
    farmerName: p.farmerName,
    credentialId: p.credentialId,
    district: p.district,
    tenancyStatus: p.tenancyStatus,
    maskedBank: p.maskedBank,
    scheme: p.scheme,
    cropType: p.cropType,
    acreage: String(p.acreage),
    damagePct: String(p.damagePct),
    hasGeoEvidence: p.hasGeoEvidence,
  };
}

export const VERIFICATION_STEPS = [
  { label: 'Checking Credential Proofs...', detail: 'Validating Farmer ID against national registry' },
  { label: 'Cross-referencing Land Registry & Satellite Boundary Data...', detail: 'Overlaying geotagged plot with cadastral maps' },
  { label: 'Analyzing Crop & Weather Consistency Engine...', detail: 'Matching crop type with seasonal sowing windows & IMD weather' },
  { label: 'Scanning Duplicate Claim Signatures...', detail: 'Fingerprinting bank account & parcel across prior claims' },
];
