// 인증 게이트와 무관한 정적 공개 페이지 모음 (약관 / 개인정보처리방침 / AdMob 자리)
//
// [중요] 이용약관/개인정보처리방침 본문은 DeciDuel 서버(deci-duel-server)의 실제 데이터
// 처리 방식(Prisma User/SoloRecord/DiaryRecord 모델, OAuth 흐름, 마이크 사용 방식 등)과
// 운영자(개인 개발자 Llimy1, 2026-06-08 사용자 확인)로부터 받은 정보를 근거로 작성한
// 완성본입니다. 법적 검토가 필요한 경우 사용자가 직접 추가 검토를 거칠 수 있습니다.
//
// 일반 이용자(앱 심사자 포함)가 보는 공개 법적 문서이므로, 관리자(Admin SPA) 영역으로
// 돌아가는 내비게이션은 의도적으로 두지 않았다 (← DeciDuel 링크 제거, 2026-06-08).
import type { ReactNode } from 'react';

const LAST_UPDATED = '2026-06-08';
const APP_DOWNLOAD_URL = 'https://apps.apple.com/kr/app/deci-duel/id6778819304';

function PublicPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="public-page">
      <div className="public-page-card">
        <h1 className="public-page-title">{title}</h1>
        <div className="public-page-body">{children}</div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <a className="landing-brand" href="/" aria-label="DeciDuel 홈">
          <img src="/favicon.svg" alt="" className="landing-brand-mark" />
          <span>DeciDuel</span>
        </a>
        <nav className="landing-links" aria-label="공개 페이지">
          <a href="/legal/privacy">개인정보처리방침</a>
          <a href="/legal/terms">이용약관</a>
          <a href="mailto:llimy.mh@gmail.com">문의</a>
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <p className="landing-kicker">Voice Battle & Decibel Record</p>
            <h1>소리로 겨루고, 기록으로 남기는 데시벨 대결 앱</h1>
            <p className="landing-lead">
              DeciDuel은 마이크로 순간 음량을 측정해 솔로 기록, 다이어리, 랭킹, 1:1 대결을
              즐길 수 있는 모바일 앱입니다.
            </p>
            <div className="landing-actions">
              <a
                className="landing-button landing-button-primary"
                href={APP_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
              >
                App Store에서 다운로드
              </a>
              <a className="landing-button" href="/legal/privacy">
                개인정보처리방침
              </a>
              <a className="landing-button" href="/legal/terms">
                이용약관
              </a>
            </div>
          </div>

          <div className="landing-phone" aria-label="DeciDuel 앱 기능 미리보기">
            <div className="landing-phone-header">
              <span>DECIDUEL</span>
              <strong>93.74 dB</strong>
            </div>
            <div className="landing-wave">
              {Array.from({ length: 28 }).map((_, index) => (
                <span
                  key={index}
                  style={{ height: `${22 + ((index * 17) % 54)}px` }}
                />
              ))}
            </div>
            <div className="landing-result-card">
              <span>오늘의 최고 기록</span>
              <strong>솔로 측정 완료</strong>
            </div>
          </div>
        </section>

        <section className="landing-section" aria-labelledby="features-title">
          <p className="landing-kicker">Features</p>
          <h2 id="features-title">앱에서 제공하는 기능</h2>
          <div className="landing-feature-grid">
            <article>
              <h3>솔로 측정</h3>
              <p>기기에서 실시간 데시벨을 측정하고 최고 기록을 저장합니다.</p>
            </article>
            <article>
              <h3>다이어리</h3>
              <p>측정한 순간을 날짜별 기록과 짧은 메모로 남길 수 있습니다.</p>
            </article>
            <article>
              <h3>랭킹과 대결</h3>
              <p>친구 또는 다른 사용자와 기록을 비교하며 대결할 수 있습니다.</p>
            </article>
          </div>
        </section>

        <section className="landing-section landing-note" aria-labelledby="privacy-title">
          <div>
            <p className="landing-kicker">Privacy First</p>
            <h2 id="privacy-title">음성 파일은 서버로 전송되지 않습니다</h2>
          </div>
          <p>
            대결과 솔로 측정에서는 기기에서 음량 값을 계산하고, 숫자형 dB 값만 서버로
            전송합니다. 다이어리에 남기는 녹음은 본인의 기기에만 저장되며, 음성 파일 자체는
            서버로 전송되거나 외부에 공유되지 않습니다.
          </p>
        </section>
      </main>

      <footer className="landing-footer">
        <span>© 2026 MinHyeok Lee</span>
        <a href="/admin/login">Admin</a>
      </footer>
    </div>
  );
}

export function TermsPage() {
  return (
    <PublicPage title="이용약관">
      <p className="muted">시행일: {LAST_UPDATED}</p>

      <h2>제1조 (목적)</h2>
      <p>
        이 약관은 운영자 Llimy1(이하 “운영자”)가 제공하는 음성 크기 대결 서비스
        “DeciDuel”(모바일 애플리케이션 및 관련 제반 서비스, 이하 “서비스”)의 이용과
        관련하여 운영자와 회원 간의 권리, 의무 및 책임사항, 이용조건 및 절차 등 기본적인
        사항을 규정함을 목적으로 합니다.
      </p>

      <h2>제2조 (정의)</h2>
      <ul>
        <li>“서비스”란 운영자가 제공하는 DeciDuel 앱 및 이를 통해 제공되는 모든 기능을 말합니다.</li>
        <li>
          “회원”이란 이 약관에 동의하고 Apple, Google, Kakao 등 제3자 계정을 통한 소셜 로그인으로
          서비스 이용 계약을 체결한 자를 말합니다.
        </li>
        <li>
          “콘텐츠”란 회원이 서비스 이용 과정에서 생성하는 닉네임, 프로필 이미지, 다이어리 기록,
          게임 기록 등 일체의 정보를 말합니다.
        </li>
      </ul>

      <h2>제3조 (약관의 효력 및 변경)</h2>
      <p>
        이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이
        발생합니다. 운영자는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 개정
        시 적용일자 및 개정사유를 명시하여 시행일 7일 전(회원에게 불리하거나 중대한 변경의
        경우 30일 전)부터 공지합니다. 회원이 개정 약관에 동의하지 않는 경우 서비스 이용을
        중단하고 탈퇴할 수 있으며, 공지된 시행일 이후에도 서비스를 계속 이용하는 경우 개정
        약관에 동의한 것으로 봅니다.
      </p>

      <h2>제4조 (회원가입 및 계정)</h2>
      <ul>
        <li>
          서비스는 Apple, Google, Kakao 계정을 통한 소셜 로그인(OAuth) 방식으로만 가입할 수
          있으며, 별도의 자체 회원가입 절차를 두지 않습니다.
        </li>
        <li>
          최초 로그인 시 닉네임 설정, 약관 동의, 프로필 사진 설정, 마이크 테스트 등 온보딩
          절차를 완료해야 서비스를 이용할 수 있습니다.
        </li>
        <li>
          회원은 가입 시 등록한 정보가 변경된 경우 서비스 내 프로필 화면을 통해 직접 수정해야
          하며, 변경하지 않아 발생하는 불이익에 대해 운영자는 책임을 지지 않습니다.
        </li>
      </ul>

      <h2>제5조 (서비스의 제공 및 변경)</h2>
      <p>
        운영자는 다음과 같은 서비스를 제공합니다: ① 실시간 음성 크기 대결(듀얼) 및 매칭, ② 솔로
        음량 측정 및 기록, ③ 다이어리(일별 기록) 작성·조회, ④ 글로벌 랭킹(리더보드), ⑤ 기타
        운영자가 추가로 개발하거나 제휴를 통해 제공하는 서비스. 운영자는 운영상·기술상 필요에 따라
        제공 중인 서비스의 전부 또는 일부를 변경하거나 중단할 수 있으며, 이 경우 사전에
        공지합니다. 다만 긴급한 보안 문제 등 부득이한 사유가 있는 경우 사후에 공지할 수
        있습니다.
      </p>

      <h2>제6조 (회원의 의무)</h2>
      <p>회원은 다음 각 호의 행위를 하여서는 안 됩니다.</p>
      <ul>
        <li>타인의 계정·개인정보를 도용하거나 부정하게 사용하는 행위</li>
        <li>
          서비스를 이용하여 얻은 정보를 운영자의 사전 동의 없이 복제, 유통, 전송하거나 영리
          목적으로 이용하는 행위
        </li>
        <li>
          음성 크기 측정 결과를 조작할 목적으로 비정상적인 클라이언트, 매크로, 자동화 도구 등을
          사용하는 행위
        </li>
        <li>
          닉네임, 프로필 이미지, 다이어리 코멘트 등에 욕설, 음란물, 차별·혐오 표현, 타인의
          권리를 침해하는 내용을 게시하는 행위
        </li>
        <li>운영자 및 제3자의 지적재산권, 명예, 영업상 비밀 등을 침해하는 행위</li>
        <li>서비스의 안정적 운영을 방해할 수 있는 일체의 행위(부정 접속, 서버 공격 등)</li>
      </ul>

      <h2>제7조 (서비스 이용의 제한 및 정지)</h2>
      <p>
        운영자는 회원이 제6조를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 사전 통지 후(긴급
        시 사후 통지) 경고, 일시 정지, 영구 이용제한 등의 조치를 취할 수 있습니다. 회원은 운영자의
        조치에 대해 정해진 절차에 따라 이의를 제기할 수 있습니다.
      </p>

      <h2>제8조 (계약 해지 및 탈퇴)</h2>
      <p>
        회원은 서비스 내 설정 메뉴를 통해 언제든지 이용계약을 해지(회원 탈퇴)할 수 있습니다.
        탈퇴 시 회원의 계정 정보, 솔로/다이어리 기록 등 관련 데이터는 관계 법령 및
        개인정보처리방침에서 정한 보유 의무 기간을 제외하고 지체 없이 파기됩니다.
      </p>

      <h2>제9조 (지적재산권)</h2>
      <p>
        서비스에서 제공하는 디자인, 텍스트, 이미지, 소스코드 등 일체의 콘텐츠에 대한 저작권 및
        지적재산권은 운영자에 귀속됩니다. 회원이 서비스 내에서 직접 작성·게시한 콘텐츠(다이어리
        코멘트, 직접 업로드한 프로필 이미지 등)의 저작권은 해당 회원에게 있으며, 회원은 운영자가 서비스의 운영·홍보·개선을
        위해 필요한 범위 내에서 이를 사용하도록 허락한 것으로 봅니다.
      </p>

      <h2>제10조 (면책조항)</h2>
      <p>
        운영자는 천재지변, 불가항력적 사유, 회원의 귀책사유로 인한 서비스 장애, 회원이 서비스를
        통해 얻은 정보로 인해 입은 손해, 회원 상호 간 또는 회원과 제3자 간에 서비스를 매개로
        발생한 분쟁에 대해서는 관련 법령이 허용하는 범위 내에서 책임을 지지 않습니다. 마이크
        측정값(데시벨)은 기기·환경에 따라 오차가 발생할 수 있으며, 이를 절대적인 음향 측정값으로
        보장하지 않습니다.
      </p>

      <h2>제11조 (분쟁 해결 및 준거법)</h2>
      <p>
        이 약관과 관련하여 분쟁이 발생한 경우 운영자와 회원은 우선 상호 협의하여 해결하도록
        노력하며, 협의가 이루어지지 않을 경우 관계 법령에서 정한 절차에 따른 분쟁조정기구에
        조정을 신청하거나 민사소송법상의 관할 법원에 소를 제기할 수 있습니다. 이 약관은 대한민국
        법령에 따라 규율되고 해석됩니다.
      </p>

      <h2>부칙</h2>
      <p>이 약관은 {LAST_UPDATED}부터 적용됩니다.</p>
    </PublicPage>
  );
}

export function PrivacyPage() {
  return (
    <PublicPage title="개인정보처리방침">
      <p className="muted">시행일: {LAST_UPDATED}</p>

      <p>
        DeciDuel 서비스 운영자 Llimy1(이하 “운영자”)는 「개인정보 보호법」 등 관련 법령을
        준수하며, 이용자의 개인정보를 안전하게 처리하기 위해 다음과 같이 개인정보처리방침을
        수립·공개합니다.
      </p>

      <h2>1. 수집하는 개인정보 항목 및 수집 방법</h2>
      <h3>가. 회원가입 및 OAuth 로그인 시</h3>
      <ul>
        <li>
          Apple/Google/Kakao 계정을 통한 소셜 로그인 시: 인증 제공자 식별 정보(provider,
          provider ID), 그리고 서비스에서 사용할 닉네임
        </li>
      </ul>
      <p>
        ※ 운영자는 Apple/Google/Kakao로부터 비밀번호 등 민감한 인증정보를 직접 전달받지
        않으며, 각 제공자가 발급한 토큰(idToken/accessToken)을 통해 본인 확인만 수행합니다.
      </p>
      <h3>나. 서비스 이용 과정에서 자동/직접 수집되는 정보</h3>
      <ul>
        <li>프로필 정보: 닉네임, 아바타 색상, 프로필 이미지(직접 업로드 시)</li>
        <li>
          게임/측정 기록: 음성 크기 측정값(데시벨, peakDb/bestDb), 대결 승·패·연승 기록,
          솔로 기록
        </li>
        <li>다이어리 기록: 작성일, 측정 데시벨 값, 이모지, 코멘트(선택 입력)</li>
        <li>
          서비스 이용 기록: 접속 일시, 기기·OS 정보, 서비스 내 활동 로그(오류·보안 목적의
          운영 이벤트 로그 포함)
        </li>
        <li>약관 동의 이력: 동의한 약관/개인정보처리방침 버전, 동의 일시</li>
      </ul>
      <h3>다. 마이크(음성) 관련 안내 — 중요</h3>
      <p>
        서비스의 핵심 기능(음성 크기 측정·대결·다이어리)을 위해 마이크 접근 권한이 필요합니다.
        대결·솔로 측정 시에는 기기에서 실시간으로 음량 수준을 측정해 숫자형 데시벨(dB) 값만
        추출하며, 이 수치만이 대결 결과·기록 산출 및 서버 저장에 사용됩니다.{' '}
        <strong>
          운영자는 이용자의 음성 파일·음성 데이터 자체를 서버로 전송받거나 저장하지 않습니다.
        </strong>
      </p>
      <p>
        다이어리 기능에서는 이용자가 직접 측정한 음성을 추후 재생할 수 있도록 녹음 파일을
        본인 기기에 저장할 수 있습니다.{' '}
        <strong>
          이 녹음 파일은 본인의 기기에만 저장되며, 서버로 전송되거나 다른 이용자·제3자에게
          공유되지 않습니다.
        </strong>{' '}
        해당 다이어리 기록을 삭제하면 기기에 저장된 녹음 파일도 함께 삭제됩니다.
      </p>

      <h2>2. 개인정보의 수집 및 이용 목적</h2>
      <ul>
        <li>회원 식별 및 본인 확인, 부정 이용 방지(소셜 로그인 인증)</li>
        <li>서비스 제공: 실시간 대결·매칭, 솔로 측정, 다이어리, 글로벌 랭킹 등 핵심 기능 운영</li>
        <li>서비스 개선 및 신규 기능 개발을 위한 통계 분석(식별 가능성을 최소화하여 처리)</li>
        <li>공지사항 전달, 약관 변경 안내 등 고객 응대</li>
        <li>부정 이용·이상 행위 탐지, 서비스 안정성 확보를 위한 운영 로그 기록</li>
        <li>관계 법령에 따른 의무 이행</li>
      </ul>

      <h2>3. 개인정보의 보유 및 이용 기간</h2>
      <p>
        운영자는 원칙적으로 회원 탈퇴 시 보유한 개인정보를 지체 없이 파기합니다. 다만 다음의
        정보에 대해서는 명시한 사유로 일정 기간 보관할 수 있습니다.
      </p>
      <table>
        <thead>
          <tr>
            <th>보관 항목</th>
            <th>보관 사유</th>
            <th>보관 기간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>부정 이용 관련 운영 로그(접속 IP, 이상 행위 기록 등)</td>
            <td>부정 이용 재발 방지 및 분쟁 대응</td>
            <td>서비스 운영 기간 동안 계속 보관 (부정 이용 이력 추적 목적상 단기 삭제 시
              재발 방지 효과가 떨어지므로, 서비스 종료 또는 보관 목적 소멸 시 파기)</td>
          </tr>
          <tr>
            <td>전자상거래 등에서의 소비자보호에 관한 법률에 따른 거래기록</td>
            <td>관계 법령에 따른 보관 의무 (해당 시)</td>
            <td>관계 법령이 정한 기간</td>
          </tr>
        </tbody>
      </table>

      <h2>4. 개인정보의 제3자 제공</h2>
      <p>
        운영자는 이용자의 개인정보를 제2조에서 명시한 목적 범위 내에서만 처리하며, 원칙적으로
        이용자의 동의 없이 외부에 제공하지 않습니다. 다만 법령에 특별한 규정이 있거나
        수사기관이 적법한 절차에 따라 요청하는 경우는 예외로 합니다.
      </p>

      <h2>5. 개인정보 처리 위탁</h2>
      <p>
        운영자는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 외부 업체에 위탁하고
        있으며, 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정합니다.
      </p>
      <table>
        <thead>
          <tr>
            <th>수탁업체</th>
            <th>위탁 업무 내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cloudflare, Inc. (R2 Storage)</td>
            <td>프로필 이미지 등 파일의 저장·전송 인프라 제공</td>
          </tr>
          <tr>
            <td>Amazon Web Services, Inc. (AWS)</td>
            <td>서비스 운영을 위한 서버·데이터베이스 호스팅</td>
          </tr>
          <tr>
            <td>Apple Inc. / Google LLC / Kakao Corp.</td>
            <td>소셜 로그인(OAuth) 인증 처리</td>
          </tr>
        </tbody>
      </table>

      <h2>6. 정보주체의 권리·의무 및 행사 방법</h2>
      <p>
        이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴 또는
        개인정보 처리 정지 요청을 통해 동의를 철회할 수 있습니다. 닉네임·프로필 이미지·아바타
        색상은 서비스 내
        프로필/설정 화면에서 직접 변경할 수 있고, 회원 탈퇴는 설정 화면에서 직접 진행하거나
        아래 개인정보 보호책임자에게 연락하여 요청할 수 있습니다.
      </p>

      <h2>7. 개인정보의 파기 절차 및 방법</h2>
      <p>
        운영자는 개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는
        지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 복구할 수 없는
        기술적 방법을 사용하여 영구 삭제하며, 종이 문서에 기록·저장된 개인정보는 분쇄하거나
        소각합니다. 회원 탈퇴 시 계정 정보 및 연계된 솔로 기록·다이어리 기록은 데이터베이스에서
        함께 삭제(하드 삭제)됩니다.
      </p>

      <h2>8. 개인정보의 안전성 확보 조치</h2>
      <ul>
        <li>비밀번호 등 인증 정보 대신 OAuth 토큰 기반 인증을 사용해 자격 증명 노출 위험을 최소화</li>
        <li>개인정보에 대한 접근 권한을 최소한의 인원으로 제한하고 접근 기록을 관리</li>
        <li>전송 구간 암호화(HTTPS/WSS) 적용</li>
        <li>운영 이벤트 로그 기록 시 비밀번호·토큰 원문 등 민감정보는 저장하지 않도록 마스킹 처리</li>
      </ul>

      <h2>9. 개인정보 보호책임자</h2>
      <p>
        운영자는 개인정보 처리에 관한 업무를 총괄하고 이용자의 불만 처리 및 피해 구제를 위해
        아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
      </p>
      <ul>
        <li>성명: Llimy1</li>
        <li>이메일: llimy.mh@gmail.com</li>
        <li>문의: 서비스 내 문의하기 또는 위 이메일을 통해 접수</li>
      </ul>

      <h2>10. 고지의 의무</h2>
      <p>
        이 개인정보처리방침의 내용 추가, 삭제 및 수정이 있을 경우 시행 최소 7일 전(중요한
        변경의 경우 30일 전)에 서비스 내 공지사항을 통해 고지합니다.
      </p>

      <h2>부칙</h2>
      <p>이 방침은 {LAST_UPDATED}부터 적용됩니다.</p>
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
