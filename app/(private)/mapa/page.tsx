"use client";

import dynamic from "next/dynamic";
import { useVehicles } from "@/api/queries/vehicles";
import { Loading } from "@/components/shared/loading";
import { ErrorDisplay } from "@/components/shared/error-display";
import { IconCar, IconKey, IconKeyOff, IconGauge } from "@tabler/icons-react";

const VehicleMap = dynamic(
  () => import("@/components/shared/map/vehicle-map"),
  { ssr: false },
);

export default function MapaPage() {
  const { data, isLoading, error } = useVehicles();
  const vehicles = data?.items ?? [];

  const total = vehicles.length;
  const online = vehicles.filter((v) => v.ignition).length;
  const offline = total - online;
  const speedValues = vehicles
    .map((v) => v.speed)
    .filter((s): s is number => s !== null);
  const avgSpeed =
    speedValues.length > 0
      ? Math.round(speedValues.reduce((a, b) => a + b, 0) / speedValues.length)
      : null;

  const cards = [
    {
      label: "Total de Veículos",
      value: isLoading ? "..." : total,
      icon: IconCar,
      color: "text-foreground",
    },
    {
      label: "Ignição Ligada",
      value: isLoading ? "..." : online,
      icon: IconKey,
      color: "text-online",
    },
    {
      label: "Ignição Desligada",
      value: isLoading ? "..." : offline,
      icon: IconKeyOff,
      color: "text-offline",
    },
    {
      label: "Velocidade Média",
      value: isLoading ? "..." : avgSpeed != null ? `${avgSpeed} km/h` : "—",
      icon: IconGauge,
      color: "text-foreground",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="grid grid-cols-4 gap-4 px-6 py-4 shrink-0">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-lg border border-border bg-card p-4 flex items-center gap-4"
            >
              <div className="rounded-md bg-muted p-2.5">
                <Icon size={20} className={card.color} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {card.label}
                </span>
                <span className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        {error ? (
          <ErrorDisplay />
        ) : (
          <div className="rounded-lg border border-border overflow-hidden h-full">
            <VehicleMap vehicles={vehicles} />
          </div>
        )}
      </div>
    </div>
  );
}
