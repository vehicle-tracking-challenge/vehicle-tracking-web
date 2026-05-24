"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapStore } from "@/stores/map-store";

export const MapInitializer = () => {
  const map = useMap();
  const setMapRef = useMapStore((s) => s.setMapRef);

  useEffect(() => {
    setMapRef(map);
    return () => setMapRef(null);
  }, [map, setMapRef]);

  return null;
};
