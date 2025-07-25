import { Polygon, Marker, useMapEvent, useMap } from 'react-leaflet';
import L, { LatLng, LatLngTuple, LeafletMouseEvent } from 'leaflet';
import { GeometryGeoJSON, GeoObject } from '../../../../entities/geoobject';
import React, { useRef, useState } from 'react';
import { ProxyGeoSystemSummary } from '../../../../entities/geoobject/model/types';
import { toast } from 'react-toastify';

import {
    insertPointIntoRing,
    closePolygonRing,
    areHolesInsideOuterRing,
} from '../../../../utils/geometryUtils';

interface Props {
    geoObject: GeoObject | ProxyGeoSystemSummary;
    geometry: GeometryGeoJSON;
    onChange: (coords: LatLngTuple[][]) => void;
}

export const EditablePolygon = ({ geoObject, geometry, onChange }: Props) => {
    const [positions, setPositions] = useState<LatLngTuple[][]>(
        geometry.coordinates as LatLngTuple[][],
    );

    const allowUpdate = useRef(true);
    const map = useMap();
    const warningTimeout = useRef<NodeJS.Timeout | null>(null);

    useMapEvent('click', (e) => {
        const latlng = e.latlng;

        if (!allowUpdate.current) {
            allowUpdate.current = true;
            return;
        }

        if (e.originalEvent.ctrlKey) {
            const newHole: LatLngTuple[] = [
                [latlng.lat, latlng.lng],
                [latlng.lat + 0.0003, latlng.lng],
                [latlng.lat + 0.0002, latlng.lng - 0.0003],
            ];
            const updated = [...positions, newHole];
            setPositions(updated);
            onChange(updated);
            return;
        }

        if (e.originalEvent.altKey && positions.length > 1) {
            let bestRingIndex = 1;
            let minDist = Infinity;
            let insertIndex = 0;
            const clickPoint = map.latLngToLayerPoint(latlng);

            for (let ringIndex = 1; ringIndex < positions.length; ringIndex++) {
                const ring = positions[ringIndex];

                for (let i = 0; i < ring.length; i++) {
                    const currLatLng = map.latLngToLayerPoint(
                        L.latLng(ring[i]),
                    );
                    const nextLatLng = map.latLngToLayerPoint(
                        L.latLng(ring[(i + 1) % ring.length]),
                    );

                    const dist = L.LineUtil.pointToSegmentDistance(
                        clickPoint,
                        currLatLng,
                        nextLatLng,
                    );

                    if (dist < minDist) {
                        minDist = dist;
                        bestRingIndex = ringIndex;
                        insertIndex = i + 1;
                    }
                }
            }

            const updated = [...positions];
            const ringCopy = [...updated[bestRingIndex]];
            ringCopy.splice(insertIndex, 0, [latlng.lat, latlng.lng]);
            updated[bestRingIndex] = ringCopy;

            setPositions(updated);
            onChange(updated);
            return;
        }

        // По умолчанию — вставка во внешний контур
        const newOuterRing = insertPointIntoRing(positions[0], latlng, map);
        const updatedPositions = [newOuterRing, ...positions.slice(1)];

        const closedOuterRing = closePolygonRing(newOuterRing);
        const holes = positions.slice(1);

        if (!areHolesInsideOuterRing(closedOuterRing, holes)) {
            toast.warning(
                'Нельзя вставить точку: дырка выйдет за пределы внешнего полигона',
            );
            return;
        }

        setPositions(updatedPositions);
        onChange(updatedPositions);
    });

    const handleMarkerClick = (
        ringIndex: number,
        pointIndex: number,
        e: LeafletMouseEvent,
    ) => {
        if (!e.originalEvent.shiftKey) return;

        const ring = positions[ringIndex];

        if (ring.length <= 3 && ringIndex === 0) {
            toast.error('Внешний контур должен содержать минимум 3 точки');
            return;
        }

        const updated = positions.map((r, i) =>
            i === ringIndex ? r.filter((_, j) => j !== pointIndex) : r,
        );

        if (ringIndex === 0) {
            const newOuterRing = closePolygonRing(updated[0]);

            const holes = positions.slice(1);
            if (!areHolesInsideOuterRing(newOuterRing, holes)) {
                toast.error(
                    'Нельзя удалять точку: дырка выйдет за пределы внешнего полигона',
                );
                return;
            }

            updated[0] = newOuterRing;
        }

        const cleaned = updated.filter((r, i) => i === 0 || r.length >= 3);

        setPositions(cleaned);
        onChange(cleaned);
    };

    const handleDrag = (
        ringIndex: number,
        pointIndex: number,
        marker: L.Marker,
    ) => {
        const latlng = marker.getLatLng();

        if (ringIndex === 0) {
            const newOuterRing = closePolygonRing(
                positions[0].map((pt, idx) =>
                    idx === pointIndex ? [latlng.lat, latlng.lng] : pt,
                ),
            );

            const holes = positions.slice(1);

            if (!areHolesInsideOuterRing(newOuterRing, holes)) {
                marker.setLatLng(positions[ringIndex][pointIndex]);

                if (warningTimeout.current) return;
                toast.dismiss();
                toast.warning(
                    'Нельзя выходить за внешний контур — внутренняя дырка выйдет за его пределы',
                );
                allowUpdate.current = false;

                warningTimeout.current = setTimeout(() => {
                    warningTimeout.current = null;
                }, 1500);
                return;
            }
        } else {
            const outerRing = closePolygonRing(positions[0]);
            const isInside = areHolesInsideOuterRing(outerRing, [
                positions[ringIndex].map((pt, idx) =>
                    idx === pointIndex ? [latlng.lat, latlng.lng] : pt,
                ),
            ]);

            if (!isInside) {
                marker.setLatLng(positions[ringIndex][pointIndex]);
                allowUpdate.current = false;

                if (warningTimeout.current) return;

                toast.dismiss();
                toast.warning('Нельзя выходить за внешний контур');

                warningTimeout.current = setTimeout(() => {
                    warningTimeout.current = null;
                }, 1500);
                return;
            }
        }

        allowUpdate.current = true;
    };

    const handleDraged = (
        ringIndex: number,
        pointIndex: number,
        latlng: LatLng,
        marker: L.Marker,
    ) => {
        const updated = positions.map((ring, i) =>
            i === ringIndex
                ? ring.map((pt, j) =>
                      j === pointIndex ? [latlng.lat, latlng.lng] : pt,
                  )
                : ring,
        ) as LatLngTuple[][];

        setPositions(updated);
        onChange(updated);
    };

    return (
        <>
            {positions.map((ring, ringIndex) => (
                <React.Fragment key={`ring-${ringIndex}`}>
                    <Polygon
                        positions={positions}
                        pathOptions={{
                            color: ringIndex === 0 ? 'blue' : 'gray',
                        }}
                    />
                    {ring.map((pos, pointIndex) => (
                        <Marker
                            key={`marker-${ringIndex}-${pointIndex}`}
                            position={pos}
                            draggable
                            eventHandlers={{
                                drag: (e) =>
                                    handleDrag(
                                        ringIndex,
                                        pointIndex,
                                        e.target as L.Marker,
                                    ),
                                dragend: (e) =>
                                    handleDraged(
                                        ringIndex,
                                        pointIndex,
                                        (e.target as L.Marker).getLatLng(),
                                        e.target as L.Marker,
                                    ),
                                click: (e) =>
                                    handleMarkerClick(ringIndex, pointIndex, e),
                            }}
                        />
                    ))}
                </React.Fragment>
            ))}
        </>
    );
};
