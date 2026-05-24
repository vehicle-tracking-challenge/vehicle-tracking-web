"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Vehicle } from "@/api/queries/vehicles";
import { formatPlateInput } from "@/lib/validation";
import { apiClient } from "@/api";
import {
  vehicleSchema,
  VehicleSchemaType,
  vehicleDefaultValues,
} from "./add-edit-vehicle-schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        vehicle_type: vehicle.vehicle_type,
        model: vehicle.model ?? "",
        color: vehicle.color ?? "",
        year: vehicle.year != null ? String(vehicle.year) : "",
        driver: vehicle.driver ?? "",
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
        vehicle_type: data.vehicle_type,
        model: data.model || null,
        color: data.color || null,
        year: data.year ? Number(data.year) : null,
        driver: data.driver || null,
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
    if (!open) form.reset(vehicleDefaultValues);
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? "Editar Veículo" : "Novo Veículo"}
          </DialogTitle>
          <DialogDescription>
            {vehicle
              ? "Atualize as informações cadastrais do veículo."
              : "Preencha os dados para cadastrar um novo veículo na frota."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome *</Label>
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
              <Label htmlFor="plate">Placa *</Label>
              <Controller
                name="plate"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="plate"
                    placeholder="Ex: ABC1D23"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(formatPlateInput(e.target.value))
                    }
                  />
                )}
              />
              {form.formState.errors.plate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.plate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Tipo *</Label>
              <Controller
                name="vehicle_type"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carro">🚗 Carro</SelectItem>
                      <SelectItem value="moto">🏍️ Moto</SelectItem>
                      <SelectItem value="caminhao">🚛 Caminhão</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                placeholder="Ex: Volvo FH 460"
                {...form.register("model")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                placeholder="Ex: Branco"
                {...form.register("color")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                placeholder="Ex: 2022"
                {...form.register("year")}
              />
              {form.formState.errors.year && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.year.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="driver">Motorista</Label>
            <Input
              id="driver"
              placeholder="Ex: João Silva"
              {...form.register("driver")}
            />
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
