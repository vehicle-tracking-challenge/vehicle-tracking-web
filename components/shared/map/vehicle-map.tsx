"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Vehicle } from "@/api/queries/vehicles";
import { MapInitializer } from "./map-initializer";
import { useMapStore } from "@/stores/map-store";

interface VehicleMapProps {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle | null;
}

const BRAZIL_CENTER: [number, number] = [-15.793889, -47.882778];

const VEHICLE_ICONS: Record<Vehicle["vehicle_type"], L.DivIcon> = {
  carro: L.divIcon({
    html: '<div style="font-size:22px;line-height:1;text-align:center;">🚗</div>',
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  }),
  moto: L.divIcon({
    html: '<div style="font-size:22px;line-height:1;text-align:center;">🏍️</div>',
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  }),
  caminhao: L.divIcon({
    html: '<div style="font-size:22px;line-height:1;text-align:center;">🚛</div>',
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  }),
};

const TYPE_LABEL: Record<Vehicle["vehicle_type"], string> = {
  carro: "Carro",
  moto: "Moto",
  caminhao: "Caminhão",
};

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
      minZoom={2}
      style={{ height: "100%", width: "100%" }}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      maxBoundsViscosity={1.0}
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
          icon={VEHICLE_ICONS[vehicle.vehicle_type] ?? VEHICLE_ICONS.carro}
        >
          <Popup className="vehicle-popup">
            <div className="flex flex-col gap-1 text-sm min-w-[180px] p-3">
              <strong className="text-base">{vehicle.name}</strong>
              <span>Placa: {vehicle.plate}</span>
              <span>Tipo: {TYPE_LABEL[vehicle.vehicle_type]}</span>
              {vehicle.driver && <span>Motorista: {vehicle.driver}</span>}
              {vehicle.speed != null && (
                <span>Velocidade: {vehicle.speed} km/h</span>
              )}
              <span>Ignição: {vehicle.ignition ? "Ligada" : "Desligada"}</span>
              <span className="text-xs opacity-60 mt-1 border-t border-current/20 pt-1">
                Atualizado{" "}
                {formatDistanceToNow(new Date(vehicle.last_update), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
