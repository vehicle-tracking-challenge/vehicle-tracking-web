import useSWR from "swr";
import { fetcher } from "@/api";

export interface Vehicle {
  id: string;
  plate: string;
  name: string;
  vehicle_type: "carro" | "moto" | "caminhao";
  model: string | null;
  color: string | null;
  year: number | null;
  driver: string | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  ignition: boolean;
  last_update: string;
  created_at: string;
  updated_at: string;
}

export interface VehiclePage {
  items: Vehicle[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface VehicleQueryFilters {
  name?: string;
  plate?: string;
  vehicle_type?: string;
  driver?: string;
  model?: string;
  color?: string;
  year?: string;
}

export const useVehicles = (
  page = 1,
  size = 50,
  filters?: VehicleQueryFilters,
) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  if (filters?.name) params.append("name", filters.name);
  if (filters?.plate) params.append("plate", filters.plate);
  if (filters?.vehicle_type)
    params.append("vehicle_type", filters.vehicle_type);
  if (filters?.driver) params.append("driver", filters.driver);
  if (filters?.model) params.append("model", filters.model);
  if (filters?.color) params.append("color", filters.color);
  if (filters?.year) params.append("year", filters.year);

  return useSWR<VehiclePage>(`/vehicles?${params.toString()}`, fetcher, {
    refreshInterval: 5000,
  });
};

export const useVehicleById = (id?: string) => {
  return useSWR<Vehicle>(id ? `/vehicles/${id}` : null, fetcher);
};
