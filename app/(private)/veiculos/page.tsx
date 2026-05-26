"use client";

import { useRef, useState } from "react";
import {
  useVehicles,
  Vehicle,
  VehicleQueryFilters,
} from "@/api/queries/vehicles";
import { DataTable } from "@/components/shared/data-table";
import { Loading } from "@/components/shared/loading";
import { ErrorDisplay } from "@/components/shared/error-display";
import { NoData } from "@/components/shared/no-data";
import { vehicleColumns } from "./_components/vehicle-columns";
import { AddEditVehicleDialog } from "./_components/add-edit-vehicle-dialog";
import { DeleteVehicleDialog } from "./_components/delete-vehicle-dialog";
import VehicleFilters, {
  VehicleFilterSchemaType,
  VehicleFiltersRef,
  getVehicleFilterLabel,
  getVehicleValueLabel,
} from "./_components/vehicle-filters";
import { IconPlus, IconX } from "@tabler/icons-react";

export default function VeiculosPage() {
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<VehicleFilterSchemaType | null>(null);
  const filterRef = useRef<VehicleFiltersRef>(null);

  const activeFilters: VehicleQueryFilters = (() => {
    if (!appliedFilters) return {};
    return {
      name: appliedFilters.name || undefined,
      plate: appliedFilters.plate || undefined,
      vehicle_type:
        appliedFilters.vehicle_type && appliedFilters.vehicle_type !== "all"
          ? appliedFilters.vehicle_type
          : undefined,
      driver: appliedFilters.driver || undefined,
      model: appliedFilters.model || undefined,
      color: appliedFilters.color || undefined,
      year: appliedFilters.year || undefined,
    };
  })();

  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  const { data, isLoading, error, mutate } = useVehicles(1, 50, activeFilters);

  const columns = vehicleColumns({
    onEdit: (v) => {
      setVehicleToEdit(v);
      setOpenAddEdit(true);
    },
    onDelete: (v) => setVehicleToDelete(v),
  });

  const vehicles = data?.items ?? [];

  const activeChips = Object.entries(appliedFilters ?? {}).filter(
    ([k, v]) => v && v !== "" && !(k === "vehicle_type" && v === "all"),
  );

  return (
    <div className="flex flex-1 flex-col bg-background h-full overflow-auto">
      <div className="flex flex-col px-6 pt-8 pb-6 gap-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Veículos</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gerencie a frota, atualize posições e monitore o status de
              ignição.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <VehicleFilters
              ref={filterRef}
              open={filterOpen}
              setOpen={setFilterOpen}
              onApply={(filters) => setAppliedFilters(filters)}
              activeCount={activeCount}
            />
            <button
              onClick={() => {
                setVehicleToEdit(null);
                setOpenAddEdit(true);
              }}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <IconPlus size={16} />
              Adicionar Veículo
            </button>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 h-6 pl-2.5 pr-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                {getVehicleFilterLabel(key)}:{" "}
                {getVehicleValueLabel(key, value as string)}
                <button
                  type="button"
                  onClick={() => {
                    filterRef.current?.clearField(key);
                    const updated = {
                      ...appliedFilters,
                      [key]: key === "vehicle_type" ? "all" : "",
                    } as VehicleFilterSchemaType;
                    setAppliedFilters(updated);
                  }}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                >
                  <IconX size={10} />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => {
                filterRef.current?.resetAll();
                setAppliedFilters(null);
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Limpar todos
            </button>
          </div>
        )}

        {isLoading ? (
          <Loading />
        ) : error ? (
          <ErrorDisplay />
        ) : vehicles.length === 0 ? (
          <NoData
            title="Nenhum veículo encontrado"
            description={
              activeCount > 0
                ? "Nenhum veículo corresponde aos filtros aplicados."
                : "Clique em 'Adicionar Veículo' para começar."
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={vehicles}
            searchColumn="name"
            searchPlaceholder="Buscar por nome..."
          />
        )}
      </div>

      <AddEditVehicleDialog
        open={openAddEdit}
        onOpenChange={(open) => {
          setOpenAddEdit(open);
          if (!open) setVehicleToEdit(null);
        }}
        vehicle={vehicleToEdit}
        onSuccess={() => {
          mutate();
          setOpenAddEdit(false);
        }}
      />

      <DeleteVehicleDialog
        vehicle={vehicleToDelete}
        onOpenChange={(open) => {
          if (!open) setVehicleToDelete(null);
        }}
        onSuccess={() => {
          mutate();
          setVehicleToDelete(null);
        }}
      />
    </div>
  );
}
