import { apiRequest } from './client';

export interface AdminHealth {
  ok: boolean;
  uptimeSeconds: number;
  memory: { rssMb: number; heapUsedMb: number; heapTotalMb: number };
  nodeEnv: string;
  serverVersion: string;
  db: { status: 'ok' | 'error'; latencyMs?: number };
  game: { roomCount: number; connectedSocketCount: number; activePlayerCount: number };
}

// GET /admin/health — 서버 운영 상태 스냅샷 (admin JWT 필요)
export function fetchAdminHealth(): Promise<AdminHealth> {
  return apiRequest<AdminHealth>('/admin/health');
}
