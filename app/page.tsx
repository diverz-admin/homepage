import ContactForm from "./contact-form";

const services = [
  {
    title: "브랜드 전략",
    description:
      "시장과 고객을 다시 정의하고, 흔들리지 않는 브랜드의 축을 세웁니다.",
  },
  {
    title: "콘텐츠 프로덕션",
    description:
      "기획부터 촬영, 편집, 유통까지. 채널에 맞는 콘텐츠를 한 흐름으로 만듭니다.",
  },
  {
    title: "디지털 프로덕트",
    description:
      "웹사이트와 서비스를 설계하고 개발해 브랜드 경험을 제품으로 연결합니다.",
  },
];

const stats = [
  { value: "120+", label: "완료 프로젝트" },
  { value: "48", label: "함께한 브랜드" },
  { value: "9년", label: "축적된 경험" },
];

const navItems = [
  { href: "#about", label: "회사소개" },
  { href: "#services", label: "서비스" },
  { href: "#contact", label: "문의하기" },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-background/80 backdrop-blur dark:border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#" className="text-lg font-bold tracking-tight">
            DIVERZ
          </a>
          <nav className="flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="opacity-70 transition hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-black/5 dark:border-white/10">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"
          />
          <div className="mx-auto max-w-6xl px-6 py-28 text-center sm:py-36">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Brand · Content · Product
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              다양함이 만드는
              <br />
              새로운 기준, DIVERZ
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed opacity-70 sm:text-lg">
              브랜드 전략부터 콘텐츠, 디지털 프로덕트까지. 흩어져 있던 과제를
              하나의 흐름으로 연결해 비즈니스의 다음 단계를 만듭니다.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href="#contact"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                프로젝트 문의하기
              </a>
              <a
                href="#services"
                className="rounded-lg border border-black/10 px-6 py-3 text-sm font-semibold transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
              >
                서비스 살펴보기
              </a>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="border-b border-black/5 dark:border-white/10"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                하나의 팀, 세 개의 축
              </h2>
              <p className="mt-6 leading-relaxed opacity-70">
                DIVERZ는 전략가, 크리에이터, 엔지니어가 한 팀으로 일합니다.
                기획서에서 끝나지 않고 실제로 작동하는 결과물까지 책임집니다.
                브랜드의 언어를 정의하고, 그 언어를 콘텐츠와 제품으로
                구현합니다.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-6 self-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-sm opacity-60">{stat.label}</dt>
                  <dd className="mt-1 text-3xl font-bold tracking-tight">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="services"
          className="border-b border-black/5 dark:border-white/10"
        >
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              서비스
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {services.map((service, index) => (
                <article
                  key={service.title}
                  className="rounded-2xl border border-black/5 bg-black/[0.02] p-8 transition hover:border-indigo-500/40 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <span className="text-sm opacity-40">0{index + 1}</span>
                  <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-70">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                프로젝트 문의
              </h2>
              <p className="mt-6 leading-relaxed opacity-70">
                진행 중인 과제나 아이디어를 남겨 주세요. 담당자가 확인 후 영업일
                기준 2일 내에 회신드립니다.
              </p>
              <p className="mt-8 text-sm opacity-60">
                hello@diverz.co.kr
                <br />
                서울특별시 강남구
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} DIVERZ. All rights reserved.</span>
          <span>Built with Next.js · Supabase · Vercel</span>
        </div>
      </footer>
    </>
  );
}
