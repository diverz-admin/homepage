"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * 실제로 치는 것처럼 타이핑되는 대화 두 줄 (광고 랜딩 TRUST 섹션).
 *
 * 화면에 들어오면
 *   고객사 말풍선: 글자가 한 자모씩 조합되며 빠르게 써진다
 *   다이버즈 말풍선: 같은 방식으로 이어서 써진다
 * 순서로 흘러가고, 다 써지면 children(큰 제목)이 떠오른다.
 *
 * 한글은 "ㅊ → 초 → 최"처럼 초성 → 초성+중성 → 받침 순으로 조합해 보여 준다.
 * 말풍선 크기는 처음부터 완성 문장 크기로 잡아 두고(보이지 않는 사본),
 * 그 위에 써지는 글자를 겹쳐서 쓰는 동안 레이아웃이 흔들리지 않는다.
 * 움직임 줄이기 설정이면 처음부터 다 써진 상태로 보인다.
 */

const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

/** 문장을 타이핑 단계별 문자열 목록으로 편다. */
function typingFrames(text: string): string[] {
  const frames: string[] = [];
  let done = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0) - 0xac00;
    if (code >= 0 && code < 11172) {
      const cho = Math.floor(code / 588);
      const jung = Math.floor((code % 588) / 28);
      const jong = code % 28;
      frames.push(done + CHO[cho]);
      const noJong = String.fromCharCode(0xac00 + cho * 588 + jung * 28);
      frames.push(done + noJong);
      if (jong) frames.push(done + ch);
    } else {
      frames.push(done + ch);
    }
    done += ch;
  }
  return frames;
}

const STEP_MS = 16; // 자모 하나
const GAP_MS = 220; // 말풍선 사이 쉼

type Phase = "idle" | "type1" | "type2" | "done";

/** 완성 문장 크기를 잡아 두고 그 위에 지금까지 써진 글자를 겹친다. */
function Typed({
  full,
  shown,
  typing,
}: {
  full: string;
  shown: string;
  typing: boolean;
}) {
  return (
    <span className="grid">
      <span className="invisible [grid-area:1/1]">{full}</span>
      <span aria-hidden className="[grid-area:1/1]">
        {shown}
        {typing && (
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-current" />
        )}
      </span>
    </span>
  );
}

export default function TypingChat({
  asker,
  question,
  answerer,
  answer,
  children,
}: {
  asker: string;
  question: string;
  answerer: string;
  answer: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const qFrames = useMemo(() => typingFrames(question), [question]);
  const aFrames = useMemo(() => typingFrames(answer), [answer]);

  // 화면에 들어오면 시작. 움직임 줄이기면 들어오는 순간 바로 끝 상태로.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase(reduced ? "done" : "type1");
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 단계 진행
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (phase === "type1") {
      if (step < qFrames.length)
        t = setTimeout(() => setStep(step + 1), STEP_MS);
      else
        t = setTimeout(() => {
          setStep(0);
          setPhase("type2");
        }, GAP_MS);
    }
    if (phase === "type2") {
      if (step < aFrames.length)
        t = setTimeout(() => setStep(step + 1), STEP_MS);
      else t = setTimeout(() => setPhase("done"), GAP_MS);
    }
    return () => clearTimeout(t);
  }, [phase, step, qFrames.length, aFrames.length]);

  const order: Phase[] = ["idle", "type1", "type2", "done"];
  const at = order.indexOf(phase);
  const showQ = at >= 1;
  const showA = at >= 2;
  const qShown =
    at > 1 ? question : phase === "type1" ? (qFrames[step - 1] ?? "") : "";
  const aShown =
    at > 2 ? answer : phase === "type2" ? (aFrames[step - 1] ?? "") : "";

  const bubbleIn = (on: boolean) =>
    `transition duration-500 ease-out ${on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`;

  return (
    <div ref={ref}>
      {/* 스크린리더에는 완성 문장을 바로 읽힌다. */}
      <p className="sr-only">
        {asker}: {question} {answerer}: {answer}
      </p>
      <div aria-hidden className="mx-auto grid max-w-2xl gap-5">
        <div className={`flex items-end gap-3 ${bubbleIn(showQ)}`}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-deep text-white/60">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h16l-1.5-5h-13z" />
              <path d="M5 10v9h14v-9" />
              <path d="M10 19v-5h4v5" />
            </svg>
          </span>
          <div>
            <p className="mb-1.5 pl-1 text-xs font-medium text-white/45">
              {asker}
            </p>
            <p className="rounded-2xl rounded-bl-sm border border-line bg-deep/70 px-6 py-4 text-fluid-xl font-bold break-keep text-white/85 sm:px-7">
              <Typed
                full={question}
                shown={qShown}
                typing={phase === "type1"}
              />
            </p>
          </div>
        </div>
        <div className={`flex items-end justify-end gap-3 ${bubbleIn(showA)}`}>
          <div className="text-right">
            <p className="mb-1.5 pr-1 text-xs font-medium text-white/45">
              {answerer}
            </p>
            <p className="rounded-2xl rounded-br-sm bg-accent px-6 py-4 text-left text-fluid-xl font-bold text-abyss sm:px-7">
              <Typed full={answer} shown={aShown} typing={phase === "type2"} />
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-base font-black text-accent">
            D
          </span>
        </div>
      </div>

      {/* 다 써지면 큰 제목이 떠오른다(.reveal 의 data-visible 을 그대로 쓴다). */}
      <div
        className="group/title reveal isolate"
        data-visible={phase === "done"}
      >
        {children}
      </div>
    </div>
  );
}
