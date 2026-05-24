"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import { Vehicle } from "@/api/queries/vehicles";
import { MapInitializer } from "./map-initializer";
import { useMapStore } from "@/stores/map-store";

interface VehicleMapProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
}

const BRAZIL_CENTER: [number, number] = [-15.793889, -47.882778];

export default function VehicleMap({
  vehicles,
  selectedVehicle,
}: VehicleMapProps) {
  const mapRef = useMapStore((s) => s.mapRef);

  useEffect(() => {
    if (selectedVehicle && mapRef) {
      mapRef.flyTo([selectedVehicle.latitude, selectedVehicle.longitude], 14, {
        duration: 1.2,
      });
    }
  }, [selectedVehicle, mapRef]);

  return (
    <MapContainer
      center={BRAZIL_CENTER}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapInitializer />
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={[vehicle.latitude, vehicle.longitude]}
        >
          <Popup>
            <div className="flex flex-col gap-1 text-sm">
              <strong>{vehicle.name}</strong>
              <span>Placa: {vehicle.plate}</span>
              {vehicle.speed != null && (
                <span>Velocidade: {vehicle.speed} km/h</span>
              )}
              <span>Ignição: {vehicle.ignition ? "Ligada" : "Desligada"}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
