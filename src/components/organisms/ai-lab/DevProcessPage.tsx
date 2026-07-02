import type { ReactNode } from "react";

// ─── 공통 헬퍼 ─────────────────────────────────────────────────────

function StepSection({
  stepNumber,
  title,
  quote,
  id,
  children,
}: {
  stepNumber: string;
  title: string;
  quote: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-20 pb-14">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-flare-500 text-base font-black text-cream-50">
          {stepNumber}
        </span>
        <div>
          <h2 className="text-3xl font-black uppercase text-slate-900 dark:text-cream-50">{title}</h2>
          <p className="mt-2 text-lg font-semibold text-slate-500 dark:text-warm-300">{quote}</p>
        </div>
      </div>
      {children}
      <div className="mt-14 h-px bg-warm-200 dark:bg-slate-700" />
    </div>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-3 text-xl font-black text-slate-900 dark:text-cream-50">
      <span aria-hidden className="h-5 w-1 rounded-full bg-flare-500" />
      {children}
    </h3>
  );
}

function InfoBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border-l-4 border-flare-500 bg-cream-50 p-5 dark:bg-slate-900 ${className ?? ""}`}>
      {children}
    </div>
  );
}

function FlowBox({
  children,
  highlight = false,
  dashed = false,
}: {
  children: ReactNode;
  highlight?: boolean;
  dashed?: boolean;
}) {
  return (
    <div
      className={`rounded px-4 py-3 text-center text-base font-bold ${highlight
        ? "border-2 border-flare-500 bg-flare-500/10 text-flare-600 dark:text-flare-400"
        : dashed
          ? "border-2 border-dashed border-warm-300 text-slate-400 dark:border-slate-600 dark:text-slate-500"
          : "border-2 border-warm-200 bg-cream-50 text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-cream-50"
        }`}
    >
      {children}
    </div>
  );
}

function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-0.5">
      <div className="h-4 w-px bg-warm-300 dark:bg-slate-600" />
      {label && (
        <span className="rounded bg-warm-100 px-2 py-0.5 text-sm font-semibold text-slate-500 dark:bg-slate-700 dark:text-warm-300">
          {label}
        </span>
      )}
    </div>
  );
}

function DataTable({
  headers,
  rows,
  colWidths,
}: {
  headers: string[];
  rows: Array<{ cells: string[]; highlight?: boolean }>;
  colWidths?: string;
}) {
  const cols = headers.length;
  const gridCols = colWidths ?? `repeat(${cols}, minmax(0,1fr))`;
  return (
    <div className="overflow-hidden rounded-lg border-2 border-warm-200 dark:border-slate-600">
      <div
        className="border-b-2 border-warm-200 bg-warm-100 dark:border-slate-600 dark:bg-slate-700"
        style={{ display: "grid", gridTemplateColumns: gridCols }}
      >
        {headers.map((h) => (
          <div
            key={h}
            className="border-r-2 border-warm-200 px-4 py-2.5 text-sm font-black uppercase tracking-wide text-slate-700 last:border-r-0 dark:border-slate-600 dark:text-warm-300"
          >
            {h}
          </div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`border-t-2 border-warm-200 dark:border-slate-600 ${row.highlight ? "bg-flare-500/10" : "bg-cream-50 dark:bg-slate-900"
            }`}
          style={{ display: "grid", gridTemplateColumns: gridCols }}
        >
          {row.cells.map((cell, j) => (
            <div
              key={j}
              className={`border-r-2 border-warm-200 px-4 py-3 text-base last:border-r-0 dark:border-slate-600 ${j === 0
                ? row.highlight
                  ? "font-black text-flare-600 dark:text-flare-400"
                  : "font-black text-slate-900 dark:text-cream-50"
                : row.highlight
                  ? "font-semibold text-flare-600 dark:text-flare-400"
                  : "font-semibold text-slate-500 dark:text-warm-300"
                }`}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MediaBox({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="overflow-hidden rounded-lg border-2 border-warm-200 bg-cream-50 dark:border-slate-600 dark:bg-slate-900">
      <img src={src} alt={alt} className="w-full" />
      {caption && (
        <figcaption className="border-t-2 border-warm-200 px-4 py-2.5 text-sm font-semibold text-slate-500 dark:border-slate-600 dark:text-warm-300">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// 페이지 내부 이동용 미니 메뉴
const SECTIONS = [
  { id: "step-01", num: "01", label: "문제 정의" },
  { id: "step-02", num: "02", label: "데이터셋 구성" },
  { id: "step-03", num: "03", label: "증강 파이프라인" },
  { id: "step-04", num: "04", label: "모델 선정" },
  { id: "step-05", num: "05", label: "파이프라인 아키텍처" },
  { id: "step-06", num: "06", label: "반복 개선 과정" },
  { id: "step-07", num: "07", label: "확장 로드맵" },
  { id: "step-08", num: "08", label: "결론" },
];

function SectionNav() {
  return (
    <nav className="sticky top-0 z-10 -mx-5 mb-12 border-b-2 border-warm-200 bg-cream-50/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 dark:border-slate-700 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-1 gap-y-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded px-2.5 py-1 text-sm font-black text-slate-500 transition-colors hover:bg-flare-500/10 hover:text-flare-600 dark:text-warm-300 dark:hover:text-flare-400"
          >
            <span className="text-flare-500">{s.num}</span> {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────

export function DevProcessPage() {
  return (
    <section className="px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-4xl">

        {/* 페이지 헤더 */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-slate-900 dark:text-cream-50 md:text-6xl">개발 과정</h1>
          <div className="mt-7 space-y-3 text-xl font-semibold leading-8 text-slate-500 dark:text-warm-300">
            <p>터널 CCTV 화재 감지 AI 시스템 — 오탐을 줄여, 신뢰를 회복하기까지</p>
            <p>화재 탐지에서 가장 위험한 것은 화재 그 자체가 아니라, "또 잘못 울린 경보"일지도 모릅니다.</p>
          </div>
        </div>

        <div className="my-12 h-1 bg-flare-500" />

        <SectionNav />

        <div>

          {/* ── 01. 문제 정의 ── */}
          <StepSection id="step-01" stepNumber="01" title="문제 정의" quote='"없는 불을 있다고 우는 것이 더 위험하다"'>
            <div className="space-y-6">
              <div>
                <SubTitle>터널 환경의 특수성과 한계</SubTitle>
                <p className="text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  터널은 AI 화재 탐지에 있어 가장 까다로운 환경 중 하나입니다. <br />연기 경계가 불분명하고, 차량 전조등·후미등이
                  화염과 시각적으로 유사하며, <br />조명과 반사광이 끊임없이 모델을 속입니다.
                </p>
              </div>

              <MediaBox
                src="/ai-lab/dev-process/01_tunnel_fire_accident.jpg"
                alt="2022 과천 제2경인고속도로 터널 화재 사고"
                caption="2022 과천 제2경인고속도로 터널 화재 — CCTV 미확인 및 오탐 누적으로 인한 초기 대응 지연 사례"
              />

              <InfoBox>
                <h4 className="mb-3 text-base font-black text-flare-600 dark:text-flare-400">
                  2022 과천 제2경인고속도로 터널 화재
                </h4>
                <ul className="space-y-2">
                  {[
                    "사망 5명, 부상 56명",
                    "CCTV 미확인으로 초기 대응 지연",
                    "오탐 누적으로 경보 신뢰도 저하가 사고 확대의 한 요인으로 지적",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
                      <span className="text-base font-semibold text-slate-600 dark:text-warm-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </InfoBox>

              <div>
                <SubTitle>신뢰도 하락의 악순환 구조</SubTitle>
                <div className="space-y-2">
                  <FlowBox>False Alarm (오탐) 반복</FlowBox>
                  <FlowArrow />
                  <FlowBox>경보 시스템 신뢰도 하락</FlowBox>
                  <FlowArrow />
                  <FlowBox highlight>진짜 화재 발생 시 묵살</FlowBox>
                  <FlowArrow />
                  <FlowBox dashed>시스템 폐기 및 무용지물화</FlowBox>
                </div>
                <br />
                <p className="mt-5 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  <span className="font-black text-slate-900 dark:text-cream-50">오탐을 줄이는 것이 곧 가장 빠른 화재 대응</span>
                  이라는 역설.<br /> 이것이 본 프로젝트의 출발점이자 모든 설계 결정의 기준이 되었습니다.
                </p>
              </div>
            </div>
          </StepSection>

          {/* ── 02. 데이터셋 구성 ── */}
          <StepSection
            id="step-02"
            stepNumber="02"
            title="데이터셋 구성"
            quote="양보다 품질, 약점은 직접 라벨링 — 오탐 억제의 토대"
          >
            <div className="space-y-8">
              <div>
                <SubTitle>클래스 설계 및 의도</SubTitle>
                <DataTable
                  headers={["클래스", "역할", "설계 의도"]}
                  colWidths="1fr 1.5fr 2fr"
                  rows={[
                    { cells: ["fire", "즉각 알림 트리거", "고대비·고온 색상 탐지 특화"] },
                    { cells: ["smoke", "조기 경보 핵심", "경계 불명확, 최고 난이도 — 화재의 전조증상"] },
                    { cells: ["carlight", "오탐 억제 (네거티브 클래스)", "차량 등화류 ↔ 화염 혼동을 구조적으로 차단"], highlight: true },
                  ]}
                />
                <p className="mt-4 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  carlight는 그 자체가 탐지 목적이 아닙니다. <br />터널 내 전조등·후미등이 fire/smoke로 오인되는 것을 막기 위한
                  네거티브 보조 클래스로 설계되었으며, <br />단독 검출 시에는 알림을 발생시키지 않습니다.
                </p>
              </div>

              <div>
                <SubTitle>데이터 성장 과정 — V1 → V3 → V4</SubTitle>
                <DataTable
                  headers={["버전", "이미지 수", "어노테이션", "핵심 변화"]}
                  colWidths="0.5fr 1fr 1fr 2fr"
                  rows={[
                    { cells: ["V1", "1,330장", "2,513개", "베이스라인, 야외 환경 위주"] },
                    { cells: ["V3", "12,853장", "21,802개", "라벨 정제 + 야간 화재 도메인 보강"] },
                    { cells: ["V4", "14,053장", "24,829개", "carlight 직접 라벨링 +487%"], highlight: true },
                  ]}
                />
                <MediaBox
                  src="/ai-lab/dev-process/02_data_growth_chart.png"
                  alt="V1 → V3 → V4 데이터 성장 추이"
                  caption="V1 → V3 → V4 데이터 성장 — 양적 확장보다 도메인 적합성과 약점 보강에 집중"
                />
              </div>

              <div>
                <SubTitle>V4 데이터 규모 (현재)</SubTitle>
                <div className="space-y-3">
                  {[
                    { value: "14,053", label: "전체 이미지 장수", sub: "train 12,647 / val 1,406" },
                    { value: "24,829", label: "어노테이션 총합", sub: "fire 8,626 / smoke 12,036 / carlight 6,834" },
                    { value: "+487%", label: "carlight 어노테이션 증가", sub: "1,059개 → 6,210개 직접 라벨링 보강" },
                  ].map((stat) => (
                    <div
                      key={stat.value}
                      className="flex items-center gap-5 rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900"
                    >
                      <div className="text-4xl font-black text-flare-600 dark:text-flare-400">{stat.value}</div>
                      <div>
                        <div className="text-base font-black text-slate-900 dark:text-cream-50">{stat.label}</div>
                        <div className="text-sm font-semibold text-slate-500 dark:text-warm-300">{stat.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-black uppercase tracking-wider text-slate-700 dark:text-warm-300">
                  클래스 분포 균형화 (V3 → V4 어노테이션 비중)
                </p>
                <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-warm-300">V3</p>
                <div className="flex h-7 overflow-hidden rounded border-2 border-warm-200 dark:border-slate-600">
                  <div className="flex w-[55%] items-center justify-center bg-slate-400 text-sm font-black text-white">
                    SMOKE 55%
                  </div>
                  <div className="flex w-[40%] items-center justify-center bg-slate-600 text-sm font-black text-white">
                    FIRE 40%
                  </div>
                  <div className="flex w-[5%] items-center justify-center bg-flare-500 text-sm font-black text-slate-900">
                    5%
                  </div>
                </div>
                <p className="mb-3 mt-4 text-sm font-semibold text-slate-500 dark:text-warm-300">V4</p>
                <div className="flex h-7 overflow-hidden rounded border-2 border-warm-200 dark:border-slate-600">
                  <div className="flex w-[44.9%] items-center justify-center bg-slate-400 text-sm font-black text-white">
                    SMOKE 44.9%
                  </div>
                  <div className="flex w-[31.7%] items-center justify-center bg-slate-600 text-sm font-black text-white">
                    FIRE 31.7%
                  </div>
                  <div className="flex w-[23.4%] items-center justify-center bg-flare-500 text-sm font-black text-slate-900">
                    CARLIGHT 23.4%
                  </div>
                </div>
                <p className="mt-3 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  carlight 비중을 5% → 23.4%로 끌어올린 것은 단순한 양의 증가가 아닙니다.<br />
                  모델이 <span className="font-black text-slate-900 dark:text-cream-50">"이것은 화염이 아니다"</span>를
                  명확히 학습할 수 있도록 의도적으로 만든 균형입니다.
                </p>
              </div>

              <div>
                <SubTitle>데이터 전략에서 얻은 3가지 교훈</SubTitle>
                <div className="space-y-4">
                  <InfoBox>
                    <h4 className="mb-2 text-base font-black text-flare-600 dark:text-flare-400">
                      ① 데이터의 양보다 품질이 우선이다
                    </h4>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      초기에 외부 데이터를 단순 추가하는 방식을 검토했으나, 라벨 품질 검증 없이 양만 늘리는 접근은 오히려
                      성능을 저하시킬 수 있음을 확인했습니다. V3에서는 데이터를 무작정 늘리는 대신 라벨 정제와 도메인
                      적합 증강에 집중하여 성능을 회복·개선했습니다.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <h4 className="mb-2 text-base font-black text-flare-600 dark:text-flare-400">
                      ② 약점은 직접 라벨링한 데이터로만 잡힌다
                    </h4>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      모델의 약점은 자동으로 해결되지 않습니다. V4에서 carlight 클래스의 약점을 발견했을 때, 외부 데이터를
                      끌어다 쓰는 대신 1,200장을 직접 추가 라벨링하여 어노테이션을 +487% 보강했습니다. 결과적으로 carlight
                      정확도뿐 아니라 다른 클래스의 오탐까지 동시에 줄었습니다.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <h4 className="mb-2 text-base font-black text-flare-600 dark:text-flare-400">
                      ③ 평가 데이터셋도 노가다가 필요하다
                    </h4>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      좋은 데이터는 학습용만 필요한 게 아닙니다. V3 val 셋(133장)으로는 보이지 않던 carlight 약점이,
                      val을 1,406장으로 확장하고 독립 test_300을 구축하고 나서야 드러났습니다.
                      <span className="font-black text-slate-900 dark:text-cream-50"> 평가가 부실하면 모델의 약점을 볼 수 없습니다.</span>
                    </p>
                  </InfoBox>
                </div>
              </div>
            </div>
          </StepSection>

          {/* ── 03. 데이터 증강 파이프라인 ── */}
          <StepSection
            id="step-03"
            stepNumber="03"
            title="데이터 증강 파이프라인"
            quote="두 번의 도메인 보강 — 모두 오탐 억제를 향한 직접 라벨링"
          >
            <div className="space-y-8">
              <div>
                <SubTitle>증강 기법 파이프라인</SubTitle>
                <p className="mb-5 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  터널 CCTV 환경의 다양한 조도, 거리, 각도 변화에 대응하기 위해 체계적인 증강 파이프라인을 구성했습니다.
                </p>
                <DataTable
                  headers={["기법", "파라미터", "목적"]}
                  rows={[
                    { cells: ["RandomPhotometricDistort", "p=0.5", "조도·색상 변화 대응"] },
                    { cells: ["RandomZoomOut", "—", "소형 객체 탐지 강화"] },
                    { cells: ["RandomIoUCrop", "p=0.8", "부분 가림 상황 대응"] },
                    { cells: ["RandomHorizontalFlip", "—", "좌우 대칭 일반화"] },
                    { cells: ["Resize", "640×640", "표준 입력 크기 통일"] },
                    { cells: ["Multi-scale", "480~800", "다양한 해상도 대응"], highlight: true },
                  ]}
                />
              </div>

              <div>
                <SubTitle>두 번의 도메인 보강 — 같은 목표, 같은 방식</SubTitle>
                <DataTable
                  headers={["단계", "보강 내용", "목적"]}
                  colWidths="0.5fr 2fr 1fr"
                  rows={[
                    { cells: ["V3", "야간 화재 63장 × 5배 = 378장", "터널 도메인 적응"] },
                    { cells: ["V4", "carlight 전용 1,200장 직접 추가 라벨링", "오탐 억제 강화"], highlight: true },
                  ]}
                />
                <InfoBox className="mt-5">
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    V3와 V4의 데이터 보강은 다른 클래스에 적용되었지만, <span className="font-black text-slate-900 dark:text-cream-50">목표는 동일했습니다 — 오탐 억제</span>.
                    그리고 두 보강 모두 외부 데이터에 의존하지 않고 <span className="font-black text-slate-900 dark:text-cream-50">직접 라벨링한 데이터</span>였습니다.
                  </p>
                </InfoBox>
              </div>

              <div>
                <SubTitle>Multi-scale 증강의 의미</SubTitle>
                <MediaBox
                  src="/ai-lab/dev-process/03_multiscale_aug.png"
                  alt="Multi-scale 증강 시각화"
                  caption="Multi-scale 증강 (480/640/800px) — 다양한 거리·크기의 객체에 대한 강건성 확보"
                />
                <div className="mt-5 space-y-3">
                  {[
                    { label: "480px", note: "근거리 대형 객체", pct: "55%" },
                    { label: "640px", note: "표준 입력 크기", pct: "75%" },
                    { label: "800px", note: "원거리 소형 객체 탐지", pct: "100%" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="w-16 text-sm font-black text-slate-700 dark:text-warm-300">{item.label}</span>
                      <div className="flex flex-1 items-center gap-3">
                        <div
                          className="h-6 rounded border-2 border-warm-200 bg-warm-200 dark:border-slate-600 dark:bg-slate-600"
                          style={{ width: item.pct }}
                        />
                        <span className="text-sm font-semibold text-slate-500 dark:text-warm-300">{item.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SubTitle>부수 효과 — 데이터 균형의 간접적 위력</SubTitle>
                <MediaBox
                  src="/ai-lab/dev-process/03_v4_results.png"
                  alt="V4 학습 결과 그래프"
                  caption="V4 학습 곡선 (results.png) — Loss 안정 감소 및 mAP 수렴 양상"
                />
                <p className="mt-5 mb-3 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  V4에서 carlight 데이터만 보강했을 뿐인데, 다음과 같은 부수 효과가 관찰되었습니다:
                </p>
                <DataTable
                  headers={["지표", "V3", "V4", "변화"]}
                  rows={[
                    { cells: ["small 객체 AP (test_300)", "0.050", "0.2294", "× 4.6"], highlight: true },
                    { cells: ["background → smoke 오탐", "0.82", "0.55", "-0.27"], highlight: true },
                  ]}
                />
                <InfoBox className="mt-5">
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    한 클래스의 정밀한 데이터 보강이 <span className="font-black text-flare-600 dark:text-flare-400">다른 클래스의 오탐까지 줄였습니다</span>.<br />
                    오탐 억제는 단일 클래스 튜닝이 아닌, <span className="font-black text-slate-900 dark:text-cream-50">데이터 전체 구성의 문제</span>입니다.
                  </p>
                </InfoBox>
              </div>
            </div>
          </StepSection>

          {/* ── 04. 모델 선정 ── */}
          <StepSection
            id="step-04"
            stepNumber="04"
            title="모델 선정"
            quote="연기를 놓치지 않는 구조 — RT-DETRv2 채택"
          >
            <div className="space-y-8">
              <div>
                <SubTitle>구조적 특성 비교</SubTitle>
                <div className="space-y-3">
                  {[
                    { label: "YOLO 계열", desc: "앵커 기반 + NMS, 지역 특징 의존 → 등화류와 화염 혼동에 취약", highlight: false },
                    { label: "RT-DETRv2", desc: "Hungarian Matching 기반 End-to-End, Transformer 전역 문맥 파악", highlight: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex overflow-hidden rounded-lg border-2 ${item.highlight ? "border-flare-500" : "border-warm-200 dark:border-slate-600"}`}
                    >
                      <div
                        className={`flex w-32 shrink-0 items-center justify-center px-3 py-3 text-center text-base font-black ${item.highlight
                          ? "bg-flare-500 text-cream-50"
                          : "bg-warm-100 text-slate-700 dark:bg-slate-700 dark:text-warm-300"
                          }`}
                      >
                        {item.label}
                      </div>
                      <div className="flex items-center px-4 py-3 text-base font-semibold text-slate-600 dark:text-warm-300">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SubTitle>왜 RT-DETRv2인가 — 연기는 화재의 전조다</SubTitle>
                <p className="mb-4 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  화재 탐지에서 가장 중요한 신호는 무엇일까요?<br /> <span className="font-black text-slate-900 dark:text-cream-50">불꽃이 아니라 연기입니다.</span>
                  연기가 보이는 순간이 화재 초기 대응의 골든 타임이며, <br />이 단계를 놓치면 인명 피해로 직결됩니다.
                </p>
                <InfoBox>
                  <p className="mb-3 text-base font-black text-slate-900 dark:text-cream-50">연기의 특성</p>
                  <ul className="space-y-2">
                    {[
                      "경계가 불분명하다",
                      "형태가 시시각각 변한다",
                      "배경과의 대비가 약하다",
                      "광역으로 확산한다",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
                        <span className="text-base font-semibold text-slate-600 dark:text-warm-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    이런 객체를 정확히 탐지하려면 <span className="font-black text-flare-600 dark:text-flare-400">국소적인 특징이 아니라 전역적인 문맥</span>을 봐야 합니다.<br />
                    이것이 Transformer 기반의 RT-DETRv2를 채택한 핵심 이유입니다.
                  </p>
                </InfoBox>
              </div>

              <div>
                <SubTitle>정량 검증 — RT-DETRv2 V4 클래스별 성능 (test_300 독립 평가)</SubTitle>
                <DataTable
                  headers={["클래스", "AP@50", "의미"]}
                  rows={[
                    { cells: ["fire", "0.9829", "화염은 거의 놓치지 않는다"] },
                    { cells: ["smoke", "0.8931", "화재 전조 탐지 — 핵심 강점"], highlight: true },
                    { cells: ["carlight", "0.9041", "오탐 억제 클래스 안정"] },
                    { cells: ["mAP@50", "0.9267", "종합 성능"], highlight: true },
                  ]}
                />
                <MediaBox
                  src="/ai-lab/dev-process/04_v3_vs_v4_map_chart.png"
                  alt="V3 vs V4 mAP@50 비교"
                  caption="test_300 독립 평가 기준 — V3 mAP@50 0.7857 → V4 mAP@50 0.9267 (+0.141)"
                />
              </div>

              <div>
                <SubTitle>속도 한계와 운영 전략</SubTitle>
                <p className="mb-4 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  RT-DETRv2는 YOLO 대비 추론 속도가 다소 느립니다. 그러나 <span className="font-black text-slate-900 dark:text-cream-50">운영 전략으로 이 한계를 상쇄</span>합니다.
                </p>
                <ul className="space-y-4">
                  {[
                    { title: "5FPS 다운샘플링 적용", desc: "동시 다채널 CCTV 모니터링 부담 완화" },
                    { title: "22채널 동시 커버 가능", desc: "48 FPS ÷ 5FPS = 채널 다중화" },
                    { title: "TensorRT FP16 최적화 검토", desc: "향후 추가 속도 개선 및 동시 처리 채널 확대 가능" },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
                      <div>
                        <div className="text-base font-black text-slate-900 dark:text-cream-50">{item.title}</div>
                        <div className="text-sm font-semibold text-slate-500 dark:text-warm-300">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-lg border-2 border-flare-500 p-5">
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    <span className="font-black text-flare-600 dark:text-flare-400">"속도를 일부 포기하더라도, 연기를 놓치지 않는다."</span>
                    <br />
                    이것이 본 시스템의 모델 선정 철학입니다.
                  </p>
                </div>
              </div>

              <div>
                <SubTitle>NMS-free 구조의 현실과 정직한 대응</SubTitle>
                <p className="mb-4 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  RT-DETRv2는 이론상 NMS 후처리가 불필요한 End-to-End 구조입니다. <br />그러나 실제 추론에서는 학습이 완전히 수렴되지 않은
                  상태에서 동일 객체에 여러 쿼리가 반응해 <br />중복 bbox가 발생하는 현상이 관찰되었습니다.
                </p>
                <DataTable
                  headers={["후처리 설정", "값", "역할"]}
                  rows={[
                    { cells: ["score threshold", "0.5", "confidence 0.5 미만 bbox 선제거"] },
                    { cells: ["NMS IoU threshold", "0.5", "동일 클래스 내 50% 이상 중복 bbox 제거"] },
                  ]}
                />
                <p className="mt-4 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  NMS-free의 완전한 장점은 희석되었지만, <br />쿼리 수가
                  <span className="font-black text-slate-900 dark:text-cream-50"> 300개로 제한</span>되어 있어 YOLO 대비 NMS 연산
                  부담은 여전히 현저히 낮습니다. <br />이 점은 정직하게 기록합니다.
                </p>
              </div>
            </div>
          </StepSection>

          {/* ── 05. 파이프라인 아키텍처 ── */}
          <StepSection
            id="step-05"
            stepNumber="05"
            title="파이프라인 아키텍처"
            quote="비전 모델 탐지 → VLM 재검증 → 관제센터 보고: 2단 이중 차단 구조"
          >
            <div className="space-y-8">
              <p className="text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                단일 모델 판단에 의존하지 않고, 탐지 결과를 VLM이 재검증하는 <span className="font-black text-slate-900 dark:text-cream-50">2단 구조로 오탐을 이중 차단</span>합니다.
              </p>

              <MediaBox
                src="/ai-lab/dev-process/05_pipeline_architecture.png"
                alt="전체 시스템 아키텍처 다이어그램"
                caption="전체 시스템 아키텍처 — CCTV → RT-DETRv2 → VLM 재검증 → 관제센터 보고"
              />

              <div>
                <SubTitle>파이프라인 3단계</SubTitle>
                <DataTable
                  headers={["단계", "구성 요소", "역할"]}
                  colWidths="0.5fr 1.5fr 2fr"
                  rows={[
                    { cells: ["1단계", "RT-DETRv2 (5FPS 샘플링)", "CCTV 영상에서 fire/smoke/carlight 1차 탐지"] },
                    { cells: ["2단계", "VLM 재검증 (이벤트 발견 시 트리거)", "컨텍스트 기반 재판단 및 오탐 필터링"], highlight: true },
                    { cells: ["3단계", "관제센터 보고 판단", "확정 알림만 전송, 운영자 최종 판단 지원"] },
                  ]}
                />
              </div>

              <div>
                <SubTitle>VLM 게이트 임계값 로직 (test_300 Threshold Sweep 근거)</SubTitle>
                <DataTable
                  headers={["조건", "처리"]}
                  rows={[
                    { cells: ["fire ≥ 0.70 (P 0.946 / R 0.991)", "즉시 알림"] },
                    { cells: ["smoke ≥ 0.70 (P 0.901 / R 0.808)", "즉시 알림"] },
                    { cells: ["fire/smoke 0.30~0.70", "VLM 게이트로 이동"], highlight: true },
                    { cells: ["carlight + fire/smoke 동시 검출", "confidence 무관 VLM 게이트 강제 이동"], highlight: true },
                    { cells: ["carlight 단독 검출", "무시 (네거티브 클래스 설계 의도)"] },
                    { cells: ["confidence < 0.30", "무시"] },
                  ]}
                />
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-400 dark:text-warm-300">
                  carlight 단독 검출은 무시되지만, fire/smoke와 동시 검출되는 경우는 confidence와 무관하게 VLM
                  재검증으로 강제 이동시켜<br /> <span className="font-black text-slate-700 dark:text-warm-300">등화류 혼동발 오탐을 한 번 더 차단</span>합니다.
                </p>
              </div>

              <div>
                <SubTitle>분기 플로우</SubTitle>
                <div className="space-y-2">
                  <FlowBox>CCTV 영상 입력</FlowBox>
                  <FlowArrow />
                  <FlowBox>[1단계] RT-DETRv2 추론 (5FPS)</FlowBox>
                  <FlowArrow label="0.30~0.70 또는 carlight 동시검출" />
                  <FlowBox highlight>[2단계] VLM 재검증 — 컨텍스트 기반 재판단</FlowBox>
                  <FlowArrow label="확정 판단 시" />
                  <FlowBox>[3단계] 관제센터 보고 — 운영자 최종 판단</FlowBox>
                </div>
              </div>

              <div>
                <SubTitle>4-VM 인프라 구성</SubTitle>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Frontend 서버", desc: "관제 대시보드 UI 제공", accent: false },
                    { title: "Backend 서버", desc: "API 및 알림 처리", accent: false },
                    { title: "AI·VLM 서버", desc: "RT-DETRv2 + VLM 추론 엔진", accent: true },
                    { title: "Python Worker", desc: "영상 스트림 처리 및 샘플링", accent: false },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className={`rounded-lg border-2 p-4 ${item.accent
                        ? "border-flare-500 bg-flare-500/5"
                        : "border-warm-200 bg-cream-50 dark:border-slate-700 dark:bg-slate-900"
                        }`}
                    >
                      <div className={`text-base font-black ${item.accent ? "text-flare-600 dark:text-flare-400" : "text-slate-900 dark:text-cream-50"}`}>
                        {item.title}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-warm-300">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StepSection>

          {/* ── 06. 반복 개선 과정 ── */}
          <StepSection
            id="step-06"
            stepNumber="06"
            title="반복 개선 과정"
            quote="V3에서 V4로 — 약점을 발견하고, 직접 라벨링으로 잡다"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <SubTitle>V3 성과 확인</SubTitle>
                <div className="space-y-3">
                  {[
                    { value: "0.952", label: "mAP@50 (val 1,286장, 50 Epochs)" },
                    { value: "-57%", label: "학습 손실 감소 (27.6 → 11.8)" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900"
                    >
                      <div className="text-3xl font-black text-flare-600 dark:text-flare-400">{stat.value}</div>
                      <div className="mt-1 text-base font-semibold text-slate-500 dark:text-warm-300">{stat.label}</div>
                    </div>
                  ))}
                  <InfoBox>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      약 20에폭 부근 mAP50 조기 수렴 확인
                    </p>
                  </InfoBox>
                </div>
                <MediaBox
                  src="/ai-lab/dev-process/06_v3_matrix.png"
                  alt="V3 Confusion Matrix"
                  caption="V3 Confusion Matrix — 클래스 간 혼동은 적으나 background → smoke 오탐(0.82)이 잔존"
                />
              </div>

              <div className="space-y-4">
                <SubTitle>V3에서 드러난 한계 (test_300 독립 평가)</SubTitle>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                    <div className="text-3xl font-black text-flare-600 dark:text-flare-400">0.050</div>
                    <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-warm-300">small 객체 AP — 소형 객체 탐지 취약</div>
                  </div>
                  <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                    <div className="text-3xl font-black text-flare-600 dark:text-flare-400">0.454</div>
                    <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-warm-300">carlight AP — val로는 안 보이던 실제 약점</div>
                  </div>
                </div>
                <InfoBox>
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    V3 val(133장, carlight 81개)은 표본 부족으로 carlight 성능을 <span className="font-black text-flare-600 dark:text-flare-400">과대평가</span>하고 있었습니다.<br />
                    독립 test_300 평가를 통해서야 carlight AP가 실제로는 <span className="font-black text-flare-600 dark:text-flare-400">0.454에 불과</span>하다는 사실이 드러났습니다.
                    <br />
                    <br />
                    — <span className="font-black text-slate-900 dark:text-cream-50">02번 교훈 ③ "평가 데이터셋도 노가다가 필요하다"</span>가 회수되는 순간입니다.
                  </p>
                </InfoBox>
              </div>

              <div className="space-y-4">
                <SubTitle>V4 개선 — carlight 정조준 보강</SubTitle>
                <MediaBox
                  src="/ai-lab/dev-process/06_carlight_labeling.jpg"
                  alt="carlight 직접 라벨링 작업"
                  caption="Roboflow에서 carlight 전용 데이터 1,200장 직접 라벨링 — 외부 데이터에 의존하지 않고 약점을 직접 보강"
                />
                <DataTable
                  headers={["지표", "V3", "V4", "변화"]}
                  rows={[
                    { cells: ["carlight 어노테이션", "1,059개", "6,210개", "+487%"], highlight: true },
                    { cells: ["small 객체 AP (test_300)", "0.050", "0.2294", "× 4.6"], highlight: true },
                    { cells: ["background → smoke 오탐", "0.82", "0.55", "-0.27"] },
                    { cells: ["background → carlight 오탐", "—", "0.34", "신규 발생"] },
                  ]}
                />
                <InfoBox>
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    carlight 데이터만 보강했는데 small 객체 AP와 background → smoke 오탐까지 함께 개선되었습니다.<br />
                    <span className="font-black text-slate-900 dark:text-cream-50"> 클래스 간 데이터 균형이 모델 전체 품질에 영향을 미친다</span>는 점이 입증된 결과입니다.
                  </p>
                </InfoBox>
                <MediaBox
                  src="/ai-lab/dev-process/06_v4_results.png"
                  alt="V4 학습 결과"
                  caption="V4 results.png — Loss 안정 감소, mAP 수렴 양상 (ep20 이후 plateau)"
                />
              </div>

              <div className="space-y-4">
                <SubTitle>test_300 동일 기준 V3 vs V4 (유일한 공정 비교)</SubTitle>
                <DataTable
                  headers={["클래스", "V3 AP@50", "V4 AP@50", "변화"]}
                  rows={[
                    { cells: ["fire", "0.9857", "0.9829", "-0.003"] },
                    { cells: ["smoke", "0.9171", "0.8931", "-0.024"] },
                    { cells: ["carlight", "0.4543", "0.9041", "+0.450"], highlight: true },
                    { cells: ["mAP@50", "0.7857", "0.9267", "+0.141"], highlight: true },
                  ]}
                />
                <p className="text-sm font-semibold leading-6 text-slate-400 dark:text-warm-300">
                  fire/smoke 성능은 거의 그대로 유지된 채 carlight만 정확히 개선되어, <span className="font-black text-slate-700 dark:text-warm-300">carlight 보강이 기존 클래스 성능을 희생하지 않았음</span>을 확인했습니다.
                </p>
              </div>

              <div className="space-y-4">
                <SubTitle>V4에서 새롭게 드러난 한계 — 정직한 기록</SubTitle>
                <InfoBox>
                  <h4 className="mb-2 text-base font-black text-flare-600 dark:text-flare-400">① Underfitting 패턴</h4>
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    ep12 이후 train loss는 계속 감소하지만 val mAP는 정체되는 패턴이 관찰되었습니다.<br />
                    imgsz=640 기준에서 모델이 학습 가능한 상한에 근접했음을 의미하며, 에폭 추가만으로는 성능 향상이 어렵습니다.
                    <span className="font-black text-slate-900 dark:text-cream-50"> <br />구조적 개선이 필요</span>합니다.
                  </p>
                </InfoBox>
                <InfoBox>
                  <h4 className="mb-2 text-base font-black text-flare-600 dark:text-flare-400">② 원거리 광범위 연기 미탐</h4>
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    event 21에서 배경에 존재하는 대형 연기 기둥을 V4가 놓치는 사례가 확인되었습니다.<br />
                    극단적 원거리·저해상도 조건에서의 연기 학습 데이터가 부족했던 것이 원인으로 추정됩니다.<br />
                    <span className="font-black text-slate-900 dark:text-cream-50"> 연기 조기 탐지가 본 시스템의 핵심 목적</span>인 만큼, 이 한계는 V5에서 최우선으로 다룰 과제입니다.
                  </p>
                </InfoBox>
                <MediaBox
                  src="/ai-lab/dev-process/06_distant_smoke_miss.jpg"
                  alt="원거리 광범위 연기 미탐 예시"
                  caption="V4 신규 한계 사례 — 배경의 대형 연기를 놓친 event 21 케이스"
                />
              </div>
            </div>
          </StepSection>

          {/* ── 07. 확장 로드맵 ── */}
          <StepSection
            id="step-07"
            stepNumber="07"
            title="확장 로드맵"
            quote="V4의 한계를 V5의 데이터로 잡는다"
          >
            <div className="space-y-8">
              <div>
                <SubTitle>버전별 개선 타임라인</SubTitle>
                <div className="relative border-l-4 border-flare-500 pl-8">
                  <div className="space-y-4">
                    {[
                      { version: "V1", desc: "베이스라인 구축. 야외 환경 위주 데이터로 도메인 미스매치 발생 (mAP@50:95 0.695)", current: false },
                      { version: "V3", desc: "라벨 정제 + 야간 화재 증강(63×5)으로 회복 (mAP@50 0.952). 데이터 품질 우선 전략 검증", current: false },
                      { version: "V4", desc: "carlight 데이터 +487% 보강, small AP 4.6배 향상 (test_300 mAP@50 0.927). 직접 라벨링이 약점을 잡는다는 원칙 입증", current: true },
                      { version: "V5 (계획)", desc: "한계 극복을 위한 데이터 구성 전략 — 야간 반사광 hard negative · 고해상도 라벨링 · 검은 연기 도메인 다양화", current: false },
                    ].map((item) => (
                      <div key={item.version} className="relative">
                        <div
                          className={`absolute -left-[38px] top-3.5 size-4 rounded-full border-4 border-flare-500 ${item.current ? "bg-flare-500" : "bg-cream-50 dark:bg-slate-800"
                            }`}
                        />
                        <div
                          className={`rounded-lg border-2 p-4 ${item.current
                            ? "border-flare-500 bg-flare-500/10"
                            : "border-warm-200 bg-cream-50 dark:border-slate-700 dark:bg-slate-900"
                            }`}
                        >
                          <div className={`text-base font-black ${item.current ? "text-flare-600 dark:text-flare-400" : "text-slate-900 dark:text-cream-50"}`}>
                            {item.version}
                          </div>
                          <div className="mt-1 text-base font-semibold text-slate-500 dark:text-warm-300">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <SubTitle>V5 데이터 구성 전략 — V4 한계와 1:1 매칭</SubTitle>
                <div className="space-y-4">
                  <InfoBox>
                    <h4 className="mb-2 text-base font-black text-flare-600 dark:text-flare-400">
                      ① 원거리·광역 연기 미탐 잡기 — smoke 도메인 다양화
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "야외 원거리 검은 연기, 광역 확산 연기, 저해상도 입력 케이스 직접 수집",
                        "실제 화재 사고 CCTV 영상에서 원거리 연기 프레임 큐레이션",
                        "V3 야간 화재 증강(63×5)과 같은 방식으로 smoke의 어려운 케이스를 정조준 보강",
                        "연기 조기 탐지가 본 시스템의 핵심 목적인 만큼 최우선 과제",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
                          <span className="text-base font-semibold text-slate-600 dark:text-warm-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </InfoBox>
                  <InfoBox>
                    <h4 className="mb-2 text-base font-black text-flare-600 dark:text-flare-400">
                      ② Underfitting 패턴(imgsz=640 상한) 잡기 — 고해상도 라벨링
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "imgsz=1280으로 학습하려면 라벨 좌표도 1280 기준으로 정밀해야 함",
                        "기존 640 기준 라벨 단순 스케일업으로는 부족 — 작은 객체의 bbox를 다시 정밀화하는 재라벨링 필요",
                        "특히 원거리 화재·연기 초기 발생 케이스의 bbox 정확도 향상에 집중",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
                          <span className="text-base font-semibold text-slate-600 dark:text-warm-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </InfoBox>
                  <InfoBox>
                    <h4 className="mb-2 text-base font-black text-flare-600 dark:text-flare-400">
                      ③ 평가 데이터셋 확장 검토
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "test 셋 확장을 통해 원거리 연기·검은 연기·소형 객체 케이스를 균등 분포로 포함",
                        "평가 단계에서 새로운 약점을 조기 발견하는 체계 마련",
                        "→ 02번 교훈 ③(평가 데이터셋 노가다)의 지속적 실천",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
                          <span className="text-base font-semibold text-slate-600 dark:text-warm-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </InfoBox>
                </div>
              </div>

              <div>
                <SubTitle>carlight 클래스 확장 구상 — 오탐 억제에서 교통 관제로</SubTitle>
                <p className="mb-4 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                  carlight는 V4 보강을 통해 단순 오탐 억제용 네거티브 클래스를 넘어
                  <span className="font-black text-slate-900 dark:text-cream-50"> 풍부한 데이터 자산</span>이 되었습니다.<br />
                  이 자산을 활용해 다음과 같은 기능 확장을 구상 중입니다.
                </p>
                <div className="space-y-2">
                  <FlowBox highlight>오탐 억제 (현재)</FlowBox>
                  <FlowArrow />
                  <FlowBox dashed>차량 밀집도 분석 (V5 데이터셋 구성 단계에서 병행 수집)</FlowBox>
                  <FlowArrow />
                  <FlowBox dashed>정체·혼잡 탐지 (별도 모델 개발 검토)</FlowBox>
                  <FlowArrow />
                  <FlowBox dashed>사고 감지 (장기 목표)</FlowBox>
                </div>
                <div className="mt-5">
                  <InfoBox>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      V5 데이터 구성 단계에서 carlight 데이터를 더 다양한 각도·조도·차량 밀집도 조건으로 확장하면,<br />
                      <span className="font-black text-slate-900 dark:text-cream-50"> 오탐 억제 강화와 교통 관제 기능 확장을 한 번에 준비</span>할 수 있습니다.
                    </p>
                  </InfoBox>
                </div>
              </div>
            </div>
          </StepSection>

          {/* ── 08. 결론 ── */}
          <StepSection
            id="step-08"
            stepNumber="08"
            title="결론 — 오탐을 줄이는 것이 가장 빠른 대응이다"
            quote="오탐 억제 → 경보 신뢰도 회복 → 실제 화재 대응력 향상"
          >
            <div className="space-y-8">
              <p className="text-center text-lg font-semibold leading-8 text-slate-500 dark:text-warm-300">
                이 프로젝트의 핵심은 단순히 높은 mAP 수치를 달성하는 것이 아닙니다.
                <br />
                운영자가 경보를 믿고 즉각 행동할 수 있는{" "}
                <span className="font-black text-slate-900 dark:text-cream-50">신뢰받는 AI 시스템</span>을 만드는 것입니다.
              </p>

              <div className="space-y-2">
                <FlowBox>오탐이 줄어든다</FlowBox>
                <FlowArrow />
                <FlowBox>경보의 신뢰도가 회복된다</FlowBox>
                <FlowArrow />
                <FlowBox highlight>진짜 위급 상황에서 더 빠른 대응이 가능해진다</FlowBox>
              </div>

              <div className="rounded-xl border-4 border-flare-500 p-6 text-center">
                <p className="text-2xl font-black leading-10 text-slate-900 dark:text-cream-50">
                  "오탐을 줄이는 것이, 결국 가장 빠른 대응이다."
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "연기를 놓치지 않는다", body: "화재의 전조증상에 주목, 전역 문맥 파악이 강점인 RT-DETRv2 채택" },
                  { title: "데이터의 양보다 품질", body: "외부 데이터 의존 대신 라벨 정제와 도메인 적합 증강에 집중" },
                  { title: "약점은 직접 라벨링한 데이터로만 잡힌다", body: "V4 carlight +487% 직접 보강으로 test_300 mAP +0.141 달성" },
                  { title: "한계는 정직하게, 다음 단계는 데이터로", body: "V4의 한계를 정직히 드러내고, V5에서 데이터로 잡을 계획 수립" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="overflow-hidden rounded-lg border-2 border-warm-200 bg-cream-50 dark:border-slate-600 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3 border-b-2 border-warm-200 bg-warm-100 px-5 py-3 dark:border-slate-600 dark:bg-slate-700">
                      <span aria-hidden className="h-4 w-1 rounded-full bg-flare-500" />
                      <span className="text-base font-black uppercase text-slate-900 dark:text-cream-50">{item.title}</span>
                    </div>
                    <div className="p-5 text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">{item.body}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border-4 border-flare-500 p-6 text-center">
                <p className="text-2xl font-black leading-10 text-slate-900 dark:text-cream-50">
                  "속도보다 정확도, 정확도보다 신뢰도."
                </p>
                <p className="mt-3 text-base font-semibold text-slate-500 dark:text-warm-300">
                  이것이 변하지 않는 본 시스템의 설계 철학입니다.
                </p>
              </div>
            </div>
          </StepSection>

        </div>
      </div>
    </section>
  );
}