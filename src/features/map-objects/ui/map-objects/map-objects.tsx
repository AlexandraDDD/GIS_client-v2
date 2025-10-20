/**
 * Рендер геометрий выбранной геосистемы и её прокси на карте
 * (с поддержкой зума и режима редактирования).
 */

import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { Circle, LayerGroup, Polygon, Polyline, useMap } from 'react-leaflet';
import {
    geoObjectModel,
    getGeometry,
    type GeoObject,
    type GeometryGeoJSON,
} from '../../../../entities/geoobject';
import { mapObjectsModel } from '../../lib/map-objects.model';
import { ProxyGeoSystemSummary } from '../../../../entities/geoobject/model/types';
import { mapModel } from '../../../map';
import { EditablePolygon } from '../editablePolygon/editablePolygon';
import { LatLngTuple } from 'leaflet';

/** Отрисовывает главную геосистему и её прокси; включает EditablePolygon в режиме редактирования */
export const MapObjects = () => {
    const zoomedObject = useUnit(mapObjectsModel.$zoomedObject);
    const selectedGeoobject = useUnit(mapObjectsModel.$selectedGeoobject);
    const [zoom, setZoom] = useState<number>(12);
    const map = useMap();

    const geoObject = useUnit(geoObjectModel.$geoObject);
    const proxyGeoObjects = geoObject?.proxyGeoSystemDtos ?? [];

    // отрисовка либо геометрии геосистемы либо редактируемой геометрии
    const isGeometryEditMode = useUnit(mapModel.$isGeometryEditMode);
    const editedGeometry = useUnit(mapModel.$editedGeometry);

    const maingeometry =
        isGeometryEditMode && editedGeometry
            ? editedGeometry
            : geoObject
              ? getGeometry(geoObject)
              : null;

    const handlePolygonChange = (updatedCoords: LatLngTuple[][]) => {
        mapModel.setEditedGeometry({
            type: 'Polygon',
            coordinates: updatedCoords,
        });
    };
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
                    maingeometry;
                    if (!maingeometry) return null;
                    const isSelected = selectedGeoobject?.id === geoObject.id;

                    return getGeometryComponent(
                        geoObject,
                        maingeometry,
                        zoomedObject,
                        zoom,
                        isSelected,
                        false,
                        isGeometryEditMode,
                        isGeometryEditMode ? handlePolygonChange : undefined,
                    );
                })()}

            {!isGeometryEditMode &&
                proxyGeoObjects.map((proxy) => {
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
                        false,
                    );
                })}
        </>
    );
};

/** Возвращает соответствующий Leaflet-элемент для геометрии
 * (учитывает выделение/зум/цвета/редактирование) */
const getGeometryComponent = (
    object: GeoObject | ProxyGeoSystemSummary,
    geometry: GeometryGeoJSON,
    zoomedObject: GeoObject | ProxyGeoSystemSummary | null,
    zoom: number,
    isSelected: boolean,
    isProxy: boolean,
    isGeometryEditMode: boolean,
    onChange?: (coords: LatLngTuple[][]) => void,
): JSX.Element | null => {
    const { type, coordinates } = geometry;

    const isZoomed = zoomedObject?.id === object.id;

    // масштабирование визуальных параметров от уровня зума
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
                if (isSelected) mapObjectsModel.removeSelectedGeoobject();
                else mapObjectsModel.setSelectedGeoobject(object);
            },
        },
        key: updateKey,
        color,
        fillColor: color,
        fillOpacity: 0.4,
        weight,
        zIndexOffset: isZoomed ? 1000 : 0,
    };

    if (isGeometryEditMode && onChange && type === 'Polygon') {
        return (
            <EditablePolygon
                geoObject={object}
                geometry={geometry}
                onChange={onChange}
            />
        );
    }

    switch (type) {
        case 'Point':
            return (
                <Circle {...commonProps} radius={radius} center={coordinates} />
            );
        case 'PolyLine':
            return <Polyline {...commonProps} positions={coordinates} />;
        case 'Polygon':
            return <Polygon {...commonProps} positions={coordinates} />;
        case 'MultiPolygon':
            return (
                <LayerGroup key={updateKey}>
                    {coordinates.map((polygonRings, idx) => (
                        <Polygon positions={polygonRings} {...commonProps} />
                    ))}
                </LayerGroup>
            );
        default:
            return null;
    }
};
