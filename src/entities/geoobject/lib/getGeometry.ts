import { LatLngTuple } from 'leaflet';
import type {
    GeoObject,
    GeometryGeoJSON,
    ProxyGeoSystemSummary,
} from '../model/types';

/* export const getGeometry = ({ geometry }: GeoObject) =>
    geometry?.borderGeocodes && geometry.borderGeocodes !== 'string'
        ? (JSON.parse(geometry.borderGeocodes) as GeometryGeoJSON)
        : null; */

//временный парсинг геометрии для отрисовки

export const getGeometry = ({
    geometry,
}: GeoObject | ProxyGeoSystemSummary): GeometryGeoJSON | null => {
    if (!geometry) return null;

    let coords;
    try {
        coords = JSON.parse(geometry.border);
    } catch {
        return null;
    }

    if (!coords || !Array.isArray(coords)) {
        return null;
    }

    // Проверяем, что каждый элемент - массив с двумя числами (lat, lng)
    if (
        !coords.every(
            (coord) =>
                Array.isArray(coord) &&
                coord.length === 2 &&
                typeof coord[0] === 'number' &&
                typeof coord[1] === 'number',
        )
    ) {
        return null;
    }

    // Если точек меньше 2 — считаем точкой
    if (coords.length === 1) {
        return {
            type: 'Point',
            coordinates: coords[0] as LatLngTuple,
        };
    }

    // Если точек 4 и больше — считаем полигоном
    // (Обычно для полигона минимум 4 точки — последняя равна первой, чтобы замкнуть)
    if (coords.length >= 4) {
        return {
            type: 'Polygon',
            coordinates: coords as LatLngTuple[],
        };
    }

    // Иначе — просто PolyLine
    return {
        type: 'PolyLine',
        coordinates: coords as LatLngTuple[],
    };
};
