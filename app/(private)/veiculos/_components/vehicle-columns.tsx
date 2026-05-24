"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vehicle } from "@/api/queries/vehicles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VehicleColumnsProps {
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onSelect: (vehicle: Vehicle) => void;
}

export const vehicleColumns = ({
  onEdit,
  onDelete,
  onSelect,
}: VehicleColumnsProps): ColumnDef<Vehicle, unknown>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <button
        className="font-medium text-left hover:text-primary transition-colors"
        onClick={() => onSelect(row.original)}
      >
        {row.original.name}
      </button>
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
    accessorKey: "speed",
    header: "Velocidade",
    cell: ({ row }) => (
      <span>
        {row.original.speed != null ? `${row.original.speed} km/h` : "—"}
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
