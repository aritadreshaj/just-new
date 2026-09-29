"use client";

import { useMemo } from "react";
import landGeoJson from "@/data/world-land.geojson";

type MapLocation = {
  name: string;
  lat: number;
  lng: number;
};

type ContactWorldMapProps = {
  locations: MapLocation[];
};

type Position = [number, number];
type PolygonCoordinates = Position[][];
type MultiPolygonCoordinates = Position[][][];

type LandFeature = {
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: PolygonCoordinates | MultiPolygonCoordinates;
  };
};

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const project = (lat: number, lng: number) => {
  const x = ((clamp(lng, -180, 180) + 180) / 360) * MAP_WIDTH;
  const y = ((90 - clamp(lat, -90, 90)) / 180) * MAP_HEIGHT;
  return { x, y };
};

const ringToPath = (ring: Position[]) => {
  if (ring.length === 0) return "";
  return `${ring
    .map(([lng, lat], index) => {
      const { x, y } = project(lat, lng);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ")} Z`;
};

export default function ContactWorldMap({ locations }: ContactWorldMapProps) {
  const paths = useMemo(() => {
    const features = (landGeoJson as { features: LandFeature[] }).features ?? [];
    const projectedPaths: string[] = [];

    features.forEach((feature) => {
      if (feature.geometry.type === "Polygon") {
        (feature.geometry.coordinates as PolygonCoordinates).forEach((ring) => {
          const path = ringToPath(ring);
          if (path) projectedPaths.push(path);
        });
        return;
      }

      (feature.geometry.coordinates as MultiPolygonCoordinates).forEach((polygon) => {
        polygon.forEach((ring) => {
          const path = ringToPath(ring);
          if (path) projectedPaths.push(path);
        });
      });
    });

    return projectedPaths;
  }, []);

  return (
    <div className="w-full mt-20">
      <div className="relative w-full aspect-[2/1] border border-neutral-300 bg-white overflow-hidden">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#ffffff" />
          <g fill="#c4c4c4">
            {paths.map((path, index) => (
              <path key={`land-${index}`} d={path} />
            ))}
          </g>
        </svg>

        {locations.map((location) => {
          const { x, y } = project(location.lat, location.lng);
          return (
            <button
              key={`${location.name}-${location.lat}-${location.lng}`}
              type="button"
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(x / MAP_WIDTH) * 100}%`,
                top: `${(y / MAP_HEIGHT) * 100}%`,
              }}
              aria-label={location.name}
            >
              <span className="block h-2.5 w-2.5 rounded-full bg-black" />
              <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 text-xs text-black shadow group-hover:block">
                {location.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
