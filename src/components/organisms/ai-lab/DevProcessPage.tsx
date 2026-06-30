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
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-20 pb-14">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-flare-500 text-sm font-black text-cream-50">
          {stepNumber}
        </span>
        <div>
          <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-cream-50">{title}</h2>
          <p className="mt-2 text-base font-semibold text-slate-500 dark:text-warm-300">{quote}</p>
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

function FlowBox({
  children,
  highlight = false,
  dashed = false,
}: {
  children: React.ReactNode;
  highlight?: boolean;
  dashed?: boolean;
}) {
  return (
    <div
      className={`rounded px-4 py-3 text-center text-sm font-bold ${highlight
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
        <span className="rounded bg-warm-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-warm-300">
          {label}
        </span>
      )}
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
          className={`border-t-2 border-warm-200 dark:border-slate-600 ${row.highlight ? "bg-flare-500/10" : "bg-cream-50 dark:bg-slate-900"
            }`}
          style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
        >
          {row.cells.map((cell, j) => (
            <div
              key={j}
              className={`border-r-2 border-warm-200 px-4 py-3 text-sm last:border-r-0 dark:border-slate-600 ${j === 0
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
            className="rounded px-2.5 py-1 text-xs font-black text-slate-500 transition-colors hover:bg-flare-500/10 hover:text-flare-600 dark:text-warm-300 dark:hover:text-flare-400"
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
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream-50 md:text-5xl">개발 과정</h1>
          <div className="mt-7 space-y-3 text-lg font-semibold leading-7 text-slate-500 dark:text-warm-300">
            <p>터널 CCTV 화재 감지 AI 시스템 — 문제 정의부터 반복 개선까지</p>
            <p>오탐 억제를 중심으로 신뢰받는 AI 파이프라인을 구축한 과정을 설명합니다.</p>
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
                <p className="text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
                  터널은 연기 경계가 불분명하고 차량 등화류가 화염과 시각적으로 유사해 AI 탐지에 매우 까다로운 환경입니다.
                </p>
              </div>

              <InfoBox>
                <h4 className="mb-3 text-sm font-black text-flare-600 dark:text-flare-400">
                  2022 과천 제2경인고속도로 터널 화재
                </h4>
                <ul className="space-y-2">
                  {["사망 5명, 부상 56명", "CCTV 미확인으로 초기 대응 지연", "오탐 누적으로 경보 신뢰도 저하"].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
                      <span className="text-sm font-semibold text-slate-600 dark:text-warm-300">{item}</span>
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
              </div>
            </div>
          </StepSection>

          {/* ── 02. 데이터셋 구성 ── */}
          <StepSection id="step-02" stepNumber="02" title="데이터셋 구성" quote="도메인 논리를 반영한 3-클래스 설계로 오탐 억제 기반 마련">
            <div className="space-y-8">
              <div>
                <SubTitle>클래스 설계 및 의도</SubTitle>
                <DataTable
                  headers={["클래스", "역할", "설계 의도"]}
                  rows={[
                    { cells: ["fire", "즉각 알림 트리거", "고대비·고온 색상 탐지 특화"] },
                    { cells: ["smoke", "조기 경보 핵심", "경계 불명확, 최고 난이도 탐지"] },
                    { cells: ["carlight", "오탐 억제 (네거티브 클래스)", "차량 등화류 ↔ 화염 혼동 차단용 보조 클래스"], highlight: true },
                  ]}
                />
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
                  carlight는 그 자체가 탐지 목적이 아니라, 터널 내 전조등·후미등이 fire/smoke로 오인되는 것을 막기 위한
                  네거티브 보조 클래스로 설계되었습니다. 단독 검출 시에는 알림을 발생시키지 않습니다.
                </p>
              </div>

              <div>
                <SubTitle>데이터 규모 (V3 기준)</SubTitle>
                <div className="space-y-3">
                  {[
                    { value: "12,853", label: "전체 이미지 장수", sub: "어노테이션 21,802개 / train 11,567 · val 1,286" },
                    { value: "588", label: "배경 이미지 (Background)", sub: "정상 상황 허위탐지 억제 목적" },
                    { value: "+378", label: "V3 야간화재 데이터 증강", sub: "원본 63장 × 5배 증강 적용" },
                  ].map((stat) => (
                    <div
                      key={stat.value}
                      className="flex items-center gap-5 rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900"
                    >
                      <div className="text-3xl font-black text-flare-600 dark:text-flare-400">{stat.value}</div>
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-cream-50">{stat.label}</div>
                        <div className="text-xs font-semibold text-slate-500 dark:text-warm-300">{stat.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-warm-300">
                  클래스 분포 (어노테이션 비중)
                </p>
                <div className="flex h-7 overflow-hidden rounded border-2 border-warm-200 dark:border-slate-600">
                  <div className="flex w-[55%] items-center justify-center bg-slate-400 text-xs font-black text-white">
                    SMOKE 55%
                  </div>
                  <div className="flex w-[40%] items-center justify-center bg-slate-600 text-xs font-black text-white">
                    FIRE 40%
                  </div>
                  <div className="flex w-[5%] items-center justify-center bg-flare-500 text-xs font-black text-slate-900">
                    5%
                  </div>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-400 dark:text-warm-300">
                  carlight는 약 5%로 절대량이 가장 적었으며, 이는 이후 V4에서 보강된 핵심 한계점이 됩니다 (06 참고).
                </p>
              </div>
            </div>
          </StepSection>

          {/* ── 03. 데이터 증강 파이프라인 ── */}
          <StepSection
            id="step-03"
            stepNumber="03"
            title="데이터 증강 파이프라인"
            quote="멀티스케일 증강과 야간 도메인 보강으로 탐지 강건성 확보"
          >
            <div className="space-y-8">
              <div>
                <SubTitle>증강 기법 파이프라인</SubTitle>
                <p className="mb-5 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
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
                <SubTitle>V3 야간 화재 도메인 보강</SubTitle>
                <InfoBox>
                  <h4 className="mb-3 text-sm font-black text-flare-600 dark:text-flare-400">63장 × 5배 = 378장 증강</h4>
                  <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                    V1은 주간·야외 위주 데이터로 학습되어 터널 내부(야간성) 환경과 도메인 불일치 문제가 있었습니다. V3에서는
                    원본 야간 화재 이미지 63장을 5배 증강하여 378장을 추가, 터널 도메인 특화 학습을 보강했습니다.
                  </p>
                </InfoBox>
                <div className="mt-5 space-y-3">
                  {[
                    { label: "480px", note: "근거리 대형 객체", pct: "55%" },
                    { label: "640px", note: "표준 입력 크기", pct: "75%" },
                    { label: "800px", note: "원거리 소형 객체 탐지", pct: "100%" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="w-14 text-xs font-black text-slate-700 dark:text-warm-300">{item.label}</span>
                      <div className="flex flex-1 items-center gap-3">
                        <div
                          className="h-5 rounded border-2 border-warm-200 bg-warm-200 dark:border-slate-600 dark:bg-slate-600"
                          style={{ width: item.pct }}
                        />
                        <span className="text-xs font-semibold text-slate-500 dark:text-warm-300">{item.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StepSection>

          {/* ── 04. 모델 선정 ── */}
          <StepSection
            id="step-04"
            stepNumber="04"
            title="모델 선정"
            quote="RT-DETRv2 채택: smoke 재현율과 전역 문맥 파악으로 오탐 억제"
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
                        className={`flex w-28 shrink-0 items-center justify-center px-3 py-3 text-center text-sm font-black ${item.highlight
                            ? "bg-flare-500 text-cream-50"
                            : "bg-warm-100 text-slate-700 dark:bg-slate-700 dark:text-warm-300"
                          }`}
                      >
                        {item.label}
                      </div>
                      <div className="flex items-center px-4 py-3 text-sm font-semibold text-slate-600 dark:text-warm-300">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SubTitle>정량 비교 — RT-DETRv2 V3 클래스별 AP@50 (val 1,286장)</SubTitle>
                <DataTable
                  headers={["클래스", "AP@50"]}
                  rows={[
                    { cells: ["fire", "0.987"] },
                    { cells: ["smoke", "0.946"] },
                    { cells: ["carlight", "0.937"] },
                    { cells: ["mAP@50 (전체)", "0.952"], highlight: true },
                  ]}
                />
                <p className="mt-4 mb-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-warm-300">
                  smoke 미탐지 정성 비교 (동일 22장 테스트 기준)
                </p>
                <DataTable
                  headers={["모델", "최종 mAP@50", "smoke 미탐지 (22장)"]}
                  rows={[
                    { cells: ["YOLOv8-l", "~0.955", "187건"] },
                    { cells: ["YOLOv11-l", "~0.955", "187건"] },
                    { cells: ["RT-DETRv2 (V3)", "0.952", "39건 ✓"], highlight: true },
                  ]}
                />
                <p className="mt-3 text-xs font-semibold leading-5 text-slate-400 dark:text-warm-300">
                  세 모델의 전체 mAP@50은 거의 동일하지만, 동일 22장 정성 평가에서 smoke 미탐지 건수는 RT-DETRv2가
                  YOLO 계열 대비 약 1/5 수준으로 압도적으로 낮았습니다. 이 차이가 최종 모델 채택의 결정적 근거입니다.
                </p>
              </div>

              <div>
                <SubTitle>핵심 판단</SubTitle>
                <div className="rounded-lg border-2 border-flare-500 p-5">
                  <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                    전체 mAP는 YOLO 계열과 큰 차이가 없지만,{" "}
                    <span className="font-black text-flare-600 dark:text-flare-400">smoke 미탐지 187건 → 39건</span>
                    이라는 정성 평가 결과는 조기 경보 신뢰도에 직결됩니다.
                    <br />
                    <br />
                    추론 속도를 일부 포기하더라도{" "}
                    <span className="font-black text-flare-600 dark:text-flare-400">정확도(오탐·미탐 억제)를 우선</span>
                    하는 것이 본 시스템의 설계 철학입니다.
                  </p>
                </div>
              </div>

              <div>
                <SubTitle>NMS-free 구조의 현실과 대응</SubTitle>
                <p className="mb-4 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
                  RT-DETRv2는 Hungarian Matching 기반 End-to-End 구조로 이론상 NMS 후처리가 불필요하지만, 학습이
                  완전히 수렴되지 않은 상태에서는 동일 객체에 여러 쿼리가 반응해 중복 bbox가 실제로 발생했습니다.
                </p>
                <DataTable
                  headers={["후처리 설정", "값", "역할"]}
                  rows={[
                    { cells: ["score threshold", "0.5", "confidence 0.5 미만 bbox 선제거"] },
                    { cells: ["NMS IoU threshold", "0.5", "동일 클래스 내 50% 이상 중복 bbox 제거"] },
                  ]}
                />
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
                  YOLO 계열의 NMS가 수천 개 앵커 전체에 적용되는 것과 달리, RT-DETR의 쿼리 수는 기본
                  <span className="font-black text-slate-900 dark:text-cream-50"> 300개로 제한</span>되어 후처리 NMS
                  연산 부담이 현저히 낮습니다. NMS-free의 완전한 장점은 희석되었으나, 연산 비용 측면의 우위는
                  유지된다고 정직하게 기록합니다.
                </p>
              </div>

              <div>
                <SubTitle>속도 한계 상쇄 전략</SubTitle>
                <ul className="space-y-4">
                  {[
                    { title: "5FPS 다운샘플링 적용", desc: "동시 다채널 CCTV 모니터링 부담 완화" },
                    { title: "TensorRT 최적화", desc: "적용 시 추가적인 추론 속도 개선 가능 (단, GPU별 엔진 재생성 필요)" },
                    { title: "측정 환경", desc: "RTX A4000, batch=1, 640×640 해상도 기준" },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-cream-50">{item.title}</div>
                        <div className="text-xs font-semibold text-slate-500 dark:text-warm-300">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </StepSection>

          {/* ── 05. 파이프라인 아키텍처 ── */}
          <StepSection
            id="step-05"
            stepNumber="05"
            title="파이프라인 아키텍처"
            quote="비전 모델 탐지 → VLM 재검증 → 관제센터 보고: 3단계 신뢰 파이프라인"
          >
            <div className="space-y-8">
              <p className="text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
                단일 모델 판단에 의존하지 않고, 탐지 결과를 VLM이 재검증하는 2단 구조로 오탐을 이중 차단합니다.
              </p>

              <div>
                <SubTitle>파이프라인 3단계</SubTitle>
                <DataTable
                  headers={["단계", "구성 요소", "역할"]}
                  rows={[
                    { cells: ["1단계", "RT-DETRv2 (5FPS 샘플링)", "CCTV 영상에서 fire/smoke/carlight 1차 탐지"] },
                    { cells: ["2단계", "VLM 재검증 (이벤트 발견 시 트리거)", "컨텍스트 기반 재판단 및 오탐 필터링"], highlight: true },
                    { cells: ["3단계", "관제센터 보고 판단", "확정 알림만 전송, 운영자 최종 판단 지원"] },
                  ]}
                />
              </div>

              <div>
                <SubTitle>VLM 필터링 임계값 로직 (test_300 Threshold Sweep 근거)</SubTitle>
                <DataTable
                  headers={["조건", "처리"]}
                  rows={[
                    { cells: ["fire ≥ 0.70 (P 0.946 / R 0.991)", "즉시 알림"] },
                    { cells: ["smoke ≥ 0.70 (P 0.901 / R 0.808)", "즉시 알림"] },
                    { cells: ["fire/smoke 0.30~0.70", "VLM 게이트로 이동"], highlight: true },
                    { cells: ["carlight + fire/smoke 동시 검출", "confidence 무관 VLM 게이트 강제 이동"], highlight: true },
                    { cells: ["confidence < 0.30", "무시"] },
                  ]}
                />
                <p className="mt-3 text-xs font-semibold leading-5 text-slate-400 dark:text-warm-300">
                  carlight 단독 검출은 무시되지만, fire/smoke와 동시 검출되는 경우는 confidence와 무관하게 VLM
                  재검증으로 강제 이동시켜 등화류 혼동발 오탐을 추가로 한 번 더 차단합니다.
                </p>
              </div>

              <div>
                <SubTitle>1차 / 2차 분기 플로우</SubTitle>
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
                      <div className={`text-sm font-black ${item.accent ? "text-flare-600 dark:text-flare-400" : "text-slate-900 dark:text-cream-50"}`}>
                        {item.title}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-warm-300">{item.desc}</div>
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
            quote="V3의 carlight 약점을 V4에서 정조준 보강, 동일 기준 평가로 검증"
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
                      <div className="text-2xl font-black text-flare-600 dark:text-flare-400">{stat.value}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-warm-300">{stat.label}</div>
                    </div>
                  ))}
                  <InfoBox>
                    <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                      약 20에폭 부근 mAP50 조기 수렴 확인
                    </p>
                  </InfoBox>
                </div>
              </div>

              <div className="space-y-4">
                <SubTitle>V3에서 발견된 한계 (test_300 독립 평가 기준)</SubTitle>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                    <div className="text-2xl font-black text-flare-600 dark:text-flare-400">0.050</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-warm-300">small 객체 AP — 소형 객체 탐지 취약</div>
                  </div>
                  <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                    <div className="text-2xl font-black text-flare-600 dark:text-flare-400">0.82</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-warm-300">background → smoke 오탐률</div>
                  </div>
                </div>
                <InfoBox>
                  <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                    V3 val(133장→이후 확장 전 carlight 81개)은 표본 부족으로 carlight 성능을 과대평가하고 있었으며,
                    독립 test_300 평가에서 carlight AP@50이 실제로는 0.454에 불과함이 드러났습니다.
                  </p>
                </InfoBox>
              </div>

              <div className="space-y-4">
                <SubTitle>V4 개선 — carlight 보강의 정량적 효과</SubTitle>
                <DataTable
                  headers={["지표", "V3", "V4", "변화"]}
                  rows={[
                    { cells: ["carlight 어노테이션", "1,059개", "6,210개", "+487%"], highlight: true },
                    { cells: ["small 객체 AP (test_300)", "0.050", "0.2294", "× 4.6"], highlight: true },
                    { cells: ["background→smoke 오탐", "0.82", "0.55", "-0.27"] },
                    { cells: ["background→carlight 오탐", "—", "0.34", "신규 발생"] },
                  ]}
                />
                <p className="text-xs font-semibold leading-5 text-slate-400 dark:text-warm-300">
                  carlight 데이터만 보강했을 뿐인데 small 객체 AP와 background→smoke 오탐까지 함께 개선된 것은,
                  클래스 간 데이터 균형이 모델 전체 품질에 영향을 미친다는 것을 보여줍니다.
                </p>
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
                <p className="text-xs font-semibold leading-5 text-slate-400 dark:text-warm-300">
                  fire/smoke 성능은 거의 그대로 유지된 채 carlight만 정확히 개선되어, carlight 보강이 기존 클래스
                  성능을 희생하지 않았음을 확인했습니다.
                </p>
              </div>

              <div className="space-y-4">
                <SubTitle>V4에서 새로 드러난 한계: Underfitting 패턴</SubTitle>
                <InfoBox>
                  <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                    ep12 이후 <span className="font-black text-flare-600 dark:text-flare-400">train loss는 계속 감소</span>하지만{" "}
                    <span className="font-black text-flare-600 dark:text-flare-400">val mAP는 정체</span>되는 패턴이
                    관찰되었습니다. 이는 imgsz=640 기준에서 모델이 학습 가능한 상한에 근접했음을 의미하며, 에폭을
                    추가하는 것만으로는 성능 향상이 어렵습니다. imgsz 확장, 데이터 보강 등 구조적 개선이 필요합니다.
                  </p>
                </InfoBox>
              </div>
            </div>
          </StepSection>

          {/* ── 07. 확장 로드맵 ── */}
          <StepSection
            id="step-07"
            stepNumber="07"
            title="확장 로드맵"
            quote="오탐 억제 기술이 화재 감지를 넘어 교통 관제로 확장된다"
          >
            <div className="space-y-8">
              <div>
                <SubTitle>버전별 개선 타임라인</SubTitle>
                <div className="relative border-l-4 border-flare-500 pl-8">
                  <div className="space-y-4">
                    {[
                      { version: "V1", desc: "baseline 구축. 야외 밝은 환경 위주 데이터로 도메인 미스매치 발생 (mAP@50:95 0.695)", current: false },
                      { version: "V2", desc: "외부 데이터(S3) 추가 시도, 잘못된 라벨 유입으로 성능 하락 (mAP@50:95 0.659)", current: false },
                      { version: "V3", desc: "라벨 정제 + 야간 화재 증강(63×5)으로 회복 (mAP@50 0.952)", current: false },
                      { version: "V4", desc: "carlight 데이터 +487% 보강, small AP 4.6배 향상 (test_300 mAP@50 0.927)", current: true },
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
                          <div className={`text-sm font-black ${item.current ? "text-flare-600 dark:text-flare-400" : "text-slate-900 dark:text-cream-50"}`}>
                            {item.version}
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-warm-300">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-xs font-semibold leading-5 text-slate-400 dark:text-warm-300">
                  V1→V2→V3의 핵심 교훈: <span className="font-black text-slate-700 dark:text-warm-300">데이터의 양보다 품질이 중요하다.</span>{" "}
                  V4는 이 교훈 위에서 특정 클래스(carlight)의 절대 부족분을 정밀 타겟팅한 별도 목적의 실험입니다.
                </p>
              </div>

              <div>
                <SubTitle>V5 개선 방향</SubTitle>
                <ul className="space-y-3">
                  {[
                    { title: "imgsz=1280, AMP=True", desc: "원본 1920×1080 정보 손실 최소화, underfitting 패턴 해소" },
                    { title: "야간 반사광 hard negative 보강", desc: "background→carlight 오탐(0.34) 개선을 위한 네거티브 샘플링" },
                    { title: "검은 연기 야외 데이터 보강", desc: "광역 확산·저해상도 연기 도메인 강화" },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare-500" />
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-cream-50">{item.title}</div>
                        <div className="text-xs font-semibold text-slate-500 dark:text-warm-300">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <SubTitle>carlight 기능 확장 구상</SubTitle>
                <div className="space-y-2">
                  <FlowBox highlight>오탐 억제 (현재)</FlowBox>
                  <FlowArrow />
                  <FlowBox dashed>차량 밀집도 분석 (개발 예정)</FlowBox>
                  <FlowArrow />
                  <FlowBox dashed>정체·혼잡 탐지</FlowBox>
                  <FlowArrow />
                  <FlowBox dashed>사고 감지 (장기 목표)</FlowBox>
                </div>
                <div className="mt-5">
                  <InfoBox>
                    <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                      <span className="font-black text-slate-900 dark:text-cream-50">carlight</span>는 오탐 억제용
                      네거티브 클래스로 시작했지만, 보강된 데이터 자산을 활용해 차량 밀집도·정체 탐지 등으로
                      확장 가능한 자산입니다. (현재는 구상 단계이며 별도 모델 개발이 필요합니다.)
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
            title="결론 — 신뢰받는 AI가 생명을 지킨다"
            quote="오탐 억제 → 경보 신뢰도 회복 → 실제 화재 대응력 향상"
          >
            <div className="space-y-8">
              <p className="text-center text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
                이 프로젝트의 핵심은 단순히 높은 mAP 수치를 달성하는 것이 아닙니다.
                <br />
                운영자가 경보를 믿고 즉각 행동할 수 있는{" "}
                <span className="font-black text-slate-900 dark:text-cream-50">신뢰받는 AI 시스템</span>을 구축하는 것입니다.
              </p>

              <div className="rounded-xl border-4 border-flare-500 p-6 text-center">
                <p className="text-xl font-black leading-8 text-slate-900 dark:text-cream-50">
                  "추론 속도를 일부 포기하더라도 정확도와 신뢰도를 택한다"
                </p>
                <p className="mt-3 text-base font-semibold text-slate-500 dark:text-warm-300">
                  이것이 본 시스템의 변하지 않는 설계 철학입니다.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "모델 선정 기준", body: "전체 mAP가 아닌 smoke 미탐지 건수(39건 vs 187건)를 핵심 근거로 RT-DETRv2 채택" },
                  { title: "파이프라인", body: "비전 모델 탐지 → VLM 재검증 → 관제센터 보고로 이어지는 2단 이중 차단 구조" },
                  { title: "데이터 전략", body: "데이터 양보다 품질을 우선하되, 약점 클래스(carlight)는 정밀 타겟팅하여 보강" },
                  { title: "확장성", body: "carlight 클래스를 활용하여 오탐 억제를 넘어 교통 관제(정체/사고 탐지)로 확장 구상" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="overflow-hidden rounded-lg border-2 border-warm-200 bg-cream-50 dark:border-slate-600 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3 border-b-2 border-warm-200 bg-warm-100 px-5 py-3 dark:border-slate-600 dark:bg-slate-700">
                      <span aria-hidden className="h-4 w-1 rounded-full bg-flare-500" />
                      <span className="text-sm font-black uppercase text-slate-900 dark:text-cream-50">{item.title}</span>
                    </div>
                    <div className="p-5 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">{item.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </StepSection>

        </div>
      </div>
    </section>
  );
}