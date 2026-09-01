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
import { workProjects, workSites } from "@/lib/site";

type Project = (typeof workProjects)[number] | (typeof workSites)[number];

/** 컷 이미지의 가로세로. 원본 영상 프레임(1280×670)을 그대로 쓴다.
 *  격자 타일은 갈래와 상관없이 이 값 하나로 선다 — 타일 높이가 갈래마다
 *  달라지면 탭을 옮길 때 지면이 출렁인다. */
const SHOT_ASPECT = "1280 / 670";

/** 홈페이지 갈래의 모달 비율. 지면 캡처(1920×880 안팎)는 영상보다 세로가
 *  길어서, 영상 비율 상자에 넣으면 위아래가 잘려 나간다. */
const SITE_SHOT_ASPECT = "1920 / 890";

/** 한 줄에 들어가는 타일 수 — Reveal 지연을 열 단위로 묶는 데 쓴다.
 *  아래 로고 격자(app/work/page.tsx)와 같은 3열이다. */
const COLUMNS = 3;

/**
 * 작업물 갈래.
 *
 * 지금 채워진 건 영상 제작 하나다. 그래도 셋을 다 세우는 건 이 지면이
 * 무엇을 담는 자리인지 먼저 말해 주기 때문이다 — 서비스 지면의 갈래 탭과
 * 같은 판형이라(components/contents-tabs.tsx 등) 지면끼리 결이 이어진다.
 * 나머지 둘은 작업물이 들어오면 아래 PANEL_EMPTY 자리를 격자로 바꾼다.
 */
const tabs: ChipTab[] = [
  { id: "video", label: "영상 제작" },
  { id: "homepage", label: "홈페이지" },
  { id: "detail", label: "상세페이지" },
];

/** 갈래마다 어떤 목록이 서는지. 빈 배열이면 "준비 중입니다"가 대신 선다. */
const PROJECTS_BY_TAB: Record<string, readonly Project[]> = {
  video: workProjects,
  homepage: workSites,
  detail: [],
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
  shotAspect,
  onClose,
}: {
  project: Project;
  /** 컷 상자의 가로세로 — 갈래마다 다르다(SHOT_ASPECT / SITE_SHOT_ASPECT). */
  shotAspect: string;
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
              style={{ aspectRatio: shotAspect }}
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
  /* 지면 캡처는 영상 프레임보다 세로가 길다 — 모달 상자만 갈래를 따른다. */
  const shotAspect = tab === "homepage" ? SITE_SHOT_ASPECT : SHOT_ASPECT;
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

          {/* 영상 갈래를 이끄는 사람. 탭 줄의 오른쪽 끝, 헤어라인이 끝나는
              자리에 작게 앉힌다 — 격자 위에 따로 한 줄을 내주면 작업물보다
              크레딧이 먼저 읽힌다. 다른 갈래에는 붙지 않는다. */}
          {tab === "video" && (
            <p className="hidden font-display text-xs font-bold tracking-[0.18em] whitespace-nowrap text-white/45 sm:block">
              Main PD. CHOI WON SIK
            </p>
          )}
        </div>

        {/* 좁은 화면에서는 탭이 두 줄로 접히며 헤어라인이 사라진다 —
            크레딧을 그 줄에 같이 두면 탭을 밀어내므로 아래로 내리고,
            거기서는 가운데로 세운다(넓은 화면의 오른쪽 끝과 달리, 밑에
            깔린 줄을 왼쪽에 붙이면 탭 알약에 딸린 꼬리처럼 읽힌다). */}
        {tab === "video" && (
          <p className="mt-5 text-center font-display text-xs font-bold tracking-[0.18em] text-white/45 sm:hidden">
            Main PD. CHOI WON SIK
          </p>
        )}
      </div>

      {projects.length === 0 ? (
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
      {active && (
        <ProjectModal
          project={active}
          shotAspect={shotAspect}
          onClose={close}
        />
      )}
    </section>
  );
}
