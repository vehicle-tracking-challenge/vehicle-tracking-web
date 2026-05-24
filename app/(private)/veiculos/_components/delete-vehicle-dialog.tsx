"use client";

import { toast } from "sonner";
import { Vehicle } from "@/api/queries/vehicles";
import { apiClient } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DeleteVehicleDialogProps {
  vehicle: Vehicle | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DeleteVehicleDialog = ({
  vehicle,
  onOpenChange,
  onSuccess,
}: DeleteVehicleDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!vehicle) return;
    try {
      setLoading(true);
      await apiClient.delete(`/veiculos/${vehicle.id}`);
      toast.success("Veículo removido com sucesso!");
      onSuccess();
    } catch (error) {
      const msg = (error as { friendlyMessage?: string }).friendlyMessage;
      toast.error(msg || "Erro ao remover veículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!vehicle} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Veículo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover o veículo{" "}
            <strong>{vehicle?.name}</strong> (placa {vehicle?.plate})? Esta ação
            não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
