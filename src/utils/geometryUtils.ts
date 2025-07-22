import { point, polygon, booleanPointInPolygon } from '@turf/turf';
import L, { LatLng, LatLngTuple, Map } from 'leaflet';

/**
 * Проверяет, замкнуто ли кольцо
 */
export const isPolygonClosed = (ring: LatLngTuple[]) => {
    if (ring.length < 1) return false;
    const first = ring[0];
    const last = ring[ring.length - 1];
    return first[0] === last[0] && first[1] === last[1];
};

/**
 * Замыкает кольцо, если оно не замкнуто
 */
export const closePolygonRing = (ring: LatLngTuple[]) => {
    return isPolygonClosed(ring) ? ring : [...ring, ring[0]];
};

/**
 * Проверяет, входит ли точка внутрь полигона
 */
export const isPointInPolygon = (
    pt: LatLngTuple,
    polygonCoords: LatLngTuple[][],
) => {
    const poly = polygon(
        polygonCoords.map((r) => r.map(([lat, lng]) => [lng, lat])),
    );
    const turfPt = point([pt[1], pt[0]]);
    return booleanPointInPolygon(turfPt, poly);
};

/**
 * Проверяет, что все точки дыр находятся внутри внешнего контура
 */
export const areHolesInsideOuterRing = (
    outerRing: LatLngTuple[],
    holes: LatLngTuple[][],
) => {
    const outerPoly = polygon([outerRing.map(([lat, lng]) => [lng, lat])]);

    for (const hole of holes) {
        const closedHole = closePolygonRing(hole);
        for (const pt of closedHole) {
            const turfPt = point([pt[1], pt[0]]);
            if (!booleanPointInPolygon(turfPt, outerPoly)) return false;
        }
    }

    return true;
};

/**
 * Возвращает индекс ближайшего сегмента и расстояние до него
 */
export const findNearestSegment = (
    ring: LatLngTuple[],
    latlng: LatLng,
    map: Map,
) => {
    const clickPoint = map.latLngToLayerPoint(latlng);

    let minDist = Infinity;
    let insertIndex = 0;

    for (let i = 0; i < ring.length; i++) {
        const currLatLng = map.latLngToLayerPoint({
            lat: ring[i][0],
            lng: ring[i][1],
        });
        const nextLatLng = map.latLngToLayerPoint({
            lat: ring[(i + 1) % ring.length][0],
            lng: ring[(i + 1) % ring.length][1],
        });

        const dist = L.LineUtil.pointToSegmentDistance(
            clickPoint,
            currLatLng,
            nextLatLng,
        );

        if (dist < minDist) {
            minDist = dist;
            insertIndex = i + 1;
        }
    }

    return insertIndex;
};

/**
 * Вставляет точку в ближайший сегмент кольца
 */
export const insertPointIntoRing = (
    ring: LatLngTuple[],
    latlng: LatLng,
    map: Map,
): LatLngTuple[] => {
    const index = findNearestSegment(ring, latlng, map);
    const newRing = [...ring];
    newRing.splice(index, 0, [latlng.lat, latlng.lng]);
    return newRing;
};
