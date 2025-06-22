export interface FMEARecord {
  id: string;
  assetId: string;
  failureMode: string;
  effect: string;
  cause: string;
  severity: number;
  occurrence: number;
  detection: number;
  rpn: number;
  action: string;
  status: string;
  asset: {
    id: string;
    name: string;
  };
} 