export interface Driver {
  id: string;
  name: 'Dyar' | 'Rozh' | 'Usama' | 'Basit' | 'Hama';
  color: string;
  startAngle: number;
  endAngle: number;
  phone: string;
  vehicle: string;
}

export interface Neighborhood {
  id: string;
  nameCkb: string;
  nameEn: string;
  nameAr?: string;
  driverId: string;
  sequenceOrder: number;
  status: 'pending' | 'completed';
  lat: number;
  lng: number;
  isVerified: boolean;
  notes?: string;
  isOutOfBoundary?: boolean;
}

export interface Zone {
  driverId: string;
  color: string;
  startAngle: number;
  endAngle: number;
  sectorName: string;
}

export interface AuditIssue {
  id: string;
  type: 'unassigned_driver' | 'duplicate_name' | 'missing_ckb' | 'missing_en' | 'unverified' | 'out_of_boundary';
  messageCkb: string;
  messageEn: string;
  entityId: string;
  entityName: string;
}

export type AppMode = 'driver-select' | 'driver-view' | 'admin' | 'map-overview';
