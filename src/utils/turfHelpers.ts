import { Neighborhood, AuditIssue, Driver } from '../types';

export const CITADEL_CENTER = { lat: 36.1912, lng: 44.0092 };

/**
 * Calculate bearing angle from Citadel to a point (0 to 360 degrees, 0 = North, clockwise)
 */
export function calculateBearing(lat: number, lng: number): number {
  const dLng = (lng - CITADEL_CENTER.lng) * (Math.PI / 180);
  const lat1 = CITADEL_CENTER.lat * (Math.PI / 180);
  const lat2 = lat * (Math.PI / 180);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  let brng = Math.atan2(y, x) * (180 / Math.PI);
  brng = (brng + 360) % 360;
  return brng;
}

/**
 * Calculate approximate distance in kilometers from Citadel
 */
export function calculateDistanceFromCitadel(lat: number, lng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat - CITADEL_CENTER.lat) * (Math.PI / 180);
  const dLng = (lng - CITADEL_CENTER.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(CITADEL_CENTER.lat * (Math.PI / 180)) *
      Math.cos(lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generate sector wedge polygon coordinates (pie sector from Citadel to 150m ring radius ~7.5km)
 */
export function createSectorPolygon(startAngle: number, endAngle: number, radiusKm: number = 7.5): [number, number][] {
  const points: [number, number][] = [[CITADEL_CENTER.lat, CITADEL_CENTER.lng]];
  const steps = 25;
  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + (i / steps) * (endAngle - startAngle);
    // Convert angle to radians (0 is North, clockwise)
    const rad = (angle - 90) * (Math.PI / 180);
    const dLat = (radiusKm / 111) * Math.sin(rad);
    const dLng = (radiusKm / (111 * Math.cos(CITADEL_CENTER.lat * (Math.PI / 180)))) * Math.cos(rad);
    points.push([CITADEL_CENTER.lat + dLat, CITADEL_CENTER.lng + dLng]);
  }
  points.push([CITADEL_CENTER.lat, CITADEL_CENTER.lng]);
  return points;
}

/**
 * Sort neighborhoods intelligently from Citadel outwards
 */
export function sortNeighborhoods(neighborhoods: Neighborhood[]): Neighborhood[] {
  return [...neighborhoods].sort((a, b) => {
    const distA = calculateDistanceFromCitadel(a.lat, a.lng);
    const distB = calculateDistanceFromCitadel(b.lat, b.lng);
    return distA - distB;
  });
}

/**
 * Format numbers according to user preference
 */
export function formatNumber(num: number, useKurdishNumerals: boolean): string {
  const str = num.toString();
  if (!useKurdishNumerals) return str;
  const persianNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (d) => persianNumbers[parseInt(d, 10)]);
}

/**
 * Run Data Audit Inspector
 */
export function runDataAudit(neighborhoods: Neighborhood[], drivers: Driver[]): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const driverIds = new Set(drivers.map((d) => d.id));
  const nameCounts: { [key: string]: number } = {};

  neighborhoods.forEach((n) => {
    const key = n.nameCkb.trim().toLowerCase();
    nameCounts[key] = (nameCounts[key] || 0) + 1;

    if (!n.driverId || !driverIds.has(n.driverId)) {
      issues.push({
        id: `audit-driver-${n.id}`,
        type: 'unassigned_driver',
        messageCkb: `گەڕەکی '${n.nameCkb}' شۆفێری پێویستی نییە`,
        messageEn: `Neighborhood '${n.nameEn}' has missing driver`,
        entityId: n.id,
        entityName: n.nameCkb
      });
    }

    if (!n.nameCkb || n.nameCkb.trim() === '') {
      issues.push({
        id: `audit-ckb-${n.id}`,
        type: 'missing_ckb',
        messageCkb: `گەڕەکی ژمارە ${n.id} ناوی کوردی نییە`,
        messageEn: `Neighborhood ${n.id} missing Kurdish name`,
        entityId: n.id,
        entityName: n.id
      });
    }

    if (!n.nameEn || n.nameEn.trim() === '') {
      issues.push({
        id: `audit-en-${n.id}`,
        type: 'missing_en',
        messageCkb: `گەڕەکی '${n.nameCkb}' ناوی ئینگلیزی نییە`,
        messageEn: `Neighborhood '${n.nameCkb}' missing English name`,
        entityId: n.id,
        entityName: n.nameCkb
      });
    }

    const dist = calculateDistanceFromCitadel(n.lat, n.lng);
    if (dist > 9.5) {
      issues.push({
        id: `audit-bound-${n.id}`,
        type: 'out_of_boundary',
        messageCkb: `گەڕەکی '${n.nameCkb}' لە دەرەوەی سنووری ١٥٠ مەترە`,
        messageEn: `Neighborhood '${n.nameEn}' is outside 150m boundary`,
        entityId: n.id,
        entityName: n.nameCkb
      });
    }
  });

  Object.keys(nameCounts).forEach((nameKey) => {
    if (nameCounts[nameKey] > 1) {
      const match = neighborhoods.find((n) => n.nameCkb.trim().toLowerCase() === nameKey);
      if (match) {
        issues.push({
          id: `audit-dup-${match.id}`,
          type: 'duplicate_name',
          messageCkb: `ناوی گەڕەکی '${match.nameCkb}' دووبارە بووەوە`,
          messageEn: `Duplicate neighborhood name: '${match.nameEn}'`,
          entityId: match.id,
          entityName: match.nameCkb
        });
      }
    }
  });

  return issues;
}
