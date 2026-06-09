import { Card, CardContent } from "@/components/atoms";

const architectureItems = [
  {
    title: "ITS CCTV API",
    detail: "전국 CCTV 목록",
    caption: "이름 · 위치 · URL · 도로 정보",
  },
  {
    title: "MariaDB",
    detail: "CCTV / Event",
    caption: "목록 및 이벤트 저장",
  },
  {
    title: "Python Worker",
    detail: "CCTV 순회",
    caption: "프레임 캡처 · 반복 분석",
  },
  {
    title: "1차 AI 탐지",
    detail: "YOLO / RT-DETR",
    caption: "fire · smoke · 이상 밝기",
  },
  {
    title: "2차 VLM 판단",
    detail: "GPT-4o / Qwen-VL",
    caption: "오탐 구분 · 상황 설명",
  },
  {
    title: "Flask Backend",
    detail: "REST API",
    caption: "이벤트 조회 · 관제 API",
  },
  {
    title: "Next Dashboard",
    detail: "React / Next.js",
    caption: "관제 화면 · 위험 알림",
  },
];

const techStacks = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "관제 대시보드 표시"],
  },
  {
    title: "Backend",
    items: ["Flask", "Backend API", "이벤트 기반 관제 API"],
  },
  {
    title: "AI Server",
    items: ["FastAPI", "YOLO / RT-DETR", "GPT-4o · Qwen-VL · Florence-2"],
  },
  {
    title: "Data & Worker",
    items: ["MariaDB", "Python Worker", "Local Storage / NAS"],
  },
  {
    title: "Vision Processing",
    items: ["OpenCV", "프레임 캡처", "화재/연기 후보 필터링"],
  },
  {
    title: "MVP Policy",
    items: ["Redis 미사용", "Kafka 미사용", "단일 Worker 순차 순회"],
  },
];

const databaseTables = [
  {
    name: "cctv",
    columns: ["id", "name", "road_name", "latitude", "longitude", "stream_url"],
  },
  {
    name: "event",
    columns: ["id", "cctv_id", "event_type", "risk_score", "snapshot_path", "vlm_reason", "created_at"],
  },
];

const mvpItems = [
  "ITS CCTV API 연동",
  "CCTV 목록 저장",
  "CCTV 순회 분석",
  "fire/smoke 후보 탐지",
  "VLM 기반 위험 판단",
  "이벤트 저장",
  "관제 대시보드 표시",
];

const expansionItems = [
  "Redis Queue 추가",
  "Kafka 기반 이벤트 스트리밍",
  "다중 Worker 분산 처리",
  "전국 CCTV 병렬 분석",
  "실시간 알림 시스템",
  "이상행동 탐지 기능",
  "사고/정차/역주행 탐지",
  "관리자 관제 시스템 고도화",
];

const workerSteps = [
  {
    title: "01. CCTV 목록 조회",
    description: "DB에서 분석 대상 CCTV 목록을 가져옵니다.",
  },
  {
    title: "02. 현재 프레임 캡처",
    description: "CCTV URL에 접속해 현재 프레임 1장을 캡처합니다.",
  },
  {
    title: "03. 1차 탐지 실행",
    description: "YOLO / RT-DETR이 fire, smoke, 이상 밝기 후보를 탐지합니다.",
  },
  {
    title: "04. VLM 정밀 판단",
    description: "후보가 발견되면 VLM이 실제 화재 여부와 판단 사유를 생성합니다.",
  },
  {
    title: "05. 이벤트 저장",
    description: "위험 상황이면 스냅샷, 위험도, VLM 판단 결과를 저장합니다.",
  },
];

export function DevelopmentInfo() {
  return (
    <section className="px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-[1720px]">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream-50 md:text-5xl">
            개발 정보
          </h1>
          <div className="mt-7 space-y-3 text-lg font-semibold leading-7 text-slate-500 dark:text-warm-300">
            <p>ITS 기반 전국 CCTV 화재 감지 시스템</p>
            <p>
              전국 ITS CCTV API를 활용하여 고속도로 CCTV 프레임을 주기적으로
              분석하고 화재 및 연기 의심 상황을 탐지합니다.
            </p>
            <p>초기 MVP는 Redis와 Kafka 없이 단일 Python Worker 기반 순차 순회 방식으로 구현합니다.</p>
          </div>
        </div>

        <div className="my-12 h-1 bg-flare-500" />

        <InfoSection title="System Architecture">
          <div className="grid gap-4 py-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {architectureItems.map((item, index) => (
              <div
                key={item.title}
                className="relative rounded-lg border border-warm-200 bg-cream-50 p-5 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-flare-500 text-sm font-black text-cream-50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black leading-6 text-slate-900 dark:text-cream-50">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-600 dark:text-warm-300">
                      {item.detail}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
                      {item.caption}
                    </p>
                  </div>
                </div>
                {index < architectureItems.length - 1 ? (
                  <span className="absolute -right-3 top-1/2 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full border border-warm-200 bg-warm-50 text-sm font-black text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-warm-300 sm:flex">
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </InfoSection>

        <InfoSection title="Tech Stack" className="mt-10">
          <div className="grid gap-7 lg:grid-cols-3">
            {techStacks.map((stack) => (
              <div
                key={stack.title}
                className="rounded-lg border border-warm-200 bg-cream-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900"
              >
                <h3 className="text-xl font-black text-flare-600 dark:text-flare-400">
                  {stack.title}
                </h3>
                <div className="mt-6 space-y-5 text-lg font-semibold text-slate-500 dark:text-warm-300">
                  {stack.items.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </InfoSection>

        <InfoSection title="Python Worker Flow" className="mt-10">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {workerSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-lg border border-warm-200 bg-cream-50 p-6 dark:border-slate-700 dark:bg-slate-900"
              >
                <h3 className="text-base font-black text-flare-600 dark:text-flare-400">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </InfoSection>

        <div className="mt-10 grid gap-10 xl:grid-cols-2">
          <InfoSection title="Database Tables">
            <div className="grid gap-5 md:grid-cols-2">
              {databaseTables.map((table) => (
                <div
                  key={table.name}
                  className="rounded-lg border border-warm-200 bg-cream-50 p-6 dark:border-slate-700 dark:bg-slate-900"
                >
                  <h3 className="text-xl font-black text-flare-600 dark:text-flare-400">
                    {table.name}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {table.columns.map((column) => (
                      <span
                        key={column}
                        className="rounded-md bg-warm-100 px-3 py-1 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-warm-300"
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </InfoSection>

          <InfoSection title="MVP & Expansion">
            <div className="grid gap-5 md:grid-cols-2">
              <ListPanel title="초기 MVP 범위" items={mvpItems} />
              <ListPanel title="향후 확장 방향" items={expansionItems} />
            </div>
          </InfoSection>
        </div>
      </div>
    </section>
  );
}

function InfoSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`rounded-xl border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className ?? ""}`}>
      <CardContent className="p-8">
        <h2 className="flex items-center gap-4 text-2xl font-black text-slate-900 dark:text-cream-50">
          <span className="h-8 w-1.5 rounded-full bg-flare-500" aria-hidden="true" />
          {title}
        </h2>
        <div className="mt-7">{children}</div>
      </CardContent>
    </Card>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-warm-200 bg-cream-50 p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-black text-flare-600 dark:text-flare-400">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
