"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Vehicle } from "@/api/queries/vehicles";
import { apiClient } from "@/api";
import {
  vehicleSchema,
  VehicleSchemaType,
  vehicleDefaultValues,
} from "./add-edit-vehicle-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddEditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSuccess: () => void;
}

export const AddEditVehicleDialog = ({
  open,
  onOpenChange,
  vehicle,
  onSuccess,
}: AddEditVehicleDialogProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<VehicleSchemaType>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicleDefaultValues,
  });

  useEffect(() => {
    if (vehicle) {
      form.reset({
        name: vehicle.name,
        plate: vehicle.plate,
        latitude: String(vehicle.latitude),
        longitude: String(vehicle.longitude),
        speed: vehicle.speed != null ? String(vehicle.speed) : "",
        ignition: vehicle.ignition,
      });
    } else {
      form.reset(vehicleDefaultValues);
    }
  }, [vehicle, form]);

  const onSubmit = async (data: VehicleSchemaType) => {
    try {
      setLoading(true);
      const payload = {
        name: data.name,
        plate: data.plate,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        speed: data.speed ? Number(data.speed) : null,
        ignition: data.ignition,
      };
      if (vehicle) {
        await apiClient.put(`/veiculos/${vehicle.id}`, payload);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        await apiClient.post("/veiculos", payload);
        toast.success("Veículo criado com sucesso!");
      }
      onSuccess();
    } catch (error) {
      const msg = (error as { friendlyMessage?: string }).friendlyMessage;
      toast.error(msg || "Erro ao salvar veículo.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(vehicleDefaultValues);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? "Editar Veículo" : "Novo Veículo"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Ex: Caminhão 01"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="plate">Placa</Label>
            <Input
              id="plate"
              placeholder="Ex: ABC1234"
              {...form.register("plate")}
            />
            {form.formState.errors.plate && (
              <p className="text-xs text-destructive">
                {form.formState.errors.plate.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                placeholder="-23.5505"
                {...form.register("latitude")}
              />
              {form.formState.errors.latitude && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.latitude.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                placeholder="-46.6333"
                {...form.register("longitude")}
              />
              {form.formState.errors.longitude && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.longitude.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="speed">Velocidade (km/h)</Label>
            <Input
              id="speed"
              placeholder="Ex: 80"
              {...form.register("speed")}
            />
            {form.formState.errors.speed && (
              <p className="text-xs text-destructive">
                {form.formState.errors.speed.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ignition"
              className="size-4 rounded border-input"
              {...form.register("ignition")}
            />
            <Label htmlFor="ignition">Ignição ligada</Label>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : vehicle ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
