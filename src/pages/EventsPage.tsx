import { Fragment, useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  fetchAdminEvents,
  type EventCategory,
  type EventFilters,
  type EventLevel,
  type OperationalEventItem,
} from '../api/events';
import { ApiError } from '../types/api';

const LEVEL_OPTIONS: EventLevel[] = ['info', 'warn', 'error'];
const CATEGORY_OPTIONS: EventCategory[] = [
  'auth',
  'admin',
  'http',
  'socket',
  'game',
  'system',
  'storage',
];

// 폼 입력 상태 (전부 문자열 — 제출 시 EventFilters로 변환)
interface FilterFormState {
  level: string;
  category: string;
  event: string;
  userId: string;
  requestId: string;
  from: string;
  to: string;
}

const EMPTY_FILTERS: FilterFormState = {
  level: '',
  category: '',
  event: '',
  userId: '',
  requestId: '',
  from: '',
  to: '',
};

function toEventFilters(form: FilterFormState, cursor?: number): EventFilters {
  const userId = form.userId.trim();
  return {
    level: (form.level || undefined) as EventLevel | undefined,
    category: (form.category || undefined) as EventCategory | undefined,
    event: form.event.trim() || undefined,
    userId: userId ? Number(userId) : undefined,
    requestId: form.requestId.trim() || undefined,
    from: form.from ? new Date(form.from).toISOString() : undefined,
    to: form.to ? new Date(form.to).toISOString() : undefined,
    limit: 50,
    cursor,
  };
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ko-KR');
  } catch {
    return iso;
  }
}

function levelClassName(level: string): string {
  if (level === 'error') return 'badge badge-error';
  if (level === 'warn') return 'badge badge-warn';
  return 'badge badge-info';
}

export function EventsPage() {
  const [form, setForm] = useState<FilterFormState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterFormState>(EMPTY_FILTERS);
  const [items, setItems] = useState<OperationalEventItem[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async (filters: FilterFormState, append: boolean, nextCursor?: number) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setExpandedId(null);
    }
    setError(null);
    try {
      const page = await fetchAdminEvents(toEventFilters(filters, nextCursor));
      setItems((prev) => (append ? [...prev, ...page.items] : page.items));
      setCursor(page.nextCursor ?? undefined);
      setHasMore(page.hasMore);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '이벤트를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // 최초 로드 (필터 없음) — 외부 시스템(서버 API) 동기화 목적이라 set-state-in-effect 룰을 의도적으로 비활성화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(EMPTY_FILTERS, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppliedFilters(form);
    load(form, false);
  };

  const handleReset = () => {
    setForm(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    load(EMPTY_FILTERS, false);
  };

  const handleLoadMore = () => {
    if (cursor === undefined || isLoadingMore) return;
    load(appliedFilters, true, cursor);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Events</h1>
      </div>

      <form className="filter-bar" onSubmit={handleSubmit}>
        <label className="field field-inline">
          <span className="field-label">Level</span>
          <select
            className="field-input"
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
          >
            <option value="">전체</option>
            {LEVEL_OPTIONS.map((lv) => (
              <option key={lv} value={lv}>
                {lv}
              </option>
            ))}
          </select>
        </label>

        <label className="field field-inline">
          <span className="field-label">Category</span>
          <select
            className="field-input"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="">전체</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="field field-inline">
          <span className="field-label">Event</span>
          <input
            className="field-input"
            value={form.event}
            onChange={(e) => setForm((f) => ({ ...f, event: e.target.value }))}
            placeholder="예: room_created"
          />
        </label>

        <label className="field field-inline">
          <span className="field-label">User ID</span>
          <input
            className="field-input"
            type="number"
            value={form.userId}
            onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
          />
        </label>

        <label className="field field-inline">
          <span className="field-label">Request ID</span>
          <input
            className="field-input"
            value={form.requestId}
            onChange={(e) => setForm((f) => ({ ...f, requestId: e.target.value }))}
            placeholder="req_..."
          />
        </label>

        <label className="field field-inline">
          <span className="field-label">From</span>
          <input
            className="field-input"
            type="datetime-local"
            value={form.from}
            onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
          />
        </label>

        <label className="field field-inline">
          <span className="field-label">To</span>
          <input
            className="field-input"
            type="datetime-local"
            value={form.to}
            onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
          />
        </label>

        <div className="filter-bar-actions">
          <button type="submit" className="btn btn-primary">
            검색
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            초기화
          </button>
        </div>
      </form>

      {error && <p className="banner banner-error">{error}</p>}

      <div className="table-wrap">
        <table className="event-table">
          <thead>
            <tr>
              <th>시각</th>
              <th>Level</th>
              <th>Category</th>
              <th>Event</th>
              <th>Message</th>
              <th>User</th>
              <th>Room</th>
              <th>Request ID</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <Fragment key={item.id}>
                <tr
                  className="event-row"
                  onClick={() => setExpandedId((cur) => (cur === item.id ? null : item.id))}
                >
                  <td className="mono">{formatDateTime(item.createdAt)}</td>
                  <td>
                    <span className={levelClassName(item.level)}>{item.level}</span>
                  </td>
                  <td>{item.category}</td>
                  <td className="mono">{item.event}</td>
                  <td className="truncate">{item.message ?? '—'}</td>
                  <td>{item.userId ?? '—'}</td>
                  <td className="mono">{item.roomCode ?? '—'}</td>
                  <td className="mono truncate">{item.requestId ?? '—'}</td>
                </tr>
                {expandedId === item.id && (
                  <tr className="event-detail-row">
                    <td colSpan={8}>
                      <pre className="json-viewer">{JSON.stringify(item.metadata, null, 2)}</pre>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>

        {isLoading && <p className="muted table-status">불러오는 중...</p>}
        {!isLoading && items.length === 0 && !error && (
          <p className="muted table-status">조건에 맞는 이벤트가 없습니다.</p>
        )}
      </div>

      {hasMore && (
        <div className="load-more">
          <button type="button" className="btn btn-ghost" onClick={handleLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? '불러오는 중...' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  );
}
