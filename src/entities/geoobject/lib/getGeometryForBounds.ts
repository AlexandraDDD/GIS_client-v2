import type { GeometryGeoJSON } from '../model/types';
import type { LatLngTuple } from 'leaflet';

/**
 * Преобразует GeometryGeoJSON в массив координат для использования в L.latLngBounds
 */
export const getGeometryForBounds = (
    geometry: GeometryGeoJSON | null,
): LatLngTuple[] | null => {
    if (!geometry) {
        return null;
    }

    switch (geometry.type) {
        case 'Point':
            // Для точки просто возвращаем массив с одной координатой
            return [geometry.coordinates];
        case 'PolyLine':
        case 'Polygon':
            // Для PolyLine или Polygon возвращаем все координаты
            return (geometry.coordinates as LatLngTuple[][]).flat();
        default:
            // Если тип неизвестен, возвращаем null
            return null;
    }
};
