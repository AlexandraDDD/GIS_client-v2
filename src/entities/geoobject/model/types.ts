import type { LatLngTuple } from 'leaflet';

import type { GEO_OBJECT_STATUS } from './constants';

/**
 * Lean client‑side TypeScript representations of GeoSystem API response.
 * Redundant server‑only fields stripped; nested objects flattened into
 * reusable interfaces that reflect only the data the front‑end usually needs.
 */

export type UUID = string;
export type ISODateString = string;

/* ──────────────────── Core entities ──────────────────── */

export interface DraftGeoObject {
    /** Любое имя */
    name: string;

    description?: string;

    /** Статус обьекта  */
    status?: (typeof GEO_OBJECT_STATUS)[keyof typeof GEO_OBJECT_STATUS];

    geometry: Geometry; //обратить внимание когда будет сервер
}

export interface GeoObject extends DraftGeoObject {
    id: string;

    nameVariants?: string[] | null;

    rank?: number;

    type?: GeoType;

    altGeoSystems?: AltGeoSystem[] | null;

    aspects?: AspectSummary[];

    classifierCodes?: ClassifierCode[];
    previousNames?: PreviousName[] | null;
    proxyGeoSystemDtos: ProxyGeoSystemSummary[];
}

/* ──────────────────── Sub‑entities ──────────────────── */

//ДОБАВИТЬ GEOJSON ПОСЛЕ ИСПРАВЛЕНИЯ СЕРВЕРА
export interface Geometry {
    coordinateReferenceSystem?: string;
    border: string;

    boundingBox?: string;
    center?: string;
    defaultContentInGeoJSO?: string;
    geoJsonStyle?: string;
    gooJsonStyleType?: string;
    altGeoContents?: string[];
}
// очень сильно в будущем
export interface AltGeoSystem {
    id: UUID;
    name: string;
    description?: string;
    htmlUrl?: string;
    baseEndPointUrl?: string;
}

export interface GeoType {
    name: string;
    description?: string;
    geoNamesFeatureCode?: string;
}

export interface AspectSummary {
    id: UUID;
    name: string;
    description?: string;
    /** Optional documentation URL */
    htmlDocUrl?: string;
}

export interface ProxyGeoSystemSummary {
    id: string;
    name: string;
    description?: string;
    rank?: number;
    type?: GeoType;

    geometry?: Geometry; //обратить внимание когда будет сервер
    borderWithGeoSystem?: string | null; //ТУТ ТОЖЕ GEOJSON??

    aspects?: string[];
    spatialPredicate?: Number;
    relationships?: string[];
    proxyRank?: number;
    aspectName?: string;
}

export interface ClassifierCode {
    code: string;
    name: string;
    classifierName?: string;
    classifierUrl?: string;
}

export interface PreviousName {
    name: string;
    start?: ISODateString;
    end?: ISODateString;
}

export type GeometryGeoJSON =
    | {
          type: 'Point';
          coordinates: LatLngTuple;
      }
    | {
          type: 'PolyLine';
          coordinates: LatLngTuple[];
      }
    | {
          type: 'Polygon';
          coordinates: LatLngTuple[][];
          // [ [внешний контур], [внутренний контур 1], [внутренний контур 2], ... ]
      }
    | {
          type: 'MultiPolygon';
          coordinates: LatLngTuple[][][];
          // [ [ [внешний + внутренние] ], [ [внешний + внутренние] ], ... ]
      };

export interface GeoObjectGeometryPatch {
    id: string;
    geometry: Geometry;
}
/*     | {
          type: 'MultiPolyline';
          coordinates: LatLngTuple[][];
      } */
