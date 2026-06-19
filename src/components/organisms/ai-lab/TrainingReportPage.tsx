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
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-20 pb-14">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-flare-500 text-sm font-black text-cream-50">
          {sectionNumber}
        </span>
        <div>
          <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-cream-50">{title}</h2>
          <p className="mt-2 text-base font-semibold text-slate-500 dark:text-warm-300">{subtitle}</p>
        </div>
      </div>
      {children}
      <div className="mt-14 h-px bg-warm-200 dark:bg-slate-700" />
    </div>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-3 text-lg font-black text-slate-900 dark:text-cream-50">
      <span aria-hidden className="h-5 w-1 rounded-full bg-flare-500" />
      {children}
    </h3>
  );
}

function InfoBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-l-4 border-flare-500 bg-cream-50 p-5 dark:bg-slate-900 ${className ?? ""}`}>
      {children}
    </div>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<{ cells: string[]; highlight?: boolean }>;
}) {
  const cols = headers.length;
  return (
    <div className="overflow-hidden rounded-lg border-2 border-warm-200 dark:border-slate-600">
      <div
        className="border-b-2 border-warm-200 bg-warm-100 dark:border-slate-600 dark:bg-slate-700"
        style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >
        {headers.map((h) => (
          <div
            key={h}
            className="border-r-2 border-warm-200 px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-700 last:border-r-0 dark:border-slate-600 dark:text-warm-300"
          >
            {h}
          </div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`border-t-2 border-warm-200 dark:border-slate-600 ${
            row.highlight ? "bg-flare-500/10" : "bg-cream-50 dark:bg-slate-900"
          }`}
          style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
        >
          {row.cells.map((cell, j) => (
            <div
              key={j}
              className={`border-r-2 border-warm-200 px-4 py-3 text-sm last:border-r-0 dark:border-slate-600 ${
                j === 0
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

function ReportImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center overflow-hidden rounded-lg border-2 border-warm-200 bg-white p-3 dark:border-slate-600">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="max-h-[420px] w-full object-contain" />
      </div>
      {caption && (
        <p className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500">{caption}</p>
      )}
    </div>
  );
}

function CaseShot({ src, alt, tag, tone }: { src: string; alt: string; tag: string; tone: "warn" | "danger" | "success" }) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : tone === "danger"
        ? "bg-red-500/15 text-red-500 dark:text-red-400"
        : "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border-2 border-warm-200 bg-slate-950 dark:border-slate-600">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="size-full object-contain" />
      </div>
      <span className={`rounded px-3 py-1.5 text-center text-xs font-bold ${toneClass}`}>{tag}</span>
    </div>
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
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream-50 md:text-5xl">RT-DETRv2 채택</h1>
          <div className="mt-7 space-y-3 text-lg font-semibold leading-7 text-slate-500 dark:text-warm-300">
            <p>현재·차기 화재 감지 모델 비교 — 3모델 정량 지표 비교 보고서</p>
            <p>동일 체급·동일 데이터의 조건에서 세 모델을 비교한 최종 채택 결과를 설명합니다.</p>
          </div>
        </div>

        <div className="my-12 h-1 bg-flare-500" />

        <div>

          {/* ── 01. 정량 지표 비교 ── */}
          <ReportSection
            id="sec-01"
            sectionNumber="01"
            title="3모델 핵심 지표 비교"
            subtitle="mAP50은 동등 — 격차는 smoke 재현율과 추론 속도에서 갈린다"
          >
            <div className="space-y-8">
              <DataTable
                headers={["모델", "mAP50", "smoke Recall", "FPS"]}
                rows={[
                  { cells: ["RT-DETRv2-l", "0.952", "0.97", "~48"], highlight: true },
                  { cells: ["YOLOv11-l", "0.957", "0.93", "~92"] },
                  { cells: ["YOLOv8-l", "0.951", "0.93", "~94"] },
                ]}
              />
              <InfoBox>
                <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                  mAP50은 세 모델이 사실상 동등하지만,{" "}
                  <span className="font-black text-flare-600 dark:text-flare-400">smoke 재현율 0.97</span>과 전역
                  문맥 기반 오탐 억제 특성에서 RT-DETRv2가 우위를 보였습니다.
                </p>
              </InfoBox>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                측정 환경: NVIDIA RTX A4000 · batch=1 · 640×640 · TensorRT 최적화 미적용
              </p>
            </div>
          </ReportSection>

          {/* ── 02. 채택 근거 ── */}
          <ReportSection
            id="sec-02"
            sectionNumber="02"
            title="채택 근거"
            subtitle="오탐 억제 · smoke 재현율 · 채널 커버리지 — 운영 신뢰도 조건과의 부합"
          >
            <div className="space-y-4">
              {[
                {
                  title: "오탐 억제",
                  desc: "전역 문맥으로 등화류·반사광과 화염을 구분 — 지역 특징 기반 YOLO의 혼동을 구조적으로 줄인다.",
                },
                {
                  title: "smoke Recall +4%p",
                  desc: "0.97 vs 0.93 — 화재 초기인 연기를 더 놓치지 않는다. 조기 경보의 핵심 지표.",
                  highlight: true,
                },
                {
                  title: "22채널 동시 커버",
                  desc: "48 FPS ÷ 5FPS 샘플링 → 채널 다중화. 속도 열위를 운영 전략으로 상쇄.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`overflow-hidden rounded-lg border-2 ${item.highlight ? "border-flare-500" : "border-warm-200 dark:border-slate-600"}`}
                >
                  <div
                    className={`flex items-center gap-3 px-5 py-3 ${
                      item.highlight
                        ? "bg-flare-500/10"
                        : "border-b-2 border-warm-200 bg-warm-100 dark:border-slate-600 dark:bg-slate-700"
                    }`}
                  >
                    <span aria-hidden className="h-4 w-1 rounded-full bg-flare-500" />
                    <span className={`text-sm font-black ${item.highlight ? "text-flare-600 dark:text-flare-400" : "text-slate-900 dark:text-cream-50"}`}>
                      {item.title}
                    </span>
                  </div>
                  <div className="p-5 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">{item.desc}</div>
                </div>
              ))}
            </div>
          </ReportSection>

          {/* ── 03. RT-DETRv2 클래스별 성능 ── */}
          <ReportSection
            id="sec-03"
            sectionNumber="03"
            title="RT-DETRv2 클래스별 성능"
            subtitle="fire 0.987 · smoke 0.946 · carlight 0.937 — 재현율은 전 클래스 0.97 이상"
          >
            <div className="space-y-8">
              <DataTable
                headers={["클래스", "mAP50", "Recall", "best F1"]}
                rows={[
                  { cells: ["fire", "0.987", "0.98", "0.974"] },
                  { cells: ["smoke", "0.946", "0.97", "0.906"], highlight: true },
                  { cells: ["carlight", "0.937", "0.98", "0.890"] },
                  { cells: ["전체 (all)", "0.957", "0.98", "0.920"] },
                ]}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ReportImage
                  src={`${base}/confusion_matrix_normalized.png`}
                  alt="Confusion Matrix Normalized"
                  caption="Confusion Matrix (Normalized)"
                />
                <ReportImage
                  src={`${base}/PR_curve.png`}
                  alt="Precision-Recall Curve"
                  caption="Precision–Recall · mAP@0.5 = 0.957"
                />
              </div>
              <InfoBox>
                <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                  놓친 smoke 3%는 대부분{" "}
                  <span className="font-black text-slate-900 dark:text-cream-50">background</span>로 분류되어
                  미탐보다 보수적 — 반대로 background를 smoke로 보는 오탐(0.82)이{" "}
                  <span className="font-black text-flare-600 dark:text-flare-400">오탐 억제 측면의 개선 여지</span>입니다.
                </p>
              </InfoBox>
            </div>
          </ReportSection>

          {/* ── 04. RT-DETRv2 학습 결과 ── */}
          <ReportSection
            id="sec-04"
            sectionNumber="04"
            title="RT-DETRv2 학습 결과"
            subtitle="50 Epochs — 20에폭 부근 mAP50 조기 수렴, 박스 위치 정밀도는 후반까지 상승"
          >
            <div className="space-y-8">
              <ReportImage src={`${base}/results.png`} alt="RT-DETRv2 Training Results" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { value: "0.954", label: "best mAP@0.5" },
                  { value: "0.695", label: "best mAP@0.5:0.95" },
                  { value: "0.806", label: "best mAP@0.75" },
                  { value: "−57%", label: "Total Loss 27.7 → 11.8", highlight: true },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-lg border-2 p-4 ${
                      stat.highlight
                        ? "border-flare-500 bg-flare-500/5"
                        : "border-warm-200 bg-cream-50 dark:border-slate-600 dark:bg-slate-900"
                    }`}
                  >
                    <div className={`text-2xl font-black ${stat.highlight ? "text-flare-600 dark:text-flare-400" : "text-slate-900 dark:text-cream-50"}`}>
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-warm-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ReportSection>

          {/* ── 05. 정성 검증 요약 ── */}
          <ReportSection
            id="sec-05"
            sectionNumber="05"
            title="정성 추론 검증 — 미학습 22장"
            subtitle="정량 지표가 동등해도, 실제 추론 품질은 갈렸다"
          >
            <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-center">
              <div className="relative size-[260px] shrink-0">
                <div
                  className="size-full rounded-full"
                  style={{ background: "conic-gradient(#45c9e8 0 72.2%, #94a3b8 72.2% 100%)" }}
                />
                <div className="absolute inset-[58px] flex flex-col items-center justify-center rounded-full bg-cream-50 dark:bg-slate-900">
                  <span className="text-5xl font-black text-flare-600 dark:text-flare-400">13</span>
                  <span className="mt-1 text-xs font-semibold text-slate-500 dark:text-warm-300">/ 22건 RT-DETR 우세</span>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3">
                {[
                  { value: "13", label: "RT-DETRv2 우세", highlight: true },
                  { value: "5", label: "3모델 동등" },
                  { value: "0", label: "YOLO 계열 단독 우세" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-4 rounded-lg border-2 p-4 ${
                      item.highlight
                        ? "border-flare-500 bg-flare-500/10"
                        : "border-warm-200 bg-cream-50 dark:border-slate-600 dark:bg-slate-900"
                    }`}
                  >
                    <span className={`w-10 text-2xl font-black ${item.highlight ? "text-flare-600 dark:text-flare-400" : "text-slate-900 dark:text-cream-50"}`}>
                      {item.value}
                    </span>
                    <span className="text-sm font-semibold text-slate-600 dark:text-warm-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ReportSection>

          {/* ── 06. 케이스 6·18 — 터널 진입 차량 화재 ── */}
          <ReportSection
            id="sec-06"
            sectionNumber="06"
            title="케이스 6 · 18 — 터널 내부 차량 화재"
            subtitle="흐릿한 연기·화염 경계 — 지역 특징 YOLO는 미탐, 전역 문맥 RT-DETR은 전부 탐지"
          >
            <div className="space-y-10">
              <div>
                <SubTitle>케이스 6 — 주간 터널 차량 화재</SubTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <CaseShot
                    src={`${base}/case6-yolov8.jpg`}
                    alt="YOLOv8 케이스 6"
                    tag="fire 0.61 · smoke 미탐"
                    tone="warn"
                  />
                  <CaseShot
                    src={`${base}/case6-yolov11.jpg`}
                    alt="YOLOv11 케이스 6"
                    tag="fire 0.29 ⚠ · smoke 미탐"
                    tone="warn"
                  />
                  <CaseShot
                    src={`${base}/case6-rtdetr.jpg`}
                    alt="RT-DETRv2 케이스 6"
                    tag="smoke·fire·carlight 전부"
                    tone="success"
                  />
                </div>
              </div>
              <div>
                <SubTitle>케이스 18 — 터널 화재 검은 연기</SubTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <CaseShot
                    src={`${base}/case18-yolov8.jpg`}
                    alt="YOLOv8 케이스 18"
                    tag="fire 0.85 · smoke 미탐"
                    tone="warn"
                  />
                  <CaseShot
                    src={`${base}/case18-yolov11.jpg`}
                    alt="YOLOv11 케이스 18"
                    tag="fire 탐지 · smoke 미탐"
                    tone="warn"
                  />
                  <CaseShot
                    src={`${base}/case18-rtdetr.jpg`}
                    alt="RT-DETRv2 케이스 18"
                    tag="fire·smoke·carlight 전부"
                    tone="success"
                  />
                </div>
              </div>
            </div>
          </ReportSection>

          {/* ── 07. 케이스 11·21 — 야간조건 ── */}
          <ReportSection
            id="sec-07"
            sectionNumber="07"
            title="케이스 11 · 21 — 오탐지 · 야간 광범위 연기"
            subtitle="훈련셋과 다른 분포의 연기 — 오탐지 미탐과 공간 범위에서 격차"
          >
            <div className="space-y-10">
              <div>
                <SubTitle>케이스 11 — 고속도로 화재 · 오탐지</SubTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <CaseShot
                    src={`${base}/case11-yolov8.jpg`}
                    alt="YOLOv8 케이스 11"
                    tag="smoke 0.36 ⚠ (위험 구간)"
                    tone="warn"
                  />
                  <CaseShot
                    src={`${base}/case11-yolov11.jpg`}
                    alt="YOLOv11 케이스 11"
                    tag="완전 미탐 ✗"
                    tone="danger"
                  />
                  <CaseShot
                    src={`${base}/case11-rtdetr.jpg`}
                    alt="RT-DETRv2 케이스 11"
                    tag="smoke 탐지 성공"
                    tone="success"
                  />
                </div>
              </div>
              <div>
                <SubTitle>케이스 21 — 연쇄식 야간 광범위 연기</SubTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <CaseShot
                    src={`${base}/case21-yolov8.jpg`}
                    alt="YOLOv8 케이스 21"
                    tag="smoke 0.59 · bbox 우측만"
                    tone="warn"
                  />
                  <CaseShot
                    src={`${base}/case21-yolov11.jpg`}
                    alt="YOLOv11 케이스 21"
                    tag="smoke 0.41 · bbox 우측만"
                    tone="warn"
                  />
                  <CaseShot
                    src={`${base}/case21-rtdetr.jpg`}
                    alt="RT-DETRv2 케이스 21"
                    tag="smoke 전체 범위 정확"
                    tone="success"
                  />
                </div>
              </div>
            </div>
          </ReportSection>

          {/* ── 08. 현재 확인된 한계 ── */}
          <ReportSection
            id="sec-08"
            sectionNumber="08"
            title="현재 확인된 한계"
            subtitle="소형 객체 탐지 취약 · 야간 반사광 오탐 — 두 가지 한계가 남아있다"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-5 dark:border-slate-600 dark:bg-slate-900">
                <span className="text-xs font-black text-red-500">한계 1</span>
                <h4 className="mb-1 mt-1 text-lg font-black text-slate-900 dark:text-cream-50">소형 객체 탐지 취약</h4>
                <p className="mb-6 text-sm font-semibold text-slate-500 dark:text-warm-300">
                  대형 대비 약 <span className="font-black text-red-500">12배</span> 격차 — 터널 초기 발화 미탐 위험
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Small", pct: 8, text: "0.06", highlight: true },
                    { label: "Medium", pct: 57, text: "0.57", highlight: false },
                    { label: "Large", pct: 73, text: "0.73", highlight: false },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2">
                      <span className="w-14 text-xs font-black text-slate-700 dark:text-warm-300">{bar.label}</span>
                      <div className="flex flex-1 items-center gap-2">
                        <div
                          className={`h-5 rounded border-2 ${
                            bar.highlight
                              ? "border-flare-500 bg-flare-500/20"
                              : "border-warm-200 bg-warm-200 dark:border-slate-600 dark:bg-slate-600"
                          }`}
                          style={{ width: `${bar.pct}%` }}
                        />
                        <span className={`text-xs font-black ${bar.highlight ? "text-flare-600 dark:text-flare-400" : "text-slate-700 dark:text-warm-300"}`}>
                          {bar.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-5 dark:border-slate-600 dark:bg-slate-900">
                <span className="text-xs font-black text-amber-500">한계 2</span>
                <h4 className="mb-1 mt-1 text-lg font-black text-slate-900 dark:text-cream-50">야간 반사광 오탐</h4>
                <p className="mb-4 text-sm font-semibold text-slate-500 dark:text-warm-300">
                  V3 야간 데이터 증강(63→378장)에도 여전히 의존
                </p>
                <ReportImage
                  src={`${base}/night-reflection-fp.png`}
                  alt="야간 바닥 반사광을 fire·carlight로 오탐한 사례"
                />
                <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-warm-300">
                  원인 — 빛의 연속·반사 패턴이 충분히 학습되지 않음
                </p>
              </div>
            </div>
          </ReportSection>

          {/* ── 09. 향후 개선 계획 ── */}
          <ReportSection
            id="sec-09"
            sectionNumber="09"
            title="향후 개선 계획"
            subtitle="V4 — 고해상도 학습 · 야간 반사광 보강 · TensorRT FP16 · 2단계 VLM 연계"
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { tag: "V4-1", title: "소형 객체 대응", desc: "고해상도(1280) 학습 실험 · 소형 화재·연기 특화 증강" },
                  { tag: "V4-2", title: "야간 반사광 보강", desc: "바닥·물체 반사 케이스 집중 수집 및 라벨링" },
                  { tag: "V4-3", title: "TensorRT 최적화", desc: "FP16 변환으로 추론 속도 ↑ → 동시 처리 채널 수 확대" },
                ].map((item) => (
                  <div key={item.tag} className="rounded-lg border-2 border-warm-200 bg-cream-50 p-5 dark:border-slate-600 dark:bg-slate-900">
                    <span className="text-xs font-black text-flare-600 dark:text-flare-400">{item.tag}</span>
                    <div className="mt-2 text-base font-black text-slate-900 dark:text-cream-50">{item.title}</div>
                    <div className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-warm-300">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div>
                <SubTitle>2단계 VLM 연계 파이프라인</SubTitle>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                  {[
                    { label: "CCTV 입력" },
                    { label: "RT-DETRv2 탐지", sub: "bbox · 신뢰도", highlight: true },
                    { label: "VLM 맥락 해석", sub: "규모·위험도 추정" },
                    { label: "위험도 리포트", sub: "텍스트 알림 생성" },
                  ].map((step) => (
                    <div
                      key={step.label}
                      className={`rounded-lg border-2 p-4 text-center ${
                        step.highlight
                          ? "border-flare-500 bg-flare-500/10"
                          : "border-warm-200 bg-cream-50 dark:border-slate-600 dark:bg-slate-900"
                      }`}
                    >
                      <div className={`text-sm font-black ${step.highlight ? "text-flare-600 dark:text-flare-400" : "text-slate-900 dark:text-cream-50"}`}>
                        {step.label}
                      </div>
                      {step.sub && <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-warm-300">{step.sub}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ReportSection>

          {/* ── 10. 결론 ── */}
          <ReportSection
            id="sec-10"
            sectionNumber="10"
            title="결론 — 동등한 정량 지표 위에서 신뢰도를 택한다"
            subtitle="RT-DETRv2-l 채택 · smoke Recall 0.97 · 전역 문맥 오탐 억제"
          >
            <div className="space-y-8">
              <div className="rounded-xl border-4 border-flare-500 p-6 text-center">
                <p className="text-xl font-black leading-8 text-slate-900 dark:text-cream-50">
                  RT-DETRv2-l 채택 — smoke 재현율 0.97과 전역 문맥 오탐 억제
                </p>
                <p className="mt-3 text-base font-semibold text-slate-500 dark:text-warm-300">
                  다음 단계는 소형 객체·야간 반사광 보강과 2단계 VLM 연계.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="rounded-full border border-flare-500 px-5 py-2 text-sm font-bold text-flare-600 dark:text-flare-400">
                  V4 · 고해상도 학습
                </span>
                <span className="rounded-full border border-warm-200 px-5 py-2 text-sm font-bold text-slate-500 dark:border-slate-600 dark:text-warm-300">
                  TensorRT FP16
                </span>
                <span className="rounded-full border border-warm-200 px-5 py-2 text-sm font-bold text-slate-500 dark:border-slate-600 dark:text-warm-300">
                  VLM 위험도 리포트
                </span>
              </div>
            </div>
          </ReportSection>

        </div>
      </div>
    </section>
  );
}
