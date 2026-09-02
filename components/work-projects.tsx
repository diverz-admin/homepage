"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Reveal from "@/components/reveal";
import {
  ChipTabs,
  type ChipTab,
} from "@/components/ui/animated-chip-tab-component";
import { clientLogos, workProjects } from "@/lib/site";

type Project = (typeof workProjects)[number];

/** 컷 이미지의 가로세로. 원본 영상 프레임(1280×670)을 그대로 쓴다.
 *  격자 타일은 갈래와 상관없이 이 값 하나로 선다 — 타일 높이가 갈래마다
 *  달라지면 탭을 옮길 때 지면이 출렁인다. */
const SHOT_ASPECT = "1280 / 670";

/** 한 줄에 들어가는 타일 수 — Reveal 지연을 열 단위로 묶는 데 쓴다.
 *  아래 로고 격자(app/work/page.tsx)와 같은 3열이다. */
const COLUMNS = 3;

/** 마케팅 갈래의 로고 격자 열 수(md 이상 기준). 위 컷 격자와 열이 다르므로
 *  Reveal 지연을 묶는 값도 따로 둔다.
 *
 *  화면 끝까지 물린 격자라 마지막 줄이 얼마나 차는지가 그대로 보인다.
 *  로고가 46장이니 4열이면 46 = 11×4+2 로 두 장이 남고, 좁은 화면의
 *  2열은 23줄로 딱 떨어진다. */
const LOGO_COLUMNS = 4;

/**
 * 작업물 갈래.
 *
 * 두 갈래가 서로 다른 것을 보여 준다 — 영상 제작은 컷 격자(작업물 자체),
 * 마케팅은 클라이언트 로고 격자(함께한 브랜드). 판형은 서비스 지면의 갈래
 * 탭과 같아서(components/contents-tabs.tsx 등) 지면끼리 결이 이어진다.
 *
 * 한때 홈페이지·상세페이지 갈래가 있었다. 홈페이지에는 모노커스 한 편이
 * 걸려 있었고(lib/site.ts 의 workSites 에 그대로 남아 있다), 상세페이지는
 * 내내 비어 있었다. 둘 다 걷어내고 마케팅 하나로 바꿨다.
 */
const tabs: ChipTab[] = [
  { id: "video", label: "영상 제작" },
  { id: "marketing", label: "마케팅" },
];

/** 컷 격자가 서는 갈래와 그 목록. 여기 없는 갈래는 아래에서 따로 그린다
 *  (마케팅 = 로고 격자). 빈 배열이면 "준비 중입니다"가 대신 선다. */
const PROJECTS_BY_TAB: Record<string, readonly Project[]> = {
  video: workProjects,
};

/**
 * 모달 한 장.
 *
 * 이 사이트에 다이얼로그가 이번이 처음이라 라이브러리를 새로 들이지 않고
 * 직접 짠다(@radix-ui/react-dialog 미설치). 대신 다이얼로그가 갖춰야 할
 * 것은 빠뜨리지 않는다 — Esc 로 닫기, 바깥 눌러 닫기, 열려 있는 동안
 * 배경 스크롤 잠금, 닫으면 원래 눌렀던 썸네일로 포커스 되돌리기,
 * role/aria-modal/aria-labelledby.
 *
 * 컷은 세로로 이어 붙인다 — 좌우로 넘기는 슬라이드와 달리 세 컷이 한
 * 흐름으로 읽히고, "다음 장이 더 있다"를 화살표 없이 스크롤이 말해 준다.
 * 모든 컷을 같은 비율 상자(SHOT_ASPECT)에 앉혀 크기를 균일하게 맞춘다.
 */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    /* 배경 스크롤 잠금. 스크롤바가 사라지며 지면이 옆으로 튀지 않게
       사라진 폭만큼 padding 으로 메운다. */
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    /* 열리면 패널로 포커스를 옮긴다 — 키보드 사용자가 바로 스크롤하고
       Esc 를 누를 수 있어야 한다. preventScroll 은 꼭 필요하다: 패널이
       화면보다 길어서, 브라우저가 포커스 대상을 보이게 하려고 겹을 조금
       내려 버리면 제목 줄이 위로 잘려 나간다. */
    panelRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [onClose]);

  const titleId = `work-project-${project.id}-title`;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain bg-abyss/95 p-4 sm:p-8"
      /* 스크롤은 이 겹이 맡는다 — Lenis 가 붙은 지면에서도 여기서만
         움직이도록 표시해 둔다(app/globals.css 의 [data-lenis-prevent]).

         이 겹 자체는 애니메이션하지 않는다. 화면 전체를 덮은 판을
         페이드인시키면 그 아래 큰 사진들까지 매 프레임 다시 합성해야 해서,
         어두워지는 데만 몇 프레임이 걸리고 그동안 뒤 지면이 비쳐 보였다.
         배경은 즉시 깔고, 움직임은 안쪽 패널만 맡는다. 같은 이유로
         backdrop-blur 도 쓰지 않는다 — 불투명도만으로 충분히 가라앉는다. */
      data-lenis-prevent
      /* 바깥(배경)을 누르면 닫는다. 패널 안에서 시작한 클릭이 올라와
         닫아 버리지 않게 target === currentTarget 을 확인한다. */
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        /* my-auto 로 세로 가운데 정렬하지 않는다 — 컷이 여러 장이라
           패널이 화면보다 길어지는데, auto 마진은 넘친 만큼을 스크롤이
           닿지 않는 위쪽으로 밀어내 제목 줄이 잘린다. 위에서부터
           시작해 아래로 스크롤한다. */
        className="w-full max-w-4xl outline-none"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 제목 줄과 닫기 버튼. 컷 위에 얹지 않고 그 위 한 줄로 뺀다 —
            컷을 가리지 않고, 좁은 화면에서도 닫기가 늘 같은 자리에 있다. */}
        <div className="mb-4 flex items-start justify-between gap-6">
          <div>
            <p className="font-display text-xs font-bold tracking-[0.25em] text-[#acd4ff]">
              {project.client}
            </p>
            <h2
              id={titleId}
              className="mt-2 font-display text-fluid-xl font-bold tracking-tight text-white"
            >
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid size-10 shrink-0 place-items-center rounded-full text-2xl leading-none text-white/70 ring-1 ring-white/25 transition hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        {/* 컷 — 같은 비율 상자에 하나씩. 사이 틈은 좁게 둬서 한 편의
            영상에서 뽑은 연속된 장면으로 읽히게 한다. */}
        <ul className="space-y-2">
          {project.shots.map((shot, i) => (
            <li
              key={shot.src}
              className="relative w-full overflow-hidden bg-black"
              style={{ aspectRatio: SHOT_ASPECT }}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 896px) 896px, 100vw"
                /* 첫 컷만 우선 받는다 — 모달을 열자마자 보이는 자리다. */
                priority={i === 0}
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </motion.div>
    </div>,
    document.body,
  );
}

/**
 * 마케팅 갈래 — 함께한 브랜드 로고 격자.
 *
 * 한때 이 지면 맨 아래에 통째로 깔려 있던 판이다. 컷 격자 바로 밑에 흰 타일
 * 46장이 붙으니 지면이 두 벌의 격자로 갈라져 걷어냈었는데, 갈래 탭으로 들어온
 * 지금은 그럴 일이 없다 — 한 번에 한 격자만 선다.
 *
 * 지면은 다크인데 타일만 흰색이다. 로고 PNG가 "어두운 잉크 + 투명 배경"이라
 * 어두운 판에 올리면 검정 로고(HERMÈS·Porsche 등)가 통째로 사라진다.
 *
 * 위 컷 격자와 달리 이쪽은 page-container 안에 든다. 로고는 잉크가 작아서
 * 화면 끝까지 물리면 타일만 커지고 로고는 그대로라 허전해진다.
 */
function MarketingLogos() {
  return (
    /* 위 컷 격자와 같은 판 — page-container 밖이라 화면 폭을 그대로 쓰고,
       타일 사이 틈(gap)은 두지 않는다. 흰 타일이 좌우 끝까지 이어지며 한
       장의 접촉 인화지처럼 읽힌다. */
    <ul className="grid grid-cols-2 md:grid-cols-4">
      {clientLogos.map((logo, i) => {
        /* 컷을 뒤에 까는 칸(lib/site.ts 의 clientLogos 에서 photo 를 가진
           것들). 로고를 대신하는 게 아니라 로고 뒤에 깔린다. */
        const photo = "photo" in logo ? logo : null;

        return (
          <Reveal
            as="li"
            key={logo.name}
            /* 열 위치로만 지연을 준다. 행 번호까지 더하면 아래쪽 행이
             화면에 들어온 뒤에도 1초 가까이 비어 있게 된다. */
            delay={(i % LOGO_COLUMNS) * 70}
          >
            {/* 로고 타일 — 라운드·그림자 없이 각진 흰 판.
              타일끼리 붙어 있어서 1px 테두리로만 칸을 나눈다(테두리가
              없으면 한 줄이 통째로 흰 덩어리로 보인다). 테두리 색은
              페이지 배경과 같은 abyss라 칸 사이가 배경이 비치는 틈처럼
              보이고, 격자 바깥 테두리는 배경에 묻혀 안 보인다.
              로고 PNG는 이미 16:6 캔버스에 "잉크 면적이 같도록"
              정규화돼 있어서 여백을 더 주지 않는다.

              비율은 컷 타일과 같은 SHOT_ASPECT 다. 4:3 이던 것을 바꿨다 —
              로고 PNG 가 16:6 캔버스라 세로로 긴 상자에 넣으면 위아래가
              통째로 빈다. 옆 갈래의 컷 타일과 결이 맞는 건 덤이다. */}
            <div
              className={`work-tile group relative flex items-center justify-center overflow-hidden border border-abyss px-5 sm:px-8 ${
                photo ? "bg-abyss" : "bg-white"
              }`}
              style={{ aspectRatio: SHOT_ASPECT }}
            >
              {/* 컷이 있는 칸은 컷을 배경으로 깔고 그 위에 로고를 얹는다.
                  판을 어둡게 뒤집는다 — 컷이 배경 없는 투명 PNG라 흰
                  타일에 그냥 얹으면 병과 로고가 같은 자리에서 겹쳐 둘 다
                  못 읽는다. 어두운 판 위에서는 컷이 가라앉고 로고만 뜬다.

                  스크림은 컷을 더 눌러 로고가 걸리는 자리를 비운다. */}
              {photo && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.photo}
                    alt={photo.photoAlt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover"
                  />
                  <span aria-hidden className="absolute inset-0 bg-abyss/70" />
                </>
              )}

              {/* 원본 비율을 그대로 살려야 해서 next/image 대신 img를 쓴다.
                  어두운 판에 얹히는 로고는 흰색으로 뒤집는다 — 로고 PNG가
                  대개 "어두운 잉크 + 투명 배경"이라 그대로 두면 통째로
                  사라진다. 뒤집으면 되레 뭉개지는 그림 로고만 예외로 둔다
                  (keepLogoColor — lib/site.ts 의 photo 주석 참고). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                decoding="async"
                className={`work-logo relative z-[1] max-h-full w-full object-contain ${
                  photo && !("keepLogoColor" in logo)
                    ? "brightness-0 invert"
                    : ""
                }`}
              />

              {/* 이름은 올렸을 때만 타일 위로 떠오른다 — 컷 격자의 타일과
                같은 규칙이다. 타일 밖 다크 배경에 캡션 줄로 달면 흰 판과
                검은 글줄이 번갈아 눕는 줄무늬가 되어, 화면을 꽉 채운
                한 장으로 읽히지 않는다.

                컷 격자와 달리 여기는 불투명하게 덮는다(bg-abyss/70 이 아니라
                bg-abyss). 로고도 이름도 화면 한가운데에 앉는 것이라, 컷처럼
                비쳐 보이게 두면 글자가 로고 위에 겹쳐 둘 다 읽히지 않는다.
                z-10 은 로고 때문에 필요하다 — .work-logo 의 transform 이
                쌓임 맥락을 만들어서, 없으면 로고가 덮개 위로 올라온다.

                컷이 깔린 칸에는 달지 않는다 — 이름은 이미 어두운 판 위에
                흰 로고로 늘 떠 있다. 거기에 또 덮으면 올릴 때마다 컷이
                사라지고 같은 이름만 남는다. */}
              {!photo && (
                <span
                  aria-hidden
                  className="absolute inset-0 z-10 flex items-center justify-center bg-abyss px-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <span className="font-display text-sm font-bold tracking-tight text-white">
                    {logo.name}
                  </span>
                </span>
              )}
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

/**
 * WORK — 포트폴리오 격자와 그 모달.
 *
 * 판형은 아래 로고 격자와 같다 — 화면 좌우 끝까지 물리고(.bleed-x) 타일
 * 사이 틈을 두지 않는다. 컷이 한 장의 접촉 인화지처럼 이어져야 "이만큼
 * 만들어 왔다"가 한눈에 읽힌다. 여백 안에 얌전히 든 카드 묶음으로 두면
 * 낱장 카드 몇 개로 보인다.
 *
 * 타일 하나가 프로젝트 하나다 — 대표 컷(thumb) 한 장이 서고, 누르면 그
 * 편의 나머지 컷이 모달에 뜬다. 캡션은 달지 않는다(타일마다 글줄이 붙으면
 * 행 사이가 벌어져 격자가 흩어진다). 프로젝트 이름은 올렸을 때만 컷 위로
 * 떠오른다.
 *
 * 모달은 열려 있을 때만 만든다(createPortal). 닫힌 동안 DOM에 숨겨 두면
 * 그 안의 이미지를 브라우저가 미리 받아 첫 화면이 무거워진다.
 */
export default function WorkProjects() {
  const [tab, setTab] = useState(tabs[0].id);
  const [open, setOpen] = useState<string | null>(null);
  /* 열기 전에 눌렀던 타일. 닫을 때 그 자리로 포커스를 돌려준다 —
     키보드로 훑던 사람이 지면 맨 위로 튕기지 않는다. */
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus();
  }, []);

  const projects = PROJECTS_BY_TAB[tab] ?? [];
  /* 모달은 지금 열려 있는 갈래에서만 찾는다 — 갈래가 달라도 id는 안 겹치지만,
     탭을 옮기면 열려 있던 모달이 따라 닫히는 편이 자연스럽다. */
  const active = projects.find((p) => p.id === open);

  return (
    <section className="pb-24 sm:pb-32">
      {/* 격자 위에 "Portfolio" 이름표가 있었는데 걷어냈다 — 배너 제목
          ("다이버즈와 함께한 프로젝트") 바로 밑이라 같은 말을 두 번 했다.
          그 자리는 이제 갈래 탭이 맡는다.

          탭 줄만 page-container 안에 둔다 — 아래 격자는 화면 끝까지 물리는
          판이라 같은 폭을 쓰면 안 된다. 규격(알약을 왼쪽에 붙이고 남는 폭은
          헤어라인으로 긋기)은 서비스 지면의 갈래 탭과 같다. layoutId 는
          지면마다 다르게 준다 — 같은 값이면 두 컴포넌트가 한 화면에 설 때
          알약을 서로 주고받는다. */}
      <div className="page-container pb-10 sm:pb-14">
        <div className="flex items-center gap-6">
          <ChipTabs
            tabs={tabs}
            selected={tab}
            onSelect={setTab}
            layoutId="work-tab-pill"
            /* 어두운 지면이라 알약을 밝은 값으로 뒤집는다 —
               components/ui/animated-chip-tab-component.tsx 의 tone 참고. */
            tone="dark"
            className="mx-0 px-0"
          />
          <span
            aria-hidden
            className="hidden h-px flex-1 bg-gradient-to-r from-accent/35 to-transparent sm:block"
          />

          {/* 영상 갈래를 이끄는 사람. 넓은 화면에서는 탭 줄의 오른쪽 끝,
              헤어라인이 끝나는 자리에 앉힌다. 다른 갈래에는 붙지 않는다. */}
          {tab === "video" && (
            <p className="hidden font-display text-xs font-bold tracking-[0.18em] whitespace-nowrap text-white/45 sm:block">
              Main PD. CHOI WON SIK
            </p>
          )}
        </div>
      </div>

      {/* 좁은 화면 전용. 거기서는 탭이 두 줄로 접히며 헤어라인이 사라져
          위 줄에 크레딧을 같이 둘 자리가 없다 — 격자 바로 위로 내린다.
          정렬은 넓은 화면과 같은 오른쪽이다. 아래 여백을 좁게 잡아 첫
          썸네일에 붙인다. */}
      {tab === "video" && (
        <p className="page-container pb-4 text-right font-display text-xs font-bold tracking-[0.18em] text-white/45 sm:hidden">
          Main PD. CHOI WON SIK
        </p>
      )}

      {tab === "marketing" ? (
        <MarketingLogos />
      ) : projects.length === 0 ? (
        /* 아직 작업물이 없는 갈래. 빈 화면을 그대로 두면 지면이 고장 난
           것처럼 보이므로 한 줄로 상태를 말해 준다. */
        <div className="page-container py-20 text-center sm:py-28">
          <p className="text-fluid-lg font-bold tracking-tight text-white/70">
            준비 중입니다
          </p>
          <p className="mt-3 text-sm text-white/45">
            작업물을 정리해 곧 이 자리에 올립니다.
          </p>
        </div>
      ) : (
        /* 이 격자는 page-container 밖이라 그대로 화면 폭을 쓴다 —
           .bleed-x 로 여백을 되물릴 필요가 없다(.bleed-x 는 page-container
           안에서만 값이 맞는다). 틈(gap)은 두지 않는다. */
        <ul className="grid grid-cols-2 md:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal
              as="li"
              key={project.id}
              /* 열 위치로만 지연을 준다. 행 번호까지 더하면 아래쪽 행이
               화면에 들어온 뒤에도 한참 비어 있게 된다. */
              delay={(i % COLUMNS) * 70}
            >
              <button
                type="button"
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setOpen(project.id);
                }}
                aria-label={`${project.client} ${project.title} — 컷 모아 보기`}
                aria-haspopup="dialog"
                className="group relative block w-full cursor-pointer overflow-hidden bg-black"
                style={{ aspectRatio: SHOT_ASPECT }}
              >
                <Image
                  src={project.thumb}
                  alt={project.thumbAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* 올리면 컷이 가라앉고 그 위로 이름이 떠오른다. 평소엔
                  아무것도 얹지 않는다 — 컷 자체가 작업물이다. */}
                <span
                  aria-hidden
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-abyss/70 px-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="font-display text-xs font-bold tracking-[0.25em] text-[#acd4ff]">
                    {project.client}
                  </span>
                  <span className="font-display text-fluid-lg font-bold tracking-tight text-white">
                    {project.title}
                  </span>
                  <span className="text-sm text-white/60">{project.role}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      )}

      {/* AnimatePresence 로 감싸 닫힐 때도 페이드아웃 시켜 봤는데, 포털로
          내보낸 자식이라 exit 가 중간에 멈춘 채 겹이 살아남았다 — 그 동안
          투명한 배경 겹이 화면을 덮고 있어서 다음 클릭이 그리로 먹혔다.
          닫기는 즉시 언마운트한다(열 때의 페이드인만 남긴다). */}
      {active && <ProjectModal project={active} onClose={close} />}
    </section>
  );
}
