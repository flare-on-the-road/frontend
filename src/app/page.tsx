import {
  BarChart3,
  Bot,
  Database,
  Flame,
  RadioTower,
  Settings2,
  Siren,
  Video,
  Wrench,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";
import { Header } from "@/components/organisms";

const processItems = [
  {
    icon: Video,
    title: "CCTV 영상 수집",
    description: "전국 고속도로의 실시간 스트리밍 데이터를 수집합니다.",
  },
  {
    icon: Bot,
    title: "YOLOv11 AI 탐지",
    description: "객체 인식 AI가 낙하물, 역주행, 사고를 즉각 탐지합니다.",
  },
  {
    icon: Database,
    title: "탐지 기록 저장",
    description: "모든 위험 상황은 고해상도 스냅샷과 함께 DB에 기록됩니다.",
  },
  {
    icon: Siren,
    title: "신고 및 알림",
    description: "탐지 즉시 관제 센터와 유관 기관에 긴급 알림을 전송합니다.",
  },
  {
    icon: Wrench,
    title: "처리 상태 관리",
    description: "현장 출동 및 조치 완료까지 전체 프로세스를 관리합니다.",
  },
  {
    icon: BarChart3,
    title: "통계 및 분석",
    description: "데이터 기반 사고 다발 지역 분석 및 예방 대책을 제시합니다.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-cream-50 text-slate-900 dark:bg-slate-900 dark:text-cream-50">
      <Header />

      <section
        id="about"
        className="mx-auto flex min-h-[690px] max-w-6xl flex-col items-center justify-center px-5 pb-24 pt-20 text-center sm:px-8"
      >
        <div className="mb-8 flex size-16 items-center justify-center rounded-full bg-flare-500 text-cream-50 shadow-sm shadow-flare-500/30">
          <Flame className="size-8 fill-current" aria-hidden="true" />
        </div>
        <h1 className="text-5xl font-black leading-[0.95] text-slate-900 dark:text-cream-50 sm:text-6xl md:text-8xl lg:text-9xl">
          <span className="text-flare-500">Flare</span> on
          <span className="mt-2 block">
            the road
          </span>
        </h1>
        <p className="mt-14 text-sm font-black uppercase text-flare-600">
          YOLOv11 AI · REAL-TIME
        </p>
        <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-slate-500 dark:text-warm-300">
          CCTV와 AI를 결합한 고속도로 안전 관제 플랫폼.
          <br />
          위험 객체를 실시간으로 탐지하고 즉각 대응합니다.
        </p>
      </section>

      <section id="process" className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-[1140px]">
          <SectionHeader
            className="items-center justify-center text-center sm:flex-col sm:items-center sm:justify-center [&_p]:mx-auto"
            title="AI 실시간 안전 관제 프로세스"
            description="Flare는 24시간 멈추지 않고 고속도로의 안전을 지킵니다."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {processItems.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.title}
                  className="min-h-[240px] rounded-xl border-warm-200 bg-warm-50 shadow-none transition-colors hover:border-flare-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-flare-500"
                >
                  <CardHeader className="p-8 pb-4">
                    <div className="mb-6 flex size-11 items-center justify-center rounded-lg bg-cream-100 text-flare-600 dark:bg-slate-700 dark:text-flare-400">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-black leading-7 text-slate-900 dark:text-cream-50">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 pt-0">
                    <CardDescription className="text-base font-semibold leading-7 text-slate-600 dark:text-warm-300">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 grid gap-4 rounded-xl border border-warm-200 bg-warm-100 p-5 dark:border-slate-700 dark:bg-slate-800 md:grid-cols-3">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-warm-200">
              <RadioTower className="size-5 text-process-received" />
              실시간 수신
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-warm-200">
              <Settings2 className="size-5 text-process-investigating" />
              관제 분석
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-warm-200">
              <Flame className="size-5 text-flare-600" />
              즉각 대응
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
