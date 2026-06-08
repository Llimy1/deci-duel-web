// 인증 게이트와 무관한 정적 공개 페이지 모음 (약관 / 개인정보처리방침 / AdMob 자리)
// 1차 구현 단계에서는 자리만 잡아두고, 실제 법무 검토된 본문은 추후 채워넣는다.
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

function PublicPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="public-page">
      <div className="public-page-card">
        <Link to="/" className="public-page-back">
          ← DeciDuel
        </Link>
        <h1 className="public-page-title">{title}</h1>
        <div className="public-page-body">{children}</div>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <PublicPage title="이용약관">
      <p className="muted">
        이용약관 본문은 준비 중입니다. 최종 검토된 내용이 확정되는 대로 이 페이지에 게시됩니다.
      </p>
    </PublicPage>
  );
}

export function PrivacyPage() {
  return (
    <PublicPage title="개인정보처리방침">
      <p className="muted">
        개인정보처리방침 본문은 준비 중입니다. 최종 검토된 내용이 확정되는 대로 이 페이지에
        게시됩니다.
      </p>
    </PublicPage>
  );
}

export function AdMobPage() {
  return (
    <PublicPage title="AdMob 앱 연결">
      <p className="muted">
        Google AdMob 앱 연결 확인용 페이지 자리입니다. 발급받은 검증 콘텐츠가 확정되는 대로 이
        위치에 게시됩니다.
      </p>
    </PublicPage>
  );
}
