import Script from "next/script";

/**
 * 광고 랜딩 전용 메타 픽셀. 사이트 공통 픽셀(app/layout.tsx)과 따로 관리한다.
 *
 * 공통 픽셀도 같은 페이지에 떠 있으므로, 어느 쪽 코드가 먼저 실행돼도
 * 서로의 PageView 를 두 번 세지 않도록 PageView 는 trackSingle 로 이
 * 픽셀에만 보낸다. 신청 완료(Lead)는 landing-form 이 fbq('track') 으로
 * 보내 두 픽셀 모두에 간다.
 *
 * 앞부분은 메타 기본 설치 코드 그대로다 — fbq 가 이미 있으면 건너뛰므로
 * 공통 픽셀과 스크립트를 두 번 불러오지 않는다.
 */
export const LANDING_PIXEL_ID = "1610635173623130";

export default function LandingPixel() {
  return (
    <>
      <Script id="meta-pixel-landing" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${LANDING_PIXEL_ID}');
fbq('trackSingle', '${LANDING_PIXEL_ID}', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${LANDING_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
