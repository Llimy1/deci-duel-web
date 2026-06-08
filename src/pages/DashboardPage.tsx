import { useCallback, useEffect, useState } from 'react';
import { fetchAdminHealth, type AdminHealth } from '../api/health';
import { ApiError } from '../types/api';

const POLL_INTERVAL_MS = 30_000;

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}시간 ${m}분 ${s}초`;
}

export function DashboardPage() {
  const [health, setHealth] = useState<AdminHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchAdminHealth();
      setHealth(data);
      setError(null);
      setLastUpdatedAt(new Date());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '서버 상태를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 마운트 시 1회 즉시 로드 + 폴링 구독 — 외부 시스템(서버 API) 동기화 목적이라 set-state-in-effect 룰을 의도적으로 비활성화
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const timer = window.setInterval(load, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="page-actions">
          {lastUpdatedAt && (
            <span className="muted">마지막 갱신: {lastUpdatedAt.toLocaleTimeString('ko-KR')}</span>
          )}
          <button type="button" className="btn btn-ghost" onClick={load} disabled={isLoading}>
            새로고침
          </button>
        </div>
      </div>

      {error && <p className="banner banner-error">{error}</p>}

      {!health && isLoading && <p className="muted">불러오는 중...</p>}

      {health && (
        <div className="card-grid">
          <section className="card">
            <h2 className="card-title">서버 상태</h2>
            <dl className="kv-list">
              <div className="kv-row">
                <dt>전체 상태</dt>
                <dd>
                  <span className={`status-dot ${health.ok ? 'status-ok' : 'status-error'}`} />
                  {health.ok ? '정상' : '이상'}
                </dd>
              </div>
              <div className="kv-row">
                <dt>가동 시간</dt>
                <dd>{formatUptime(health.uptimeSeconds)}</dd>
              </div>
              <div className="kv-row">
                <dt>환경</dt>
                <dd>{health.nodeEnv}</dd>
              </div>
              <div className="kv-row">
                <dt>서버 버전</dt>
                <dd>{health.serverVersion}</dd>
              </div>
            </dl>
          </section>

          <section className="card">
            <h2 className="card-title">데이터베이스</h2>
            <dl className="kv-list">
              <div className="kv-row">
                <dt>상태</dt>
                <dd>
                  <span
                    className={`status-dot ${health.db.status === 'ok' ? 'status-ok' : 'status-error'}`}
                  />
                  {health.db.status === 'ok' ? '정상' : '오류'}
                </dd>
              </div>
              <div className="kv-row">
                <dt>지연 시간 (SELECT 1)</dt>
                <dd>{health.db.latencyMs !== undefined ? `${health.db.latencyMs}ms` : '—'}</dd>
              </div>
            </dl>
          </section>

          <section className="card">
            <h2 className="card-title">메모리</h2>
            <dl className="kv-list">
              <div className="kv-row">
                <dt>RSS</dt>
                <dd>{health.memory.rssMb} MB</dd>
              </div>
              <div className="kv-row">
                <dt>Heap 사용</dt>
                <dd>{health.memory.heapUsedMb} MB</dd>
              </div>
              <div className="kv-row">
                <dt>Heap 전체</dt>
                <dd>{health.memory.heapTotalMb} MB</dd>
              </div>
            </dl>
          </section>

          <section className="card">
            <h2 className="card-title">게임 서버 (실시간)</h2>
            <dl className="kv-list">
              <div className="kv-row">
                <dt>활성 방 수</dt>
                <dd>{health.game.roomCount}</dd>
              </div>
              <div className="kv-row">
                <dt>연결된 소켓 수</dt>
                <dd>{health.game.connectedSocketCount}</dd>
              </div>
              <div className="kv-row">
                <dt>활성 플레이어 수</dt>
                <dd>{health.game.activePlayerCount}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}
