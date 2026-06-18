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
      className={`rounded px-4 py-3 text-center text-sm font-bold ${
        highlight
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
                    { cells: ["carlight", "오탐 억제 (네거티브)", "화염과 시각적 유사성 혼동 방지"], highlight: true },
                  ]}
                />
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-500 dark:text-warm-300">
                  모든 모델을 동일한 데이터셋으로 평가하여 공정한 비교를 보장했습니다. 클래스 설계 단계부터 도메인 특성을 반영하여 오탐 억제 구조를 내재화했습니다.
                </p>
              </div>

              <div>
                <SubTitle>데이터 규모</SubTitle>
                <div className="space-y-3">
                  {[
                    { value: "12,853", label: "전체 이미지 장수", sub: "어노테이션 21,802개 / Train:Val = 9:1" },
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
                  클래스 분포
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
              </div>
            </div>
          </StepSection>

          {/* ── 03. 데이터 증강 파이프라인 ── */}
          <StepSection
            id="step-03"
            stepNumber="03"
            title="데이터 증강 파이프라인"
            quote="멀티스케일 증강으로 소형 객체 및 야간 환경 탐지 강화"
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
                <SubTitle>핵심 전략: Multi-scale 학습</SubTitle>
                <InfoBox>
                  <h4 className="mb-3 text-sm font-black text-flare-600 dark:text-flare-400">13단계 해상도 변화</h4>
                  <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                    480px부터 800px까지 13단계의 해상도 변화를 주어 학습합니다. 근거리의 대형 객체부터 원거리의 소형 객체까지 동일한 모델이 안정적으로 커버할 수 있도록 하는 핵심 전략입니다.
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
            quote="RT-DETRv2 채택: 전역 문맥 파악으로 등화류 혼동 오탐 원천 차단"
          >
            <div className="space-y-8">
              <div>
                <SubTitle>구조적 특성 비교</SubTitle>
                <div className="space-y-3">
                  {[
                    { label: "YOLO 계열", desc: "앵커 기반, 지역 특징 의존 → 등화류와 화염 혼동 오탐 빈번", highlight: false },
                    { label: "RT-DETR", desc: "Transformer 전역 문맥 파악 → 주변 맥락 종합 판단으로 오탐 억제", highlight: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex overflow-hidden rounded-lg border-2 ${item.highlight ? "border-flare-500" : "border-warm-200 dark:border-slate-600"}`}
                    >
                      <div
                        className={`flex w-28 shrink-0 items-center justify-center px-3 py-3 text-center text-sm font-black ${
                          item.highlight
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
                <SubTitle>정량 비교 (동일 체급/데이터셋)</SubTitle>
                <DataTable
                  headers={["모델", "mAP50", "FPS", "smoke 재현율"]}
                  rows={[
                    { cells: ["YOLOv11-l", "0.964", "~92", "0.93"] },
                    { cells: ["YOLOv8-l", "0.958", "~94", "0.93"] },
                    { cells: ["RT-DETRv2-l", "0.952", "~48", "0.97 ✓"], highlight: true },
                  ]}
                />
              </div>

              <div>
                <SubTitle>핵심 판단</SubTitle>
                <div className="rounded-lg border-2 border-flare-500 p-5">
                  <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                    mAP50은 소폭 낮지만,{" "}
                    <span className="font-black text-flare-600 dark:text-flare-400">smoke 재현율 +4%p 향상</span>은
                    조기 경보 신뢰도에 직결됩니다.
                    <br />
                    <br />
                    추론 속도를 일부 포기하더라도{" "}
                    <span className="font-black text-flare-600 dark:text-flare-400">정확도(오탐 억제)를 우선</span>하는
                    것이 본 시스템의 설계 철학입니다.
                  </p>
                </div>
              </div>

              <div>
                <SubTitle>속도 한계 상쇄 전략</SubTitle>
                <ul className="space-y-4">
                  {[
                    { title: "5FPS 다운샘플링 적용", desc: "동시 9채널 커버 가능 (터널 1구간 CCTV 수 상회)" },
                    { title: "TensorRT 최적화", desc: "적용 시 추가적인 추론 속도 개선 가능" },
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
                    { cells: ["1단계", "RT-DETRv2 (실시간, 5FPS 샘플링)", "CCTV 영상에서 fire/smoke/carlight 1차 탐지"] },
                    { cells: ["2단계", "VLM 재검증 (이벤트 발견 시 트리거)", "컨텍스트 기반 재판단 및 오탐 필터링"], highlight: true },
                    { cells: ["3단계", "관제센터 보고 판단", "확정 알림만 전송, 운영자 최종 판단 지원"] },
                  ]}
                />
              </div>

              <div>
                <SubTitle>Pipeline Flow</SubTitle>
                <div className="space-y-2">
                  <FlowBox>CCTV 영상 입력</FlowBox>
                  <FlowArrow />
                  <FlowBox>[1단계] 비전 모델 추론 — RT-DETRv2 (5FPS)</FlowBox>
                  <FlowArrow label="이벤트 탐지 시" />
                  <FlowBox highlight>[2단계] VLM 검토 추론 — 컨텍스트 기반 재검증</FlowBox>
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
                      className={`rounded-lg border-2 p-4 ${
                        item.accent
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
            quote="V3 성과 확인 후 소형 객체·야간 반사광 한계를 V4에서 집중 보강"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <SubTitle>V3 학습 결과</SubTitle>
                <div className="space-y-3">
                  {[
                    { value: "0.952", label: "mAP50 (50 Epochs)" },
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
                      20에폭 부근 mAP50 조기 수렴, mAP50-95는 후반까지 지속 상승
                    </p>
                  </InfoBox>
                </div>
              </div>

              <div className="space-y-4">
                <SubTitle>발견된 한계</SubTitle>
                <div className="space-y-3">
                  <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                    <h4 className="mb-3 text-sm font-black text-slate-900 dark:text-cream-50">소형 객체 탐지 저하</h4>
                    <div className="space-y-2">
                      {[
                        { label: "Large", pct: 73, text: "0.73", highlight: false },
                        { label: "Medium", pct: 57, text: "0.57", highlight: false },
                        { label: "Small", pct: 8, text: "0.06", highlight: true },
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
                  <div className="rounded-lg border-2 border-warm-200 bg-cream-50 p-4 dark:border-slate-600 dark:bg-slate-900">
                    <h4 className="mb-2 text-sm font-black text-slate-900 dark:text-cream-50">야간 반사광 오탐</h4>
                    <p className="text-xs font-semibold leading-5 text-slate-500 dark:text-warm-300">
                      바닥 전조등 반사광을 fire 또는 carlight로 오인하는 케이스 실측 발생
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <SubTitle>V4 개선 목표</SubTitle>
                <div className="space-y-3">
                  {[
                    { num: "01", text: "고해상도 학습 및 소형 객체 증강 강화", sub: null, highlight: false },
                    { num: "02", text: "야간 반사광 케이스 집중 보강", sub: "추가 데이터 1,300장 / 라벨 2,500+ 구축 중", highlight: true },
                  ].map((item) => (
                    <div
                      key={item.num}
                      className={`flex overflow-hidden rounded-lg border-2 ${item.highlight ? "border-flare-500" : "border-warm-200 dark:border-slate-600"}`}
                    >
                      <div
                        className={`flex w-12 shrink-0 items-center justify-center text-lg font-black ${
                          item.highlight
                            ? "bg-flare-500 text-cream-50"
                            : "bg-warm-100 text-slate-700 dark:bg-slate-700 dark:text-warm-300"
                        }`}
                      >
                        {item.num}
                      </div>
                      <div className="flex flex-col justify-center p-4">
                        <div className="text-sm font-black text-slate-900 dark:text-cream-50">{item.text}</div>
                        {item.sub && (
                          <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-warm-300">{item.sub}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  <InfoBox>
                    <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                      배포 후 실측 환경에서 발견된 한계를 다음 버전 데이터셋에 반영하는{" "}
                      <span className="font-black text-flare-600 dark:text-flare-400">반복 개선 사이클</span>
                    </p>
                  </InfoBox>
                </div>
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
                      { version: "V1", desc: "초기 모델 구축, 기본 fire/smoke 탐지", current: false },
                      { version: "V2", desc: "carlight 네거티브 클래스 추가, 오탐 억제 도입", current: false },
                      { version: "V3", desc: "VLM 2단 파이프라인, 야간 데이터 증강", current: false },
                      { version: "V4 (진행 중)", desc: "소형 객체 강화, 야간 반사광 보강", current: true },
                    ].map((item) => (
                      <div key={item.version} className="relative">
                        <div
                          className={`absolute -left-[38px] top-3.5 size-4 rounded-full border-4 border-flare-500 ${
                            item.current ? "bg-flare-500" : "bg-cream-50 dark:bg-slate-800"
                          }`}
                        />
                        <div
                          className={`rounded-lg border-2 p-4 ${
                            item.current
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
                  <FlowBox>사고 감지 (장기 목표)</FlowBox>
                </div>
                <div className="mt-5">
                  <InfoBox>
                    <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-warm-300">
                      <span className="font-black text-slate-900 dark:text-cream-50">carlight</span>는 네거티브
                      클래스로 시작해 차량 밀집도·정체 탐지 등으로 확장 가능한 핵심 자산입니다.
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
                  { title: "모델 선정 기준", body: "속도가 아닌 오탐 억제와 smoke 재현율을 최우선으로 고려하여 RT-DETRv2 채택" },
                  { title: "파이프라인", body: "비전 모델 탐지 → VLM 재검증 → 관제센터 보고로 이어지는 2단 이중 차단 구조" },
                  { title: "데이터 전략", body: "도메인 논리를 반영한 3-클래스 설계 및 실측 한계를 반영하는 반복 증강 사이클" },
                  { title: "확장성", body: "carlight 클래스를 활용하여 오탐 억제를 넘어 교통 관제(정체/사고 탐지)로 확장 가능" },
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
