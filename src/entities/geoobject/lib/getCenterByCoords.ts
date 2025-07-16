import type { LatLngTuple } from 'leaflet';

import type { GeometryGeoJSON } from '../model/types';

const isCoordsOfPoint = (coords: GeometryGeoJSON['coordinates']): coords is LatLngTuple =>
    typeof coords[0] === 'number';

export const getCenterByCoords = (coords: GeometryGeoJSON['coordinates']): LatLngTuple => {
    if (isCoordsOfPoint(coords)) {
        return coords;
    }

    const coordsSum = coords.reduce(([lat, long], [lat2, long2]) => [lat + lat2, long + long2], [0, 0]);

    return [coordsSum[0] / coords.length, coordsSum[1] / coords.length];
};
