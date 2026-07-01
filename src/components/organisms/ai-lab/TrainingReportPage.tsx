import type { ReactNode } from "react";

// ─── 공통 헬퍼 ─────────────────────────────────────────────────────

function ReportSection({
  sectionNumber,
  title,
  subtitle,
  id,
  children,
}: {
  sectionNumber: string;
  title: string;
  subtitle: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-20 pb-14">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-flare-500 text-base font-black text-cream-50">
          {sectionNumber}
        </span>
        <div>
          <h2 className="text-3xl font-black uppercase text-slate-900 dark:text-cream-50">{title}</h2>
          <p className="mt-2 text-lg font-semibold text-slate-500 dark:text-warm-300">{subtitle}</p>
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

function AbstractBox({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 rounded-lg border-2 border-warm-200 bg-warm-100/50 p-5 dark:border-slate-600 dark:bg-slate-800/50">
      <div className="mb-2 text-sm font-black uppercase tracking-wider text-flare-600 dark:text-flare-400">
        Summary
      </div>
      <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">{children}</p>
    </div>
  );
}

function DataTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: Array<{ cells: string[]; highlight?: boolean }>;
  caption?: string;
}) {
  const cols = headers.length;
  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-lg border-2 border-warm-200 dark:border-slate-600">
        <div
          className="border-b-2 border-warm-200 bg-warm-100 dark:border-slate-600 dark:bg-slate-700"
          style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
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
            style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
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
      {caption && (
        <p className="text-center text-sm font-semibold italic text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      )}
    </div>
  );
}

function ReportImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center overflow-hidden rounded-lg border-2 border-warm-200 bg-white p-3 dark:border-slate-600">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="max-h-[420px] w-full object-contain" />
      </div>
      {caption && (
        <p className="text-center text-sm font-semibold italic text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      )}
    </div>
  );
}

type ModelTone = "danger" | "warn" | "good" | "best";

function CaseShot({
  src,
  alt,
  modelLabel,
  tag,
  tone,
}: {
  src: string;
  alt: string;
  modelLabel: string;
  tag: string;
  tone: ModelTone;
}) {
  const toneClass =
    tone === "best"
      ? "bg-flare-500/15 text-flare-600 dark:text-flare-400 border-flare-500"
      : tone === "good"
        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500"
        : tone === "warn"
          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500"
          : "bg-red-500/15 text-red-500 dark:text-red-400 border-red-500";
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`text-center text-sm font-black uppercase tracking-wide ${tone === "best" ? "text-flare-600 dark:text-flare-400" : "text-slate-700 dark:text-warm-300"
          }`}
      >
        {modelLabel}
      </div>
      <div
        className={`flex aspect-video items-center justify-center overflow-hidden rounded-lg border-2 bg-slate-950 ${tone === "best" ? "border-flare-500" : "border-warm-200 dark:border-slate-600"
          }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="size-full object-contain" />
      </div>
      <span className={`rounded border px-3 py-1.5 text-center text-sm font-bold ${toneClass}`}>{tag}</span>
    </div>
  );
}

function CaseComparison({
  base,
  event,
  shots,
}: {
  base: string;
  event: string;
  shots: Array<{ file: string; modelLabel: string; tag: string; tone: ModelTone }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {shots.map((shot) => (
        <CaseShot
          key={shot.modelLabel}
          src={`${base}/${event}-${shot.file}.jpg`}
          alt={`${event} ${shot.modelLabel}`}
          modelLabel={shot.modelLabel}
          tag={shot.tag}
          tone={shot.tone}
        />
      ))}
    </div>
  );
}

// 페이지 내부 이동용 미니 메뉴
const SECTIONS = [
  { id: "sec-01", num: "01", label: "Abstract" },
  { id: "sec-02", num: "02", label: "채택 근거" },
  { id: "sec-03", num: "03", label: "V4 정량 성능" },
  { id: "sec-04", num: "04", label: "학습 결과" },
  { id: "sec-05", num: "05", label: "V3→V4 비교" },
  { id: "sec-06", num: "06", label: "Threshold Sweep" },
  { id: "sec-07", num: "07", label: "정성 검증" },
  { id: "sec-08", num: "08", label: "Case 2" },
  { id: "sec-09", num: "09", label: "Case 13" },
  { id: "sec-10", num: "10", label: "Case 4" },
  { id: "sec-11", num: "11", label: "Case 6" },
  { id: "sec-12", num: "12", label: "Known Limitations" },
  { id: "sec-13", num: "13", label: "V5 계획" },
  { id: "sec-14", num: "14", label: "결론" },
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

export function TrainingReportPage() {
  const base = "/ai-lab/training-report";

  return (
    <section className="px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-4xl">

        {/* 페이지 헤더 */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-slate-900 dark:text-cream-50 md:text-6xl">
            RT-DETRv2 V4 학습 결과 보고서
          </h1>
          <div className="mt-7 space-y-3 text-xl font-semibold leading-8 text-slate-500 dark:text-warm-300">
            <p>Tunnel CCTV Anomaly Detection — RT-DETRv2 HGNetv2-L V4</p>
            <p>정량 지표, 정성 검증, 그리고 정직한 한계 노출을 포함한 최종 학습 결과 보고서</p>
          </div>
        </div>

        <div className="my-12 h-1 bg-flare-500" />

        <SectionNav />

        <div>

          {/* ── 01. Abstract ── */}
          <ReportSection
            id="sec-01"
            sectionNumber="01"
            title="Abstract"
            subtitle="본 보고서의 핵심 결론 요약"
          >
            <AbstractBox>
              본 시스템은 터널 CCTV 환경에서의 화재·연기 탐지를 목적으로 <strong>RT-DETRv2 HGNetv2-L</strong>을 채택하였다.
              모델 선정의 유일한 기준은 <strong>오탐(false positive) 최소화</strong>와 <strong>화재 전조증상인 연기의 조기 탐지 능력</strong>이며,
              단순 화재 탐지 성능이 목적이라면 YOLO 계열이 더 적합할 수 있음을 명시한다.
              <br />
              <br />
              V4 최종 모델은 독립 테스트셋 <strong>test_300</strong> 기준 <strong>mAP@50 = 0.9267</strong>을 달성하였으며,
              특히 carlight 클래스의 어노테이션을 V3 대비 <strong>+487%</strong> 보강함으로써
              <strong> small 객체 AP를 4.6배 향상</strong>시키고 <strong>background→smoke 오탐률을 0.82 → 0.55로 감소</strong>시켰다.
              <br />
              <br />
              정성 검증 4개 케이스(event 2, 13, 4, 6)에서 V4는 YOLOv8-l, YOLOv11-l 대비 일관되게 우수한 연기 탐지 능력을 보였으며,
              특히 event 6(터널 내부 환경)에서 V4의 fire 미탐이라는 <strong>정직한 한계</strong>도 함께 노출한다.
              이는 데이터셋 특성(실제 CCTV vs AI 생성 이미지)의 영향으로 추정되며, V5 개선 계획의 근거로 활용된다.
            </AbstractBox>
          </ReportSection>

          {/* ── 02. 채택 근거 ── */}
          <ReportSection
            id="sec-02"
            sectionNumber="02"
            title="모델 채택 근거"
            subtitle="RT-DETRv2 선정의 세 가지 정량적 근거"
          >
            <div className="space-y-6">
              <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                본 프로젝트의 채택 기준은 단순 mAP가 아니다. <strong className="text-slate-900 dark:text-cream-50">
                  오탐 억제와 연기 조기 탐지</strong>라는 두 가지 운영 요건에 부합하는 모델을 선택하는 것이 목적이다.
                이 기준에서 RT-DETRv2는 다음 세 가지 근거로 채택되었다.
              </p>

              <div className="space-y-4">
                {[
                  {
                    tag: "근거 ①",
                    title: "전역 문맥 기반 오탐 억제",
                    desc: "Transformer 기반 아키텍처는 국소 특징이 아닌 전역 문맥을 파악한다. 이는 등화류·반사광·화염을 구조적으로 구분하는 데 유리하며, YOLO 계열(앵커 기반 + NMS)에서 빈발하는 오탐을 근본적으로 줄인다.",
                    highlight: false,
                  },
                  {
                    tag: "근거 ②",
                    title: "연기(smoke) 재현율 우위",
                    desc: "화재의 전조증상인 smoke의 미탐(false negative)은 골든타임 상실로 직결된다. RT-DETRv2는 경계가 불분명하고 형태가 변화하는 연기 객체 탐지에서 YOLO 계열 대비 일관되게 높은 재현율을 보였다.",
                    highlight: true,
                  },
                  {
                    tag: "근거 ③",
                    title: "운영 전략을 통한 속도 상쇄",
                    desc: "RT-DETRv2는 YOLO 대비 추론 속도가 다소 느리다. 그러나 5FPS 다운샘플링과 채널 다중화(48FPS ÷ 5FPS = 22채널 동시 커버)로 실서비스 요건을 충족한다.",
                    highlight: false,
                  },
                ].map((item) => (
                  <div
                    key={item.tag}
                    className={`overflow-hidden rounded-lg border-2 ${item.highlight
                        ? "border-flare-500"
                        : "border-warm-200 dark:border-slate-600"
                      }`}
                  >
                    <div
                      className={`flex items-center gap-3 border-b-2 px-5 py-3 ${item.highlight
                          ? "border-flare-500 bg-flare-500/10"
                          : "border-warm-200 bg-warm-100 dark:border-slate-600 dark:bg-slate-700"
                        }`}
                    >
                      <span className={`text-sm font-black ${item.highlight ? "text-flare-600 dark:text-flare-400" : "text-slate-700 dark:text-warm-300"}`}>
                        {item.tag}
                      </span>
                      <span className="text-base font-black text-slate-900 dark:text-cream-50">{item.title}</span>
                    </div>
                    <div className="p-5 text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              <InfoBox>
                <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                  <strong className="text-slate-900 dark:text-cream-50">중요:</strong> 본 시스템의 목적이
                  단순 화재 탐지였다면 YOLO 계열이 속도 측면에서 더 적합했을 것이다.
                  <strong className="text-flare-600 dark:text-flare-400"> 오탐 억제와 연기 특화</strong>라는 요건이 없었다면
                  RT-DETRv2를 채택할 이유가 없었음을 명시한다.
                </p>
              </InfoBox>
            </div>
          </ReportSection>

          {/* ── 03. V4 정량 성능 ── */}
          <ReportSection
            id="sec-03"
            sectionNumber="03"
            title="V4 정량 성능"
            subtitle="test_300 독립 평가 · Class-wise AP · F1 최적 Threshold"
          >
            <AbstractBox>
              V4 최종 모델은 val 1,406장 기준 mAP@50 0.9441을 기록했으며, 독립 test_300에서는 mAP@50 0.9267을 달성했다.
              val과 test 간 편차는 val 셋 확장(133 → 1,406장)에 따른 난이도 증가에 기인하며, test_300 결과가 실서비스에 더 근접한 지표이다.
            </AbstractBox>

            <div className="space-y-8">
              <div>
                <SubTitle>Table 1. V4 클래스별 성능 (test_300 기준)</SubTitle>
                <DataTable
                  headers={["Class", "AP@50", "AP@50:95", "Best F1", "Optimal Threshold"]}
                  rows={[
                    { cells: ["fire", "0.9829", "—", "0.973", "0.713"] },
                    { cells: ["smoke", "0.8931", "—", "0.900", "0.676"], highlight: true },
                    { cells: ["carlight", "0.9041", "—", "0.868", "0.577"] },
                    { cells: ["mAP (all)", "0.9267", "0.6408", "0.912", "0.611"], highlight: true },
                  ]}
                  caption="Table 1. RT-DETRv2 V4 클래스별 성능 지표 (test_300, N=300, class-balanced)"
                />
              </div>

              <div>
                <SubTitle>Table 2. Object Size별 AP</SubTitle>
                <DataTable
                  headers={["Object Size", "AP", "AR"]}
                  rows={[
                    { cells: ["Small", "0.2294", "0.3250"], highlight: true },
                    { cells: ["Medium", "0.5939", "0.7183"] },
                    { cells: ["Large", "0.6811", "0.8159"] },
                  ]}
                  caption="Table 2. 객체 크기별 정밀도. Small 객체 성능은 V3(AP 0.050) 대비 4.6배 향상"
                />
              </div>

              <div>
                <SubTitle>Figure 1. Precision–Recall Curve</SubTitle>
                <ReportImage
                  src={`${base}/v4_pr_curve.png`}
                  alt="V4 Precision-Recall Curve"
                  caption="Figure 1. V4 PR Curve — 세 클래스 모두 상단 우측에 밀착. fire AP 0.983, smoke AP 0.943, carlight AP 0.914"
                />
              </div>

              <div>
                <SubTitle>Figure 2. Confusion Matrix (Normalized)</SubTitle>
                <ReportImage
                  src={`${base}/v4_confusion_matrix.png`}
                  alt="V4 Confusion Matrix"
                  caption="Figure 2. V4 정규화 Confusion Matrix — 클래스 간 오분류 0, background→smoke 오탐 0.82→0.55 감소"
                />
                <InfoBox className="mt-4">
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    <strong className="text-slate-900 dark:text-cream-50">주요 관찰:</strong>
                    fire↔smoke↔carlight 간 오분류가 모두 0이다. 이는 각 클래스의 시각적 특성을 모델이 명확히 구분하고
                    있음을 의미한다. 반면 <strong className="text-flare-600 dark:text-flare-400">background→carlight 오탐(0.34)이 V4에서 신규 발생</strong>했으며,
                    이는 12번 섹션에서 다룬다.
                  </p>
                </InfoBox>
              </div>

              <div>
                <SubTitle>Figure 3. F1–Confidence Curve</SubTitle>
                <ReportImage
                  src={`${base}/v4_f1_curve.png`}
                  alt="V4 F1 Curve"
                  caption="Figure 3. F1–Confidence Curve — 클래스별 실서비스 threshold 근거"
                />
              </div>
            </div>
          </ReportSection>

          {/* ── 04. 학습 결과 ── */}
          <ReportSection
            id="sec-04"
            sectionNumber="04"
            title="학습 결과"
            subtitle="Fine-tuning from V3 · 50 Epochs · Underfitting 관찰"
          >
            <AbstractBox>
              V4는 V3 best.pth에서 Fine-tuning으로 학습되었다. Total Loss는 12.10 → 10.86으로 안정 감소했으나,
              ep12 이후 val mAP는 plateau에 진입하는 <strong>underfitting 패턴</strong>이 관찰되었다.
              이는 imgsz=640 기준의 구조적 상한에 근접했음을 시사하며, V5의 imgsz=1280 재학습 계획의 근거가 된다.
            </AbstractBox>

            <div className="space-y-8">
              <div>
                <SubTitle>Table 3. 학습 설정</SubTitle>
                <DataTable
                  headers={["Parameter", "Value"]}
                  rows={[
                    { cells: ["Model", "RT-DETRv2 HGNetv2-L"] },
                    { cells: ["Initial Weights", "V3 best.pth (Fine-tuning)"] },
                    { cells: ["Epochs", "50"] },
                    { cells: ["Batch Size", "8"] },
                    { cells: ["Image Size", "640×640"] },
                    { cells: ["Optimizer", "AdamW (lr=0.0001)"] },
                    { cells: ["AMP", "False"] },
                    { cells: ["EMA", "True"] },
                    { cells: ["Hardware", "NVIDIA RTX A4000 16GB"] },
                  ]}
                  caption="Table 3. V4 학습 하이퍼파라미터"
                />
              </div>

              <div>
                <SubTitle>Figure 4. Training Curves (results.png)</SubTitle>
                <ReportImage
                  src={`${base}/v4_results.png`}
                  alt="V4 Training Results"
                  caption="Figure 4. V4 학습 곡선 — Loss 안정 감소 (12.10 → 10.86), mAP@50 0.914 → 0.944 수렴 (ep12 이후 plateau)"
                />
              </div>

              <div>
                <SubTitle>Table 4. 에폭별 성능 추이</SubTitle>
                <DataTable
                  headers={["Epoch", "mAP@50", "mAP@50:95", "Train Loss"]}
                  rows={[
                    { cells: ["0", "0.914", "0.597", "12.103"] },
                    { cells: ["5", "0.939", "0.627", "12.307"] },
                    { cells: ["10", "0.942", "0.634", "12.075"] },
                    { cells: ["12", "0.9441", "0.635", "11.992"], highlight: true },
                    { cells: ["20", "0.943", "0.6372", "11.737"], highlight: true },
                    { cells: ["30", "0.943", "0.634", "11.395"] },
                    { cells: ["49", "0.939", "0.632", "10.858"] },
                  ]}
                  caption="Table 4. V4 에폭별 성능 — best mAP@50 (0.9441) @ ep12, best mAP@50:95 (0.6372) @ ep20"
                />
              </div>

              <div>
                <SubTitle>4.1. 학습 단계별 분석</SubTitle>
                <div className="space-y-4">
                  <InfoBox>
                    <p className="mb-1 text-base font-black text-slate-900 dark:text-cream-50">ep 0~12 — 빠른 적응 구간</p>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      Fine-tuning 초기, V3 사전학습 표현이 유지된 상태에서 carlight 신규 데이터 분포에 빠르게 적응하였다.
                      mAP@50 0.914 → 0.944로 상승.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <p className="mb-1 text-base font-black text-slate-900 dark:text-cream-50">ep 12~49 — Plateau 및 Underfitting</p>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      Train Loss는 12.0 → 10.86으로 계속 감소하였으나 val mAP는 상승을 멈추었다.
                      이는 <strong className="text-flare-600 dark:text-flare-400">imgsz=640 기준에서 모델이 학습 가능한 상한에 근접</strong>했음을 의미한다.
                      에폭 추가만으로는 성능 향상이 어려우며, 구조적 개선(고해상도 재학습)이 요구된다.
                    </p>
                  </InfoBox>
                </div>
              </div>
            </div>
          </ReportSection>

          {/* ── 05. V3 → V4 비교 ── */}
          <ReportSection
            id="sec-05"
            sectionNumber="05"
            title="V3 → V4 정량 비교"
            subtitle="test_300 동일 기준 — carlight 보강의 정확한 효과 측정"
          >
            <AbstractBox>
              V3와 V4는 서로 다른 val 셋(133장 vs 1,406장)으로 학습되었기 때문에 val 지표의 직접 비교는 불가능하다.
              두 버전을 공정하게 비교할 수 있는 유일한 기준은 <strong>독립 테스트셋 test_300</strong>이다.
              test_300 결과, carlight AP@50이 <strong>+0.450</strong> 향상되었으며, fire/smoke 성능은 유지되어
              <strong>기존 클래스 성능을 희생하지 않은 개선</strong>임이 확인되었다.
            </AbstractBox>

            <div className="space-y-8">
              <div>
                <SubTitle>Table 5. test_300 동일 기준 V3 vs V4 비교</SubTitle>
                <DataTable
                  headers={["Class", "V3 AP@50", "V4 AP@50", "Δ"]}
                  rows={[
                    { cells: ["fire", "0.9857", "0.9829", "−0.003"] },
                    { cells: ["smoke", "0.9171", "0.8931", "−0.024"] },
                    { cells: ["carlight", "0.4543", "0.9041", "+0.450"], highlight: true },
                    { cells: ["mAP@50", "0.7857", "0.9267", "+0.141"], highlight: true },
                    { cells: ["mAP@50:95", "0.5447", "0.6408", "+0.096"] },
                    { cells: ["AR@100", "0.6929", "0.7761", "+0.083"] },
                  ]}
                  caption="Table 5. test_300 독립 평가 결과. V3 val(133장, carlight 81개)이 carlight 성능을 과대평가했음이 드러남"
                />
              </div>

              <div>
                <SubTitle>5.1. Small Object AP 4.6배 향상</SubTitle>
                <DataTable
                  headers={["Size", "V3 AP", "V4 AP", "×"]}
                  rows={[
                    { cells: ["Small", "0.050", "0.2294", "× 4.6"], highlight: true },
                    { cells: ["Medium", "0.57", "0.5939", "× 1.04"] },
                    { cells: ["Large", "0.73", "0.6811", "× 0.93"] },
                  ]}
                  caption="Table 6. 객체 크기별 AP 변화. carlight 데이터의 소형 bbox 특성이 small 객체 전반의 탐지력 향상에 기여"
                />
                <InfoBox className="mt-4">
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    <strong className="text-slate-900 dark:text-cream-50">해석:</strong>
                    carlight 클래스만 보강했음에도 소형 객체 AP 전반이 4.6배 향상되었다. 이는
                    <strong className="text-flare-600 dark:text-flare-400"> 클래스 간 데이터 균형이 모델의 표현 능력 전체에 영향을 미친다</strong>는
                    가설을 정량적으로 뒷받침한다.
                  </p>
                </InfoBox>
              </div>

              <div>
                <SubTitle>5.2. Background 오탐률 변화</SubTitle>
                <DataTable
                  headers={["Background →", "V3", "V4", "Δ"]}
                  rows={[
                    { cells: ["smoke", "0.82", "0.55", "−0.27"], highlight: true },
                    { cells: ["carlight", "—", "0.34", "신규"] },
                    { cells: ["fire", "0.13", "0.11", "−0.02"] },
                  ]}
                  caption="Table 7. Background 오탐률 변화. smoke 오탐 감소는 성과이나, carlight 신규 오탐은 V5 개선 대상"
                />
              </div>
            </div>
          </ReportSection>

          {/* ── 06. Threshold Sweep ── */}
          <ReportSection
            id="sec-06"
            sectionNumber="06"
            title="Threshold Sweep"
            subtitle="실서비스 임계값 근거 — 클래스별 최적 threshold 산출"
          >
            <AbstractBox>
              실서비스 배포를 위해 test_300 기준 Precision–Recall Threshold Sweep을 수행하였다.
              fire는 threshold 0.70까지 Recall 0.991을 유지하여 미탐 최소화가 가능하며,
              smoke는 0.60~0.70 구간에서 P/R 균형점을 형성한다. carlight는 0.80 이상에서 Recall이 급감하여 0.50~0.60이 실용 구간이다.
            </AbstractBox>

            <div className="space-y-8">
              <div>
                <SubTitle>Table 8. Threshold Sweep 결과</SubTitle>
                <DataTable
                  headers={["Threshold", "fire P/R", "smoke P/R", "carlight P/R"]}
                  rows={[
                    { cells: ["0.30", "0.881 / 0.991", "0.717 / 0.936", "0.674 / 0.971"] },
                    { cells: ["0.50", "0.929 / 0.991", "0.803 / 0.882", "0.791 / 0.929"], highlight: true },
                    { cells: ["0.60", "0.946 / 0.991", "0.852 / 0.847", "0.865 / 0.871"], highlight: true },
                    { cells: ["0.70", "0.946 / 0.991", "0.901 / 0.808", "0.936 / 0.731"], highlight: true },
                    { cells: ["0.80", "0.962 / 0.962", "0.921 / 0.690", "0.930 / 0.255"] },
                    { cells: ["0.90", "0.988 / 0.752", "0.929 / 0.256", "1.000 / 0.005"] },
                  ]}
                  caption="Table 8. 클래스별 Precision/Recall Threshold Sweep (test_300)"
                />
              </div>

              <div>
                <SubTitle>Table 9. 클래스별 권장 Threshold</SubTitle>
                <DataTable
                  headers={["Class", "권장 Threshold", "근거"]}
                  rows={[
                    { cells: ["fire", "0.60~0.70", "Recall 0.991 완전 유지 구간"] },
                    { cells: ["smoke", "0.60~0.70", "P/R 균형 최적 구간 (조기 경보 중시)"] },
                    { cells: ["carlight", "0.50~0.60", "0.80 이상 Recall 급감 방지"] },
                  ]}
                  caption="Table 9. 실서비스 권장 threshold. VLM 게이트 로직의 근거가 되는 수치"
                />
              </div>

              <InfoBox>
                <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                  <strong className="text-slate-900 dark:text-cream-50">운영 함의:</strong>
                  fire의 threshold 0.70까지 Recall 0.991 유지 특성은 안전 시스템에 이상적이다.
                  threshold를 높여 오탐을 줄여도 미탐이 발생하지 않는다는 것은,
                  <strong className="text-flare-600 dark:text-flare-400"> 화재 알림의 신뢰도와 완전성을 동시에 확보</strong>할 수 있음을 의미한다.
                </p>
              </InfoBox>
            </div>
          </ReportSection>

          {/* ── 07. 정성 검증 요약 ── */}
          <ReportSection
            id="sec-07"
            sectionNumber="07"
            title="정성 검증 개요"
            subtitle="4 Cases × 4 Models — 정량 지표를 넘어선 실증 분석"
          >
            <AbstractBox>
              정량 mAP만으로 판단할 수 없는 실제 CCTV 환경 대응력을 검증하기 위해, 4개의 대표 케이스에 대해
              YOLOv8-l, YOLOv11-l, RT-DETRv2 V3, RT-DETRv2 V4의 네 모델을 <strong>동일 입력</strong>으로 추론하여 비교하였다.
              케이스 선정은 <strong>다양한 도메인 조건(주간/야간, 야외/터널, 근거리/원거리)</strong>을 커버하도록 큐레이션되었다.
            </AbstractBox>

            <div className="space-y-6">
              <div>
                <SubTitle>Table 10. 정성 검증 케이스 개요</SubTitle>
                <DataTable
                  headers={["Case", "위치", "환경", "입증 대상"]}
                  rows={[
                    { cells: ["event 2", "호남지선 서대전휴게소", "주간 야외 (진압 후)", "흐릿한 흰 연기 탐지"] },
                    { cells: ["event 13", "서해안선 고잔1교", "주간 야외 (원거리)", "광역 검은 연기 공간 정확도"] },
                    { cells: ["event 4", "경부선 금강1교", "야간 야외 (강발광)", "V3→V4 개선 실증"] },
                    { cells: ["event 6", "경부선 경부동탄터널", "주간 터널 (타깃 도메인)", "터널 환경 + V4 한계 노출"], highlight: true },
                  ]}
                  caption="Table 10. 4 케이스는 순차적으로 난이도가 증가하며, event 6은 프로젝트의 최종 타깃 환경"
                />
              </div>

              <p className="text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                각 케이스의 상세 분석은 08~11번 섹션에서 다룬다. 모든 케이스에서 모델 표시 순서는
                <strong className="text-slate-700 dark:text-warm-200"> YOLOv8-l → YOLOv11-l → RT-DETRv2 V3 → RT-DETRv2 V4</strong>로 통일하였다.
              </p>
            </div>
          </ReportSection>

          {/* ── 08. Case 2 ── */}
          <ReportSection
            id="sec-08"
            sectionNumber="08"
            title="Case 2 — 호남지선 주간 야외 차량 화재"
            subtitle="흐릿한 흰 연기 탐지 — 연기 특화의 기본 강점"
          >
            <AbstractBox>
              화재 진압 이후의 흐릿한 흰 연기를 탐지하는 케이스이다. YOLO 계열은 <strong>양 모델 모두 smoke를 완전히 미탐</strong>했으며,
              RT-DETRv2 계열은 두 버전 모두 smoke를 정확히 탐지하였다. 특히 V4는 소방차와 주변 정상 차량을 carlight로 분리 인식하여
              <strong>오탐 억제와 정탐을 동시에 달성</strong>하였다.
            </AbstractBox>

            <div className="space-y-6">
              <div>
                <SubTitle>8.1. 상황 개요</SubTitle>
                <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                  호남고속도로 지선에서 발생한 화물차 화재의 진압 완료 시점 CCTV 프레임이다.
                  화염은 진압되어 사라졌으나 <strong className="text-slate-900 dark:text-cream-50">저농도 흰 연기</strong>가 남아있으며,
                  주변에는 소방차 2대와 정상 주행 차량 다수가 존재한다.
                  이 조건은 조기 탐지가 아닌 <strong className="text-flare-600 dark:text-flare-400">사후 확인 단계에서의 연기 판별 능력</strong>을 검증한다.
                </p>
              </div>

              <div>
                <SubTitle>8.2. Figure 5. 4모델 추론 비교</SubTitle>
                <CaseComparison
                  base={base}
                  event="event2"
                  shots={[
                    { file: "yolov8", modelLabel: "YOLOv8-l", tag: "smoke 미탐 ✗", tone: "danger" },
                    { file: "yolov11", modelLabel: "YOLOv11-l", tag: "smoke 미탐 ✗", tone: "danger" },
                    { file: "rtdetr-v3", modelLabel: "RT-DETRv2 V3", tag: "smoke 탐지 ✓", tone: "good" },
                    { file: "rtdetr-v4", modelLabel: "RT-DETRv2 V4", tag: "smoke + carlight ×5 ✅", tone: "best" },
                  ]}
                />
                <p className="mt-4 text-center text-sm font-semibold italic text-slate-500 dark:text-slate-400">
                  Figure 5. Case 2 4모델 추론 결과 비교
                </p>
              </div>

              <div>
                <SubTitle>8.3. 관찰 및 해석</SubTitle>
                <div className="space-y-3">
                  <InfoBox>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      <strong className="text-red-500">YOLO 계열의 완전 미탐:</strong>
                      YOLOv8-l, YOLOv11-l 모두 흐릿한 흰 연기를 완전히 놓쳤다. 이는 앵커 기반 지역 특징 탐지 방식이
                      경계가 불분명하고 배경 대비가 약한 객체에 취약함을 실증한다.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      <strong className="text-flare-600 dark:text-flare-400">RT-DETRv2 V4의 이중 성과:</strong>
                      smoke를 정확히 탐지함과 동시에 소방차 2대와 주변 정상 차량들을 carlight로 분리 인식하였다.
                      이는 <strong className="text-slate-900 dark:text-cream-50">화재 관련 객체(smoke)와 비화재 객체(carlight)를 명확히 구분</strong>하는
                      V4의 오탐 억제 능력을 보여준다.
                    </p>
                  </InfoBox>
                </div>
              </div>
            </div>
          </ReportSection>

          {/* ── 09. Case 13 ── */}
          <ReportSection
            id="sec-09"
            sectionNumber="09"
            title="Case 13 — 서해안선 원거리 폐기물 공장 화재"
            subtitle="광역 확산 검은 연기 — 전역 문맥 파악의 우위 실증"
          >
            <AbstractBox>
              고속도로 옆 폐기물 공장에서 발생한 대형 화재의 원거리 CCTV 프레임이다. 화염은 CCTV 시야 밖(공장 내부)에 있으며,
              <strong> 광역으로 확산된 검은 연기 기둥만이 탐지 대상</strong>이다. YOLOv11-l은 미탐, YOLOv8-l은 부분 탐지(bbox 부정확)했으나,
              RT-DETRv2 계열은 두 버전 모두 <strong>연기 전체 범위를 정확히 포착</strong>했으며 V4는 신뢰도 0.91로 최고 수준을 기록했다.
            </AbstractBox>

            <div className="space-y-6">
              <div>
                <SubTitle>9.1. 상황 개요</SubTitle>
                <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                  서해안고속도로 고잔1교 인근 폐기물 공장 화재이다. 화염은 공장 건물 내부에서 발생하여 CCTV에 직접 노출되지 않으며,
                  대형 검은 연기 기둥만이 하늘을 뒤덮고 있다. 이 케이스는 본 시스템의 핵심 목적인
                  <strong className="text-flare-600 dark:text-flare-400"> "화염 없이 연기만으로 재난을 조기 감지"</strong>하는 능력을 직접 검증한다.
                </p>
              </div>

              <div>
                <SubTitle>9.2. Figure 6. 4모델 추론 비교</SubTitle>
                <CaseComparison
                  base={base}
                  event="event13"
                  shots={[
                    { file: "yolov8", modelLabel: "YOLOv8-l", tag: "smoke 부분탐지 ⚠", tone: "warn" },
                    { file: "yolov11", modelLabel: "YOLOv11-l", tag: "smoke 미탐 ✗", tone: "danger" },
                    { file: "rtdetr-v3", modelLabel: "RT-DETRv2 V3", tag: "smoke 전체 포착 ✓", tone: "good" },
                    { file: "rtdetr-v4", modelLabel: "RT-DETRv2 V4", tag: "smoke 0.91 최고 신뢰도 ✅", tone: "best" },
                  ]}
                />
                <p className="mt-4 text-center text-sm font-semibold italic text-slate-500 dark:text-slate-400">
                  Figure 6. Case 13 4모델 추론 결과 비교
                </p>
              </div>

              <div>
                <SubTitle>9.3. 관찰 및 해석</SubTitle>
                <div className="space-y-3">
                  <InfoBox>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      <strong className="text-amber-600 dark:text-amber-400">YOLOv8-l의 부분 탐지:</strong>
                      연기를 탐지하기는 했으나 bbox가 연기 기둥의 일부만 포함하였다. 이는 국소 특징 탐지 방식이
                      광역 확산 객체의 전체 공간 범위를 파악하지 못함을 보여준다.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      <strong className="text-flare-600 dark:text-flare-400">RT-DETRv2 V4의 공간 정확도:</strong>
                      Transformer의 self-attention 메커니즘이 연기의 전체 공간 분포를 하나의 객체로 인식하였다.
                      신뢰도 0.91은 <strong className="text-slate-900 dark:text-cream-50">threshold 0.70 즉시 알림 조건</strong>을 여유롭게 충족하며,
                      확정 알림으로 즉각 발동될 수 있음을 의미한다.
                    </p>
                  </InfoBox>
                </div>
              </div>
            </div>
          </ReportSection>

          {/* ── 10. Case 4 ── */}
          <ReportSection
            id="sec-10"
            sectionNumber="10"
            title="Case 4 — 경부선 야간 타이어 공장 대형 화재"
            subtitle="V3 → V4 개선 효과의 정성적 실증"
          >
            <AbstractBox>
              야간 강발광 조건의 대형 화재 케이스이다. 이 케이스의 결정적 의의는 <strong>V3가 smoke를 미탐하던 조건에서 V4가 smoke 0.6으로 탐지에 성공</strong>했다는 점이다.
              이는 carlight 데이터 보강이 다른 클래스의 탐지 능력까지 향상시킨다는 5.1절 정량 관찰(small AP 4.6배)의 정성적 실증이다.
            </AbstractBox>

            <div className="space-y-6">
              <div>
                <SubTitle>10.1. 상황 개요</SubTitle>
                <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                  경부고속도로 금강1교 인근 타이어 공장에서 발생한 야간 대형 화재이다.
                  <strong className="text-slate-900 dark:text-cream-50"> 강한 화염 발광</strong>과 <strong className="text-slate-900 dark:text-cream-50">야간 조명 조건</strong>이 결합된 최악의 시각적 노이즈 환경이며,
                  좌측 하단에는 정상 주행 차량의 등화류가 존재한다.
                  이 케이스는 <strong className="text-flare-600 dark:text-flare-400">강발광 조건에서의 fire/smoke 분리 탐지 능력</strong>과
                  <strong className="text-flare-600 dark:text-flare-400"> 등화류-화염 혼동 억제</strong>를 동시에 검증한다.
                </p>
              </div>

              <div>
                <SubTitle>10.2. Figure 7. 4모델 추론 비교</SubTitle>
                <CaseComparison
                  base={base}
                  event="event4"
                  shots={[
                    { file: "yolov8", modelLabel: "YOLOv8-l", tag: "smoke 0.4대 ⚠", tone: "warn" },
                    { file: "yolov11", modelLabel: "YOLOv11-l", tag: "smoke 0.4대 ⚠", tone: "warn" },
                    { file: "rtdetr-v3", modelLabel: "RT-DETRv2 V3", tag: "smoke 미탐 ✗", tone: "danger" },
                    { file: "rtdetr-v4", modelLabel: "RT-DETRv2 V4", tag: "smoke 0.6 + fire 0.28 ✅", tone: "best" },
                  ]}
                />
                <p className="mt-4 text-center text-sm font-semibold italic text-slate-500 dark:text-slate-400">
                  Figure 7. Case 4 4모델 추론 결과 비교
                </p>
              </div>

              <div>
                <SubTitle>10.3. 핵심 관찰 — V3 → V4 개선 효과</SubTitle>
                <div className="space-y-3">
                  <InfoBox>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      <strong className="text-red-500">V3의 미탐:</strong>
                      RT-DETRv2 V3는 이 야간 강발광 조건에서 smoke를 완전히 미탐하였다. 이는 V3의 학습 데이터가 이러한 극단 조건을
                      충분히 커버하지 못했음을 시사한다.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      <strong className="text-flare-600 dark:text-flare-400">V4의 개선:</strong>
                      동일 입력에서 V4는 smoke 0.6으로 탐지에 성공하였다. carlight 데이터 보강만 이루어진 V4가 smoke 탐지 능력까지 개선한 것은,
                      <strong className="text-slate-900 dark:text-cream-50"> 클래스 간 데이터 균형이 표현 학습 전반에 미치는 영향</strong>을 실증한다.
                      이는 5.1절 Table 6의 small AP 4.6배 향상 관찰과 정합한다.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      <strong className="text-slate-900 dark:text-cream-50">fire 신뢰도 0.28에 대한 정직한 노출:</strong>
                      V4의 fire 탐지 신뢰도는 0.28로 실서비스 threshold(0.60~0.70) 아래에 위치한다.
                      그러나 <strong className="text-flare-600 dark:text-flare-400">본 시스템은 smoke를 화재 전조로 우선시</strong>하며,
                      smoke 0.6이 threshold 0.60~0.70의 하한을 충족하므로 알림 발생 조건은 만족된다.
                      fire와 smoke의 동시 탐지 자체는 카메라의 상황 인식이 정확히 이루어졌음을 의미한다.
                    </p>
                  </InfoBox>
                </div>
              </div>
            </div>
          </ReportSection>

          {/* ── 11. Case 6 ── */}
          <ReportSection
            id="sec-11"
            sectionNumber="11"
            title="Case 6 — 경부동탄터널 내 SUV 화재"
            subtitle="본 프로젝트 타깃 도메인 + V4의 정직한 한계 노출"
          >
            <AbstractBox>
              본 시스템의 <strong>최종 타깃 도메인인 터널 내부 환경</strong>에서 발생한 SUV 화재 케이스이다.
              YOLO 계열은 두 모델 모두 smoke를 미탐했으며, V3는 fire·smoke·carlight 3클래스를 모두 완벽히 구분 탐지하였다.
              <strong>그러나 V4는 smoke·carlight 탐지에는 성공했으나 fire를 미탐</strong>하였다. 이 관찰은 정직하게 노출되며,
              원인 분석과 V5 개선 방향으로 연결된다.
            </AbstractBox>

            <div className="space-y-6">
              <div>
                <SubTitle>11.1. 상황 개요</SubTitle>
                <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                  경부고속도로 경부동탄터널 내부에서 발생한 SUV 차량 화재이다.
                  화염은 명확히 노출되어 있으며, 검은 연기가 상승 확산 중이다.
                  뒤쪽에는 다수의 정상 주행 차량이 존재한다. 이 케이스는 프로젝트의 최종 운영 환경인
                  <strong className="text-flare-600 dark:text-flare-400"> 터널 내부 CCTV 조건에서의 종합 탐지 능력</strong>을 검증한다.
                </p>
              </div>

              <div>
                <SubTitle>11.2. Figure 8. 4모델 추론 비교</SubTitle>
                <CaseComparison
                  base={base}
                  event="event6"
                  shots={[
                    { file: "yolov8", modelLabel: "YOLOv8-l", tag: "smoke 미탐 ✗", tone: "danger" },
                    { file: "yolov11", modelLabel: "YOLOv11-l", tag: "smoke 미탐 ✗", tone: "danger" },
                    { file: "rtdetr-v3", modelLabel: "RT-DETRv2 V3", tag: "fire+smoke+carlight 완벽 ✅", tone: "best" },
                    { file: "rtdetr-v4", modelLabel: "RT-DETRv2 V4", tag: "smoke+carlight, fire 미탐 ⚠", tone: "warn" },
                  ]}
                />
                <p className="mt-4 text-center text-sm font-semibold italic text-slate-500 dark:text-slate-400">
                  Figure 8. Case 6 4모델 추론 결과 비교 — V3가 4모델 중 유일하게 3클래스 완전 탐지 달성
                </p>
              </div>

              <div>
                <SubTitle>11.3. 정직한 한계 노출 — V4의 fire 미탐</SubTitle>
                <div className="space-y-3">
                  <InfoBox>
                    <p className="mb-2 text-base font-black text-slate-900 dark:text-cream-50">관찰</p>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      Case 6에서 V4는 smoke와 carlight를 정확히 탐지했으나 명확히 노출된 fire를 미탐하였다.
                      동일 조건에서 V3는 3클래스를 모두 탐지했다.
                      <strong className="text-flare-600 dark:text-flare-400"> 이는 V4가 모든 케이스에서 V3보다 우수하다는 명제가 성립하지 않음</strong>을 의미한다.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <p className="mb-2 text-base font-black text-slate-900 dark:text-cream-50">원인 분석 (Hypothesis)</p>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      V4는 실제 CCTV 촬영 이미지를 중심으로 학습되었다. 반면 이 test 이미지는
                      <strong className="text-slate-900 dark:text-cream-50"> AI 생성 이미지(synthetic)</strong>로 판단되며,
                      실제 CCTV의 화염 시각적 특성(노이즈, 압축 아티팩트, 특유의 색온도)과 편차가 있을 가능성이 있다.
                      V3는 상대적으로 다양한 소스의 학습 데이터를 포함하여 이 편차에 더 관용적일 수 있다.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <p className="mb-2 text-base font-black text-slate-900 dark:text-cream-50">시스템 안전성 관점의 해석</p>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      fire를 미탐했음에도 <strong className="text-slate-900 dark:text-cream-50">smoke가 정확히 탐지되었다는 점</strong>은 중요하다.
                      본 시스템의 파이프라인은 smoke만으로도 알림을 발생시키며, VLM 재검증 단계에서 화재 상황임이 확정된다.
                      즉 이 케이스에서도 <strong className="text-flare-600 dark:text-flare-400">화재 알림은 정상적으로 발동</strong>된다.
                      단일 클래스 미탐이 시스템 실패로 이어지지 않도록 <strong className="text-slate-900 dark:text-cream-50">다층 방어</strong>가 설계되어 있다.
                    </p>
                  </InfoBox>
                  <InfoBox>
                    <p className="mb-2 text-base font-black text-slate-900 dark:text-cream-50">V5 개선 방향</p>
                    <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      이 관찰은 V5 학습 데이터 구성에 <strong className="text-slate-900 dark:text-cream-50">AI 생성 이미지와 실제 CCTV 이미지의 혼합 검토</strong>가
                      필요함을 시사한다. 이는 13번 섹션 V5 계획에서 구체화된다.
                    </p>
                  </InfoBox>
                </div>
              </div>
            </div>
          </ReportSection>

          {/* ── 12. Known Limitations ── */}
          <ReportSection
            id="sec-12"
            sectionNumber="12"
            title="Known Limitations"
            subtitle="V4에서 확인된 세 가지 한계 — 정직한 노출"
          >
            <AbstractBox>
              V4 모델의 알려진 한계 세 가지를 명시한다. 이들은 은폐 대상이 아니라 V5 개선의 정확한 출발점이다.
              한계를 정직하게 노출하는 것이 시스템 신뢰도의 근간임을 강조한다.
            </AbstractBox>

            <div className="space-y-6">
              <div>
                <SubTitle>Limitation 1. Underfitting Pattern (imgsz=640 상한)</SubTitle>
                <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-5 dark:border-slate-600 dark:bg-slate-900">
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    <strong className="text-slate-900 dark:text-cream-50">관찰:</strong> ep12 이후 train loss는 계속 감소(12.0 → 10.86)하나 val mAP는 plateau.
                    <br />
                    <strong className="text-slate-900 dark:text-cream-50">원인:</strong> imgsz=640 기준 모델이 학습 가능한 표현 상한에 근접.
                    <br />
                    <strong className="text-slate-900 dark:text-cream-50">영향:</strong> 원본 1920×1080 CCTV의 소형/원거리 객체 정보 손실.
                    <br />
                    <strong className="text-flare-600 dark:text-flare-400">V5 대응:</strong> imgsz=1280 재학습 + AMP=True.
                  </p>
                </div>
              </div>

              <div>
                <SubTitle>Limitation 2. Background → carlight 신규 오탐 (0.34)</SubTitle>
                <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-5 dark:border-slate-600 dark:bg-slate-900">
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    <strong className="text-slate-900 dark:text-cream-50">관찰:</strong> V3에는 없던 항목. background를 carlight로 오탐하는 비율 0.34.
                    <br />
                    <strong className="text-slate-900 dark:text-cream-50">원인:</strong> carlight val 데이터가 81 → 624개로 확장되며 다양한 배경 조건에서의 오탐이 드러남.
                    <br />
                    <strong className="text-slate-900 dark:text-cream-50">특이 사례:</strong> event 3에서 <strong>소방차 경광등이 carlight로 오탐</strong>됨(신뢰도 0.75, 0.81).
                    기술적으로는 등화류가 맞으나 운영자 관점에서 혼선 야기 가능.
                    <br />
                    <strong className="text-slate-900 dark:text-cream-50">단기 관리:</strong> carlight threshold 0.60 이상으로 설정.
                    <br />
                    <strong className="text-flare-600 dark:text-flare-400">V5 대응:</strong> 야간 반사광 hard negative sampling.
                  </p>
                </div>
                <ReportImage
                  src={`${base}/event3-rtdetr-v4-firetruck-fp.jpg`}
                  alt="소방차 경광등 carlight 오탐 사례"
                  caption="Figure 9. Limitation 2 실사례 — 소방차 경광등이 carlight로 오탐된 event 3"
                />
              </div>

              <div>
                <SubTitle>Limitation 3. 원거리 광범위 연기 미탐</SubTitle>
                <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-5 dark:border-slate-600 dark:bg-slate-900">
                  <p className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                    <strong className="text-slate-900 dark:text-cream-50">관찰:</strong> event 21에서 배경에 존재하는 대형 연기 기둥을 V4가 미탐.
                    <br />
                    <strong className="text-slate-900 dark:text-cream-50">원인:</strong> 극단적 원거리·저해상도 연기 도메인의 학습 데이터 부족.
                    <br />
                    <strong className="text-flare-600 dark:text-flare-400">V5 대응:</strong> 검은 연기·광역 확산·저해상도 케이스 도메인 다양화 보강.
                  </p>
                </div>
                <ReportImage
                  src={`${base}/event21-rtdetr-v4-distant-smoke-miss.jpg`}
                  alt="원거리 연기 미탐 사례"
                  caption="Figure 10. Limitation 3 실사례 — 원거리 대형 연기 기둥 미탐 (event 21)"
                />
              </div>
            </div>
          </ReportSection>

          {/* ── 13. V5 계획 ── */}
          <ReportSection
            id="sec-13"
            sectionNumber="13"
            title="V5 개선 계획"
            subtitle="V4 한계와 1:1 매칭된 데이터 구성 전략"
          >
            <AbstractBox>
              V5의 개선 방향은 V4에서 확인된 세 가지 한계를 <strong>학습 데이터 구성 전략</strong>으로 해결하는 것이다.
              모델 구조를 바꾸기 전에 데이터로 잡을 수 있는 부분을 먼저 처리한다는 원칙에 따른다.
            </AbstractBox>

            <div className="space-y-6">
              <div>
                <SubTitle>Table 11. V5 데이터 구성 전략</SubTitle>
                <DataTable
                  headers={["대응 한계", "V5 전략", "라벨링 방식"]}
                  rows={[
                    { cells: ["Underfitting (imgsz 640)", "imgsz=1280 재학습, AMP=True", "고해상도 bbox 재라벨링"] },
                    { cells: ["Background→carlight 0.34", "야간 반사광 Hard Negative 수집", "V4 FP 프레임을 배경 라벨로 추가"] },
                    { cells: ["원거리 광역 연기 미탐", "검은 연기·저해상도 도메인 다양화", "야외 저해상도 case 직접 수집"] },
                    { cells: ["Case 6 fire 미탐 (synthetic 편차)", "AI 생성 + 실 CCTV 이미지 혼합 학습 검토", "혼합 데이터 라벨링"], highlight: true },
                    { cells: ["평가 신뢰도 강화", "test 셋 확장 검토", "다양한 조건 균등 분포로 큐레이션"] },
                  ]}
                  caption="Table 11. V5 개선 전략 — 각 한계에 대응하는 정밀 타겟팅"
                />
              </div>

              <div>
                <SubTitle>13.1. carlight 클래스 활용 확장 구상</SubTitle>
                <p className="mb-4 text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                  V4의 carlight 어노테이션 자산(6,210개)은 오탐 억제 목적을 넘어 교통 관제 기능 확장의 기반이 될 수 있다.
                  V5 데이터 구성 단계에서 차량 밀집도·주행 패턴 조건을 함께 수집하면 다음 확장이 가능하다.
                </p>
                <DataTable
                  headers={["단계", "기능", "상태"]}
                  rows={[
                    { cells: ["현재", "오탐 억제 (네거티브 클래스)", "V4 완료"] },
                    { cells: ["V5", "차량 밀집도 분석", "데이터 병행 수집 계획"] },
                    { cells: ["V5+", "정체·혼잡 탐지", "별도 모델 개발 검토"] },
                    { cells: ["장기", "사고 감지", "장기 목표"] },
                  ]}
                  caption="Table 12. carlight 자산의 단계적 확장 로드맵"
                />
              </div>
            </div>
          </ReportSection>

          {/* ── 14. 결론 ── */}
          <ReportSection
            id="sec-14"
            sectionNumber="14"
            title="결론"
            subtitle="오탐 억제와 연기 특화 — 프로젝트 목적의 정합적 달성"
          >
            <div className="space-y-8">
              <AbstractBox>
                본 보고서는 RT-DETRv2 V4의 학습 결과를 정량·정성 양면에서 종합하였다.
                모델 채택의 유일한 기준은 <strong>오탐 최소화</strong>와 <strong>연기 조기 탐지</strong>였으며,
                이는 test_300 정량 지표와 4개 케이스 정성 검증에서 일관되게 실증되었다.
                한계는 은폐하지 않고 정직하게 노출하였으며, V5 개선 계획으로 연결된다.
              </AbstractBox>

              <div>
                <SubTitle>14.1. 핵심 성과 요약</SubTitle>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { value: "0.9267", label: "test_300 mAP@50", sub: "V3 대비 +0.141" },
                    { value: "+487%", label: "carlight 어노테이션", sub: "직접 라벨링 보강" },
                    { value: "× 4.6", label: "small object AP", sub: "0.050 → 0.2294" },
                    { value: "−0.27", label: "background→smoke", sub: "오탐률 0.82 → 0.55" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900"
                    >
                      <div className="text-3xl font-black text-flare-600 dark:text-flare-400">{stat.value}</div>
                      <div className="mt-1 text-sm font-black text-slate-900 dark:text-cream-50">{stat.label}</div>
                      <div className="text-sm font-semibold text-slate-500 dark:text-warm-300">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SubTitle>14.2. 프로젝트 목적과의 정합성</SubTitle>
                <div className="space-y-3">
                  {[
                    {
                      title: "오탐 최소화",
                      body: "carlight 클래스의 정밀 학습으로 등화류-화염 혼동을 구조적으로 억제. background→smoke 오탐 0.82 → 0.55 감소.",
                    },
                    {
                      title: "연기 조기 탐지",
                      body: "전역 문맥 파악 아키텍처로 광역 확산 연기의 공간 정확도 확보. Case 2·13에서 YOLO 계열 대비 결정적 우위 실증.",
                    },
                    {
                      title: "타깃 도메인 대응",
                      body: "터널 내부 환경(Case 6)에서 smoke/carlight 정확 탐지. fire 미탐은 학습 데이터 특성으로 원인 파악, V5에서 해결 예정.",
                    },
                    {
                      title: "정직한 한계 노출",
                      body: "3가지 Known Limitation을 명시하고 V5 대응 계획을 데이터 구성 전략으로 구체화. 은폐가 아닌 개선의 출발점.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="overflow-hidden rounded-lg border-2 border-warm-200 bg-cream-50 dark:border-slate-600 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3 border-b-2 border-warm-200 bg-warm-100 px-5 py-3 dark:border-slate-600 dark:bg-slate-700">
                        <span aria-hidden className="h-4 w-1 rounded-full bg-flare-500" />
                        <span className="text-base font-black uppercase text-slate-900 dark:text-cream-50">{item.title}</span>
                      </div>
                      <div className="p-5 text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">{item.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border-4 border-flare-500 p-6 text-center">
                <p className="text-2xl font-black leading-10 text-slate-900 dark:text-cream-50">
                  "단순 화재 탐지가 목적이었다면 우리는 RT-DETR을 택하지 않았다."
                </p>
                <p className="mt-3 text-base font-semibold text-slate-500 dark:text-warm-300">
                  오탐 억제와 연기 특화라는 요건 위에서, V4는 그 방향의 정합적 결과이다.
                </p>
              </div>
            </div>
          </ReportSection>

        </div>
      </div>
    </section>
  );
}