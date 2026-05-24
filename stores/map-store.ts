import { create } from "zustand";
import { Map } from "leaflet";

interface MapStore {
  mapRef: Map | null;
  setMapRef: (map: Map | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  mapRef: null,
  setMapRef: (map) => set({ mapRef: map }),
}));
