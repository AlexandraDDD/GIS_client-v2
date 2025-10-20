import type { LatLngTuple } from 'leaflet';
import type { GeometryGeoJSON } from '../model/types';

/**
 * Вычисляет географический центр (среднюю точку) по переданным координатам геометрии.
 *
 * Возвращает:
 *  - Кортеж [lat, lng] — центр геометрии.
 */

const isCoordsOfPoint = (
    coords: GeometryGeoJSON['coordinates'],
): coords is LatLngTuple => typeof coords[0] === 'number';

const isLatLngTupleArray = (coords: any): coords is LatLngTuple[] =>
    Array.isArray(coords) && typeof coords[0][0] === 'number';

export const getCenterByCoords = (
    coords: GeometryGeoJSON['coordinates'],
): LatLngTuple => {
    if (isCoordsOfPoint(coords)) {
        return coords;
    }

    if (isLatLngTupleArray(coords)) {
        const [latSum, lngSum] = coords.reduce(
            ([sumLat, sumLng], [lat, lng]) => [sumLat + lat, sumLng + lng],
            [0, 0],
        );

        return [latSum / coords.length, lngSum / coords.length];
    }

    const flattened: LatLngTuple[] = (coords as LatLngTuple[][]).flat();
    const [latSum, lngSum] = flattened.reduce(
        ([sumLat, sumLng], [lat, lng]) => [sumLat + lat, sumLng + lng],
        [0, 0],
    );

    return [latSum / flattened.length, lngSum / flattened.length];
};
