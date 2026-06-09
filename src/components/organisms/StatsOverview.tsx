import { Activity, MapPinned, RadioTower } from "lucide-react";

import { StatCard } from "@/components/molecules";

const stats = [
  {
    label: "Active routes",
    value: "12",
    description: "monitored this hour",
    trend: "+3",
    icon: MapPinned,
  },
  {
    label: "Live signals",
    value: "248",
    description: "healthy telemetry points",
    trend: "98%",
    icon: RadioTower,
  },
  {
    label: "Incidents",
    value: "4",
    description: "need review",
    trend: "-2",
    icon: Activity,
  },
];

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
