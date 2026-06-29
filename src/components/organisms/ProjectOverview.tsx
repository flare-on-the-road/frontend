import { Card, CardContent } from "@/components/atoms";

const capabilityItems = [
  {
    title: "01. ITS CCTV API 연동",
    description:
      "전국 ITS CCTV API(5개 지점 선정)에서 CCTV 이름, 위치, 영상 URL을 수집하고 DB에 저장합니다.",
  },
  {
    title: "02. 프레임 순회 분석",
    description:
      "모든 영상을 실시간 스트리밍 분석하지 않고 Worker가 1분마다 5개의 CCTV를 순회하며 프레임 단위로 분석합니다.",
  },
  {
    title: "03. 화재/연기 위험 판단",
    description:
      "YOLO 또는 RT-DETR로 화재 위험 후보를 필터링하고 VLM이 화재, 연기, 후미등, 조명, 안개를 정밀 구분합니다.",
  },
  {
    title: "04. 이벤트 기반 관제",
    description:
      "위험 상황 발생 시 탐지 이벤트에 위험도와 VLM 판단을 저장하고 화면에 실시간 표시합니다.",
  },
];

export function ProjectOverview() {
  return (
    <section id="overview" className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-[1720px]">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-black tracking-normal text-slate-900 dark:text-cream-50 md:text-5xl">
            <span className="text-flare-500">Flare</span> on the road
          </h2>
          <p className="mt-5 text-xl font-bold text-slate-500 dark:text-warm-300">
            ITS 기반 전국 CCTV 화재 감지 시스템
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <OverviewCard title="프로젝트 개요">
            <strong>Flare on the road</strong>는 전국 ITS CCTV API(5개 CCTV
            선정)를 활용하여 고속도로 CCTV 영상을 주기적으로 캡처해서 분석하고,
            화재 및 연기 상황을 탐지하는 AI 기반 관제 시스템입니다.
          </OverviewCard>

          <OverviewCard title="핵심 기술">
            본 시스템은 모든 CCTV 영상을 직접 실시간 분석하지 않고, CCTV를
            1분마다 순회하며 프레임 단위로 분석합니다. 플래어 팀에서 개발한 1차
            탐지 모델(YOLOv8 / YOLOv11 / RT-DETR)이 위험 후보를 필터링하고, 2차
            VLM이 실제 화재 여부와 오탐 가능성을 판단합니다.
          </OverviewCard>
        </div>

        <Card className="mt-5 rounded-xl border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-7">
            <SectionTitle>핵심 기능</SectionTitle>
            <div className="mt-6 grid gap-5 lg:grid-cols-4">
              {capabilityItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-warm-200 bg-cream-50 p-6 dark:border-slate-700 dark:bg-slate-900"
                >
                  <h4 className="text-xl font-black text-flare-600 dark:text-flare-400">
                    {item.title}
                  </h4>
                  <p className="mt-4 text-lg font-semibold leading-8 text-slate-600 dark:text-warm-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-5 rounded-xl border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-black text-slate-900 dark:text-cream-50">
              우리의 비전
            </h3>
            <p className="mt-3 text-xl font-semibold italic leading-8 text-slate-500 dark:text-warm-300">
              &quot;인공지능의 눈으로 도로 위의 모든 생명을 지키는 것, 그것이{" "}
              <strong>Flare on the road</strong>가 지향하는 AI 기반 화재 감지
              시스템의 출발점입니다.&quot;
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function OverviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-xl border-warm-200 bg-warm-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <CardContent className="p-7">
        <SectionTitle>{title}</SectionTitle>
        <p className="mt-4 text-xl font-semibold leading-9 text-slate-600 dark:text-warm-300">
          {children}
        </p>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-4 text-2xl font-black text-slate-900 dark:text-cream-50">
      <span
        className="h-8 w-1.5 rounded-full bg-flare-500"
        aria-hidden="true"
      />
      {children}
    </h3>
  );
}
