import { LatLngTuple } from 'leaflet';

/**
 * Проверяет, находится ли фигура (точка, линия или полигон) внутри полигона.
 * @param coordinates - Координаты проверяемой фигуры (точка или массив точек).
 * @param polygon - Координаты полигона.
 * @returns true, если объект находится внутри или пересекает полигон.
 */
export function isInsidePolygon(
    coordinates: LatLngTuple | LatLngTuple[], // Точка или массив точек
    polygon: LatLngTuple[],
): boolean {
    // Если входящий объект - точка
    if (!Array.isArray(coordinates[0])) {
        return pointInsidePolygon(coordinates as LatLngTuple, polygon);
    }

    // Если объект - массив точек
    const points = coordinates as LatLngTuple[];
    return points.some((point) => pointInsidePolygon(point, polygon));
}

/**
 * Проверяет, находится ли отдельная точка внутри полигона.
 * Использует алгоритм пересечения луча.
 * @param point - Координаты точки.
 * @param polygon - Координаты полигона.
 * @returns true, если точка внутри полигона.
 */
export function pointInsidePolygon(point: LatLngTuple, polygon: LatLngTuple[]): boolean {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }

    return inside;
}
