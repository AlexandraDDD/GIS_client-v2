import { LatLngTuple } from 'leaflet';
import type {
    GeoObject,
    GeometryGeoJSON,
    ProxyGeoSystemSummary,
} from '../model/types';

/** Преобразует geometry.border в GeoJSON, определяя тип (Point, Polygon, MultiPolygon)
 * и замыкая кольца.
 */
export const getGeometry = ({
    geometry,
}: GeoObject | ProxyGeoSystemSummary): GeometryGeoJSON | null => {
    if (!geometry || !geometry.border) return null;

    let coords: unknown;
    try {
        coords = JSON.parse(geometry.border);
    } catch {
        return null;
    }

    if (!coords || !Array.isArray(coords)) return null;

    const isLatLng = (val: any): val is LatLngTuple =>
        Array.isArray(val) &&
        val.length === 2 &&
        typeof val[0] === 'number' &&
        typeof val[1] === 'number';

    // Если координаты — одиночная точка
    if (isLatLng(coords)) {
        return {
            type: 'Point',
            coordinates: coords,
        };
    }

    // Если координаты — массив точек LatLngTuple[]
    if (coords.every(isLatLng)) {
        const first = coords[0];
        const last = coords[coords.length - 1];

        // Если последняя точка не совпадает с первой — добавляем её для замыкания полигона
        const isClosed = first[0] === last[0] && first[1] === last[1];
        const polygonCoords = isClosed ? coords : [...coords, first];

        return {
            type: 'Polygon',
            coordinates: [polygonCoords],
        };
    }

    // Если координаты — массив колец (LatLngTuple[][])
    if (coords.every((ring) => Array.isArray(ring) && ring.every(isLatLng))) {
        // Для каждого кольца проверяем замыкание
        const polygonCoords = (coords as LatLngTuple[][]).map((ring) => {
            const first = ring[0];
            const last = ring[ring.length - 1];
            return first[0] === last[0] && first[1] === last[1]
                ? ring
                : [...ring, first];
        });

        return {
            type: 'Polygon',
            coordinates: polygonCoords,
        };
    }

    // Если координаты — MultiPolygon (LatLngTuple[][][])
    if (
        coords.every(
            (polygon) =>
                Array.isArray(polygon) &&
                polygon.every(
                    (ring) => Array.isArray(ring) && ring.every(isLatLng),
                ),
        )
    ) {
        //  замыкаем все кольца всех полигонов
        const multiPolygonCoords = (coords as LatLngTuple[][][]).map(
            (polygon) =>
                polygon.map((ring) => {
                    const first = ring[0];
                    const last = ring[ring.length - 1];
                    return first[0] === last[0] && first[1] === last[1]
                        ? ring
                        : [...ring, first];
                }),
        );

        return {
            type: 'MultiPolygon',
            coordinates: multiPolygonCoords,
        };
    }

    return null;
};
