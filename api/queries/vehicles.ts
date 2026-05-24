import useSWR from "swr";
import { fetcher } from "@/api";

export interface Vehicle {
  id: string;
  plate: string;
  name: string;
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

export const useVehicles = (page = 1, size = 50) => {
  return useSWR<VehiclePage>(`/veiculos?page=${page}&size=${size}`, fetcher, {
    refreshInterval: 30000,
  });
};

export const useVehicleById = (id?: string) => {
  return useSWR<Vehicle>(id ? `/veiculos/${id}` : null, fetcher);
};
