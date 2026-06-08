import { apiRequest } from './client';

export type EventLevel = 'info' | 'warn' | 'error';
export type EventCategory = 'auth' | 'admin' | 'http' | 'socket' | 'game' | 'system' | 'storage';

export interface OperationalEventItem {
  id: number;
  level: string;
  category: string;
  event: string;
  message: string | null;
  userId: number | null;
  requestId: string | null;
  roomCode: string | null;
  metadata: unknown;
  createdAt: string;
}

export interface OperationalEventPage {
  items: OperationalEventItem[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface EventFilters {
  level?: EventLevel;
  category?: EventCategory;
  event?: string;
  userId?: number;
  requestId?: string;
  from?: string; // ISO8601
  to?: string; // ISO8601
  limit?: number; // 기본 50, 최대 200
  cursor?: number;
}

// GET /admin/events — OperationalEvent 커서 기반 페이지네이션 조회 (admin JWT 필요)
export function fetchAdminEvents(filters: EventFilters): Promise<OperationalEventPage> {
  return apiRequest<OperationalEventPage>('/admin/events', {
    query: {
      level: filters.level,
      category: filters.category,
      event: filters.event,
      userId: filters.userId,
      requestId: filters.requestId,
      from: filters.from,
      to: filters.to,
      limit: filters.limit,
      cursor: filters.cursor,
    },
  });
}
