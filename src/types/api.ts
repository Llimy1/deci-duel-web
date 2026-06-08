// 서버 공통 응답 포맷 (deci-duel-server docs/api.md "공통 응답 포맷" 참고)
// 모든 응답은 ApiResponse<T>로 래핑된다. 실패 시 data는 항상 null.
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  requestId?: string;
}

export class ApiError extends Error {
  statusCode: number;
  requestId?: string;

  constructor(statusCode: number, message: string, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.requestId = requestId;
  }
}
