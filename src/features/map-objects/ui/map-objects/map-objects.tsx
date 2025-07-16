import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { Circle, Polygon, Polyline, useMap } from 'react-leaflet';
import {
    geoObjectModel,
    getGeometry,
    type GeoObject,
    type GeometryGeoJSON,
} from '../../../../entities/geoobject';
import { mapObjectsModel } from '../../lib/map-objects.model';
import { ProxyGeoSystemSummary } from '../../../../entities/geoobject/model/types';
import { MapObjectPopup } from '../map-object-popup/map-object-popup';

export const MapObjects = () => {
    const zoomedObject = useUnit(mapObjectsModel.$zoomedObject);
    const selectedGeoobject = useUnit(mapObjectsModel.$selectedGeoobject);
    const [zoom, setZoom] = useState<number>(12);
    const map = useMap();

    const geoObject = useUnit(geoObjectModel.$geoObject);
    const proxyGeoObjects = geoObject?.proxyGeoSystemDtos ?? [];

    useEffect(() => {
        const handleZoom = () => {
            setZoom(map.getZoom());
        };
        map.on('zoomend', handleZoom);
        return () => {
            map.off('zoomend', handleZoom);
        };
    }, [map]);

    return (
        <>
            {geoObject &&
                (() => {
                    const geometry = getGeometry(geoObject);
                    if (!geometry) return null;
                    const isSelected = selectedGeoobject?.id === geoObject.id;

                    return getGeometryComponent(
                        geoObject,
                        geometry,
                        zoomedObject,
                        zoom,
                        isSelected,
                        false,
                    );
                })()}

            {proxyGeoObjects.map((proxy) => {
                if (!proxy.geometry) return null;
                const geometry = getGeometry(proxy);
                if (!geometry) return null;
                const isSelected = selectedGeoobject?.id === proxy.id;

                return getGeometryComponent(
                    proxy,
                    geometry,
                    zoomedObject,
                    zoom,
                    isSelected,
                    true,
                );
            })}
        </>
    );
};

const getGeometryComponent = (
    object: GeoObject | ProxyGeoSystemSummary,
    geometry: GeometryGeoJSON,
    zoomedObject: GeoObject | ProxyGeoSystemSummary | null,
    zoom: number,
    isSelected: boolean,
    isProxy: boolean,
): JSX.Element | null => {
    const { type, coordinates } = geometry;
    const isZoomed = zoomedObject?.id === object.id;

    const sizeMultiplier = Math.max(1, zoom / 12);
    let sizeMultiplierForRadius = 18;

    if (zoom >= 16) sizeMultiplierForRadius = zoom;
    else if (zoom > 13 && zoom < 16) sizeMultiplierForRadius = zoom / 3;
    else sizeMultiplierForRadius = zoom / 10;

    const radius = 100 / sizeMultiplierForRadius;
    const weight = 2 * sizeMultiplier;

    const color =
        isProxy && isSelected
            ? 'orange'
            : isSelected
              ? 'yellow'
              : isProxy
                ? 'gray'
                : 'blue';

    const updateKey = `${object.id}-${isSelected ? 'selected' : 'unselected'}-${isZoomed ? 'zoomed' : 'unzoomed'}`;

    const commonProps = {
        eventHandlers: {
            click: () => {
                if (isSelected) {
                    mapObjectsModel.removeSelectedGeoobject();
                } else {
                    mapObjectsModel.setSelectedGeoobject(object);
                }
            },
        },
        key: updateKey,
        color,
        fillColor: color,
        fillOpacity: 0.4,
        zIndexOffset: isZoomed ? 1000 : 0,
    };
    switch (type) {
        case 'Point':
            return (
                <Circle {...commonProps} radius={radius} center={coordinates}>
                    {/*   <MapObjectPopup
                        object={object}
                        isProxy={isProxy}
                        visible={isSelected}
                    /> */}
                </Circle>
            );

        case 'PolyLine':
            return (
                <Polyline
                    {...commonProps}
                    weight={weight}
                    positions={coordinates}
                >
                    {/*  <MapObjectPopup
                        object={object}
                        isProxy={isProxy}
                        visible={isSelected}
                    /> */}
                </Polyline>
            );

        case 'Polygon':
            return (
                <Polygon
                    {...commonProps}
                    weight={weight}
                    positions={coordinates}
                >
                    {/*  <MapObjectPopup
                        object={object}
                        isProxy={isProxy}
                        visible={isSelected}
                    /> */}
                </Polygon>
            );
        default:
            return null;
    }
};
