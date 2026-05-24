"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vehicle } from "@/api/queries/vehicles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconEdit,
  IconTrash,
  IconCar,
  IconMotorbike,
  IconTruck,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VehicleColumnsProps {
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

const VehicleTypeIcon = ({ type }: { type: Vehicle["vehicle_type"] }) => {
  if (type === "moto")
    return <IconMotorbike className="size-4 shrink-0 text-muted-foreground" />;
  if (type === "caminhao")
    return <IconTruck className="size-4 shrink-0 text-muted-foreground" />;
  return <IconCar className="size-4 shrink-0 text-muted-foreground" />;
};

export const vehicleColumns = ({
  onEdit,
  onDelete,
}: VehicleColumnsProps): ColumnDef<Vehicle, unknown>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <span className="flex items-center gap-2 font-medium">
        <VehicleTypeIcon type={row.original.vehicle_type} />
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "plate",
    header: "Placa",
    cell: ({ row }) => (
      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
        {row.original.plate}
      </span>
    ),
  },
  {
    accessorKey: "driver",
    header: "Motorista",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.driver ?? (
          <span className="text-muted-foreground">—</span>
        )}
      </span>
    ),
  },
  {
    accessorKey: "ignition",
    header: "Ignição",
    cell: ({ row }) => (
      <Badge variant={row.original.ignition ? "online" : "offline"}>
        {row.original.ignition ? "Ligada" : "Desligada"}
      </Badge>
    ),
  },
  {
    accessorKey: "last_update",
    header: "Última Atualização",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {formatDistanceToNow(new Date(row.original.last_update), {
          addSuffix: true,
          locale: ptBR,
        })}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(row.original)}
        >
          <IconEdit className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(row.original)}
        >
          <IconTrash className="size-4 text-destructive" />
        </Button>
      </div>
    ),
  },
];
