import type { LatLngTuple } from 'leaflet';

import type { GEO_OBJECT_STATUS } from './constants';

/** Базовые типы идентификаторов и дат */
export type UUID = string;
export type ISODateString = string;

/** Черновик геообъекта для создания/редактирования на клиенте */
export interface DraftGeoObject {
    /** Любое имя */
    name: string;

    description?: string;

    /** Статус объекта */
    status?: (typeof GEO_OBJECT_STATUS)[keyof typeof GEO_OBJECT_STATUS];

    /** Геометрия */
    geometry: Geometry;
}

/** Полный геообъект из API (расширяет черновик служебными полями) */
export interface GeoObject extends DraftGeoObject {
    id: string;

    nameVariants?: string[] | null;
    rank?: number;
    type?: GeoType;

    altGeoSystems?: AltGeoSystem[] | null;

    aspects?: AspectSummary[];
    classifierCodes?: ClassifierCode[];
    previousNames?: PreviousName[] | null;

    /** Прокси-геосистемы, связанные с объектом */
    proxyGeoSystemDtos: ProxyGeoSystemSummary[];
}

/** Геометрия из API ?? */
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

/** Альтернативная геосистема (ссылки/метаданные) */
export interface AltGeoSystem {
    id: UUID;
    name: string;
    description?: string;
    htmlUrl?: string;
    baseEndPointUrl?: string;
}

/** Тип геообъекта (классификация/описание) */
export interface GeoType {
    name: string;
    description?: string;
    geoNamesFeatureCode?: string;
}

/** Краткая сводка аспекта геосистемы */
export interface AspectSummary {
    id: UUID;
    name: string;
    description?: string;
    /** Документация по аспекту */
    htmlDocUrl?: string;
}

/** Краткая информация о прокси-геосистеме */
export interface ProxyGeoSystemSummary {
    id: string;
    name: string;
    description?: string;
    rank?: number;
    type?: GeoType;

    geometry?: Geometry;
    borderWithGeoSystem?: string | null;

    aspects?: string[];
    spatialPredicate?: Number;
    relationships?: string[];
    proxyRank?: number;
    aspectName?: string;
}

/** Код классификатора */
export interface ClassifierCode {
    code: string;
    name: string;
    classifierName?: string;
    classifierUrl?: string;
}

/** Исторические названия объекта с периодами действия */
export interface PreviousName {
    name: string;
    start?: ISODateString;
    end?: ISODateString;
}

/** Упрощённый GeoJSON для клиента (LatLngTuple-координаты) */
export type GeometryGeoJSON =
    | {
          /** Точка */
          type: 'Point';
          coordinates: LatLngTuple;
      }
    | {
          /** Ломаная линия */
          type: 'PolyLine';
          coordinates: LatLngTuple[];
      }
    | {
          /** Полигон с кольцами: [внешний, ...внутренние] */
          type: 'Polygon';
          coordinates: LatLngTuple[][];
      }
    | {
          /** Мультиполигон: массив полигонов с их кольцами */
          type: 'MultiPolygon';
          coordinates: LatLngTuple[][][];
      };

/** Пэйлоад PATCH для обновления геометрии геообъекта */
export interface GeoObjectGeometryPatch {
    id: string;
    geometry: Geometry;
}

/*     | {
          type: 'MultiPolyline';
          coordinates: LatLngTuple[][];
      } */
