'use client';

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { scaleLinear } from 'd3-scale';
import { geoMercator } from 'd3-geo';
import { path } from 'd3-path';
import { supabase } from '@/lib/supabase';

const GUERRERO_GEOJSON_URL =
  'https://raw.githubusercontent.com/PhantomInsights/mexico-geojson/main/2023/states/Guerrero.json';

const COLOR_MIN = '#f5e6ea';
const COLOR_MAX = '#691C32';

interface MunicipioStats {
  municipio: string;
  count: number;
}

interface GeoFeature {
  type: 'Feature';
  properties: {
    NOM_MUN: string;
    CVE_MUN: string;
    CVE_ENT: string;
    NOM_ENT: string;
    CVEGEO: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][];
  };
}

// Fetcher para SWR — solo lectura
async function fetchMunicipioStats(): Promise<MunicipioStats[]> {
  const { data, error } = await supabase
    .from('movilizadores')
    .select('municipio')
    .not('municipio', 'is', null);

  if (error) throw error;

  const map = new Map<string, number>();
  data.forEach((row) => {
    const mun = row.municipio as string;
    map.set(mun, (map.get(mun) || 0) + 1);
  });

  return Array.from(map.entries()).map(([municipio, count]) => ({
    municipio,
    count,
  }));
}

export default function HeatmapGuerrero() {
  const { data: stats, error } = useSWR<MunicipioStats[]>(
    'heatmap-guerrero-stats',
    fetchMunicipioStats,
    { refreshInterval: 30000, revalidateOnFocus: false, revalidateOnReconnect: true }
  );

  const [geojson, setGeojson] = useState<any>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; municipio: string; count: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Cargar GeoJSON
  useEffect(() => {
    fetch(GUERRERO_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setGeojson(data))
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, []);

  // Responsive dimensions
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement;
        if (parent) {
          setDimensions({
            width: parent.clientWidth,
            height: Math.min(parent.clientWidth * 0.8, 600),
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [geojson]);

  // Escala de colores lineal: 0 -> guinda claro, max -> guinda institucional
  const maxValue = stats ? Math.max(...stats.map((s) => s.count), 1) : 1;
  const colorScale = scaleLinear<string>()
    .domain([0, maxValue])
    .range([COLOR_MIN, COLOR_MAX]);

  // Proyección centrada en Guerrero
  const projection = geoMercator()
    .center([-99.7, 17.4])
    .scale(dimensions.width / 3)
    .translate([dimensions.width / 2, dimensions.height / 2]);

  // Función auxiliar para renderizar geometría
  const renderGeometry = (geometry: GeoFeature['geometry'], municipio: string) => {
    const geometries = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
    return geometries.map((polygon) => {
      const p = path();
      polygon.forEach((ring, idx) => {
        ring.forEach(([lon, lat], cidx) => {
          const coords = projection([lon, lat]);
          if (coords) {
            if (idx === 0 && cidx === 0) p.moveTo(coords[0], coords[1]);
            else if (idx === 0) p.lineTo(coords[0], coords[1]);
            else if (cidx === 0) p.moveTo(coords[0], coords[1]);
            else p.lineTo(coords[0], coords[1]);
          }
        });
      });
      p.closePath();
      return p.toString();
    });
  };

  // Loading
  if (!geojson) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-[#f5e6ea] rounded-xl">
        <p className="text-[#691C32] font-medium">Cargando mapa de Guerrero...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-[#f5e6ea] rounded-xl">
        <p className="text-red-700 font-medium">Error al cargar datos del heatmap</p>
      </div>
    );
  }

  const features = geojson.features as GeoFeature[];

  return (
    <div className="w-full relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full block"
        style={{ maxHeight: dimensions.height }}
      >
        {features.map((feature) => {
          const munName = feature.properties.NOM_MUN;
          const munStat = stats?.find((s) => s.municipio === munName);
          const count = munStat?.count ?? 0;
          const fillColor = count > 0 ? colorScale(count) : '#f9f9f9';

          return (
            <g key={feature.properties.CVEGEO}>
              {renderGeometry(feature.geometry, munName).map((d, i) => (
                <path
                  key={`${feature.properties.CVEGEO}-${i}`}
                  d={d}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  onMouseEnter={(e) =>
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      municipio: munName,
                      count,
                    })
                  }
                  onMouseMove={(e) =>
                    setTooltip((prev) =>
                      prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                    )
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-white/95 backdrop-blur-sm border border-[#691C32]/30 rounded-lg shadow-xl px-4 py-2 text-sm pointer-events-none"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            transform: 'translateY(-50%)',
          }}
        >
          <p className="font-bold text-[#691C32]">
            Región {tooltip.municipio}
          </p>
          <p className="text-gray-700">
            {tooltip.count} Células Activas
          </p>
        </div>
      )}
    </div>
  );
}
