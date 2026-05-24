import { z } from "zod";

export const vehicleSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  plate: z
    .string()
    .min(7, "Placa inválida")
    .max(8, "Placa inválida")
    .transform((v) => v.toUpperCase()),
  latitude: z
    .string()
    .refine((v) => !isNaN(Number(v)), "Latitude inválida")
    .refine(
      (v) => Number(v) >= -90 && Number(v) <= 90,
      "Latitude deve ser entre -90 e 90",
    ),
  longitude: z
    .string()
    .refine((v) => !isNaN(Number(v)), "Longitude inválida")
    .refine(
      (v) => Number(v) >= -180 && Number(v) <= 180,
      "Longitude deve ser entre -180 e 180",
    ),
  speed: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(Number(v)), "Velocidade inválida")
    .refine((v) => !v || Number(v) >= 0, "Velocidade não pode ser negativa"),
  ignition: z.boolean(),
});

export type VehicleSchemaType = z.infer<typeof vehicleSchema>;

export const vehicleDefaultValues: VehicleSchemaType = {
  name: "",
  plate: "",
  latitude: "",
  longitude: "",
  speed: "",
  ignition: false,
};
