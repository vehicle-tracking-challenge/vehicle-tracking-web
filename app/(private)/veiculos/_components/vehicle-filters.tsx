"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";

export const VehicleFilterSchema = z.object({
  name: z.string().optional(),
  plate: z.string().optional(),
  vehicle_type: z.string().optional(),
  driver: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  year: z.string().optional(),
});

export type VehicleFilterSchemaType = z.infer<typeof VehicleFilterSchema>;

const FILTER_DEFAULT_VALUES: VehicleFilterSchemaType = {
  name: "",
  plate: "",
  vehicle_type: "all",
  driver: "",
  model: "",
  color: "",
  year: "",
};

export const getVehicleFilterLabel = (key: string): string | undefined => {
  const labels: Record<string, string> = {
    name: "Nome",
    plate: "Placa",
    vehicle_type: "Tipo",
    driver: "Motorista",
    model: "Modelo",
    color: "Cor",
    year: "Ano",
  };
  return labels[key];
};

export const getVehicleValueLabel = (key: string, value: string): string => {
  if (key === "vehicle_type") {
    const map: Record<string, string> = {
      carro: "Carro",
      moto: "Moto",
      caminhao: "Caminhão",
    };
    return map[value] ?? value;
  }
  return value;
};

export interface VehicleFiltersRef {
  clearField: (key: string) => void;
  resetAll: () => void;
}

interface VehicleFiltersProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onApply: (filters: VehicleFilterSchemaType | null) => void;
  activeCount?: number;
}

const VehicleFilters = forwardRef<VehicleFiltersRef, VehicleFiltersProps>(
  ({ open, setOpen, onApply, activeCount = 0 }, ref) => {
    const form = useForm<VehicleFilterSchemaType>({
      resolver: zodResolver(VehicleFilterSchema),
      defaultValues: FILTER_DEFAULT_VALUES,
    });

    useImperativeHandle(ref, () => ({
      clearField: (key: string) => {
        form.resetField(key as keyof VehicleFilterSchemaType, {
          defaultValue:
            key === "vehicle_type"
              ? "all"
              : FILTER_DEFAULT_VALUES[key as keyof VehicleFilterSchemaType],
        });
      },
      resetAll: () => form.reset(FILTER_DEFAULT_VALUES),
    }));

    const onSubmit = (values: VehicleFilterSchemaType) => {
      onApply(values);
      setOpen(false);
    };

    const fieldRow = (
      label: string,
      fieldName: keyof VehicleFilterSchemaType,
      placeholder: string,
    ) => (
      <div className="flex flex-col gap-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground font-normal">
            {label}
          </Label>
          <button
            type="button"
            onClick={() => form.resetField(fieldName)}
            className="text-xs text-primary hover:underline"
          >
            Limpar
          </button>
        </div>
        <Input
          {...form.register(fieldName)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        />
      </div>
    );

    return (
      <Popover open={open} onOpenChange={(o) => setOpen(o)}>
        <PopoverTrigger className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
          <IconAdjustmentsHorizontal size={16} />
          Filtros
          {activeCount > 0 && (
            <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeCount}
            </Badge>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-96 p-0">
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-base font-semibold">Adicionar Filtros</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted transition-colors"
              >
                <IconX size={16} />
              </button>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4 p-4 max-h-[420px] overflow-y-auto">
                {fieldRow("Nome", "name", "Buscar por nome")}
                {fieldRow("Placa", "plate", "Ex: ABC1D23")}

                <div className="flex flex-col gap-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground font-normal">
                      Tipo
                    </Label>
                    <button
                      type="button"
                      onClick={() =>
                        form.setValue("vehicle_type", "all", {
                          shouldValidate: true,
                        })
                      }
                      className="text-xs text-primary hover:underline"
                    >
                      Limpar
                    </button>
                  </div>
                  <Controller
                    name="vehicle_type"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "all"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os tipos</SelectItem>
                          <SelectItem value="carro">🚗 Carro</SelectItem>
                          <SelectItem value="moto">🏍️ Moto</SelectItem>
                          <SelectItem value="caminhao">🚛 Caminhão</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {fieldRow("Motorista", "driver", "Nome do motorista")}
                {fieldRow("Modelo", "model", "Ex: Volvo FH")}
                {fieldRow("Cor", "color", "Ex: Branco")}
                {fieldRow("Ano", "year", "Ex: 2022")}
              </div>

              <div className="flex items-center justify-end gap-x-2 px-4 py-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    form.reset(FILTER_DEFAULT_VALUES);
                    onApply(null);
                  }}
                  className="inline-flex h-9 items-center px-3 rounded-md border border-border text-sm hover:bg-muted transition-colors"
                >
                  Limpar Filtros
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center px-3 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

VehicleFilters.displayName = "VehicleFilters";

export default VehicleFilters;
