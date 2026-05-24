"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useVehicles, Vehicle } from "@/api/queries/vehicles";
import { DataTable } from "@/components/shared/data-table";
import { Loading } from "@/components/shared/loading";
import { ErrorDisplay } from "@/components/shared/error-display";
import { NoData } from "@/components/shared/no-data";
import { vehicleColumns } from "./_components/vehicle-columns";
import { AddEditVehicleDialog } from "./_components/add-edit-vehicle-dialog";
import { DeleteVehicleDialog } from "./_components/delete-vehicle-dialog";

const VehicleMap = dynamic(
  () => import("@/components/shared/map/vehicle-map"),
  { ssr: false },
);

export default function VeiculosPage() {
  const { data, isLoading, error, mutate } = useVehicles();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  const columns = vehicleColumns({
    onEdit: (vehicle) => {
      setVehicleToEdit(vehicle);
      setOpenAddEdit(true);
    },
    onDelete: (vehicle) => setVehicleToDelete(vehicle),
    onSelect: setSelectedVehicle,
  });

  const handleAddClick = () => {
    setVehicleToEdit(null);
    setOpenAddEdit(true);
  };

  const vehicles = data?.items ?? [];

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="w-2/5 flex flex-col gap-4 p-6 overflow-auto border-r border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Veículos</h1>
        </div>

        {isLoading ? (
          <Loading />
        ) : error ? (
          <ErrorDisplay />
        ) : vehicles.length === 0 ? (
          <NoData />
        ) : (
          <DataTable
            columns={columns}
            data={vehicles}
            addHandler={handleAddClick}
            addLabel="Novo Veículo"
          />
        )}

        {vehicles.length > 0 && !isLoading && !error && (
          <div className="flex justify-end">
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              + Novo Veículo
            </button>
          </div>
        )}
      </div>

      <div className="w-3/5 h-full">
        <VehicleMap vehicles={vehicles} selectedVehicle={selectedVehicle} />
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
