import { z } from "zod";
import { isValidPlate } from "@/lib/validation";

export const vehicleSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  plate: z
    .string()
    .min(7, "Placa inválida")
    .max(8, "Placa inválida")
    .refine(
      (v) => isValidPlate(v),
      "Formato inválido — use Mercosul (ABC1D23) ou padrão antigo (ABC-1234)",
    )
    .transform((v) => v.toUpperCase()),
  vehicle_type: z.enum(["carro", "moto", "caminhao"]),
  model: z.string().max(100).optional().or(z.literal("")),
  color: z.string().max(50).optional().or(z.literal("")),
  year: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v || (!isNaN(Number(v)) && Number(v) >= 1900 && Number(v) <= 2100),
      "Ano inválido (1900–2100)",
    ),
  driver: z.string().max(255).optional().or(z.literal("")),
});

export type VehicleSchemaType = z.infer<typeof vehicleSchema>;

export const vehicleDefaultValues: VehicleSchemaType = {
  name: "",
  plate: "",
  vehicle_type: "carro",
  model: "",
  color: "",
  year: "",
  driver: "",
};
