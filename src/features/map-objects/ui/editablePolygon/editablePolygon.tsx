import { Polygon, Marker, useMapEvent, useMap } from 'react-leaflet';
import L, { LatLng, LatLngTuple } from 'leaflet';
import { GeometryGeoJSON, GeoObject } from '../../../../entities/geoobject';
import React, { useState } from 'react';
import { ProxyGeoSystemSummary } from '../../../../entities/geoobject/model/types';
import { toast } from 'react-toastify';

interface Props {
    geoObject: GeoObject | ProxyGeoSystemSummary;
    geometry: GeometryGeoJSON;
    onChange: (coords: LatLngTuple[][]) => void;
}

export const EditablePolygon = ({ geoObject, geometry, onChange }: Props) => {
    const [positions, setPositions] = useState<LatLngTuple[][]>(
        geometry.coordinates as LatLngTuple[][],
    );

    const map = useMap();

    // Добавляем точку по клику на полигон во alt + click внутренний либо внешний click

    useMapEvent('click', (e) => {
        const latlng = e.latlng;
        const clickPoint = map.latLngToLayerPoint(latlng);

        // Ctrl + Click → создать новое внутреннее кольцо
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

        // Alt + Click → вставить в ближайший внутренний контур
        if (e.originalEvent.altKey && positions.length > 1) {
            let bestRingIndex = 1;
            let minDist = Infinity;
            let insertIndex = 0;

            for (let ringIndex = 1; ringIndex < positions.length; ringIndex++) {
                const ring = positions[ringIndex];

                for (let i = 0; i < ring.length; i++) {
                    const currLatLng = L.latLng(ring[i]);
                    const nextLatLng = L.latLng(ring[(i + 1) % ring.length]);

                    const currPoint = map.latLngToLayerPoint(currLatLng);
                    const nextPoint = map.latLngToLayerPoint(nextLatLng);

                    const dist = L.LineUtil.pointToSegmentDistance(
                        clickPoint,
                        currPoint,
                        nextPoint,
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

        // Default: вставить точку в внешний контур (positions[0])
        const outerRing = positions[0];
        if (!outerRing || outerRing.length < 2) return;

        let minDist = Infinity;
        let insertIndex = 0;

        for (let i = 0; i < outerRing.length; i++) {
            const currLatLng = L.latLng(outerRing[i]);
            const nextLatLng = L.latLng(outerRing[(i + 1) % outerRing.length]);

            const currPoint = map.latLngToLayerPoint(currLatLng);
            const nextPoint = map.latLngToLayerPoint(nextLatLng);

            const dist = L.LineUtil.pointToSegmentDistance(
                clickPoint,
                currPoint,
                nextPoint,
            );

            if (dist < minDist) {
                minDist = dist;
                insertIndex = i + 1;
            }
        }

        const newOuterRing = [...outerRing];
        newOuterRing.splice(insertIndex, 0, [latlng.lat, latlng.lng]);

        const updatedPositions = [newOuterRing, ...positions.slice(1)];
        setPositions(updatedPositions);
        onChange(updatedPositions);
    });
    const handleDrag = (
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

        if (ringIndex > 0) {
            const outerPolygon = L.polygon(positions[0]);
            const layerPoint = map.latLngToLayerPoint(latlng);
            const isInside = (outerPolygon as any)._containsPoint(layerPoint);

            if (!isInside) {
                toast.error('Внутренний контур не может выходить за внешний!');
                // Откатываем маркер на старую позицию
                marker.setLatLng(positions[ringIndex][pointIndex]);
                return;
            }
        }

        setPositions(updated);
        onChange(updated);
    };

    // Удаление точки по Shift + клик на маркер (можно изменить по желанию)
    const handleMarkerClick = (
        ringIndex: number,
        pointIndex: number,
        e: L.LeafletMouseEvent,
    ) => {
        if (e.originalEvent.shiftKey) {
            const ring = positions[ringIndex];
            if (ring.length <= 3 && ringIndex === 0) {
                toast('Внешний контур должен содержать минимум 3 точки', {
                    type: 'error',
                });
                return;
            }

            const updated = positions
                .map((r, i) =>
                    i === ringIndex ? r.filter((_, j) => j !== pointIndex) : r,
                )
                .filter((r) => r.length >= 3 || r === positions[0]); // удаляем внутренние контуры с <3 точками
            setPositions(updated);
            onChange(updated);
        }
    };

    return (
        <>
            {positions.map((ring, ringIndex) => (
                <React.Fragment key={`ring-${ringIndex}`}>
                    <Polygon
                        positions={[ring]} // Оборачиваем ring в массив, чтобы получить LatLngTuple[][]
                        pathOptions={{
                            color: ringIndex === 0 ? 'blue' : 'red',
                        }}
                    />
                    {ring.map((pos, pointIndex) => (
                        <Marker
                            key={`marker-${ringIndex}-${pointIndex}`}
                            position={pos}
                            draggable
                            eventHandlers={{
                                dragend: (e) =>
                                    handleDrag(
                                        ringIndex,
                                        pointIndex,
                                        e.target.getLatLng(),
                                        e.target, // передаем сам маркер
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
