import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { Circle, Polyline, Polygon, useMap } from 'react-leaflet';
import { MapEditorPopup } from '../map-editor-popup/map-editor-popup';
import { getColorOptions } from '../../lib/get-color-options';
import { editorModel } from '../../lib/editor.model';
import { EditorObject } from '../../lib/types';
import { mapModel } from '../../../../entities/map';
import { DraftGeoObject, getGeometry } from '../../../../entities/geoobject';
import { isInsidePolygon } from '../../../../utils/IsPolygonInside';
import { LatLngTuple } from 'leaflet';

/** Рендерит геообьекты на карте */
export const MapEditorObjects = () => {
    const isClippingMode = useUnit(mapModel.$isClippingMode);

    const currentObject = useUnit(editorModel.$clippedObject); // Хранит текущий полигон

    const [zoom, setZoom] = useState<number>(12);
    const map = useMap();

    const objects = Object.values(useUnit(editorModel.$objects)).filter(
        (obj: EditorObject) => {
            if (!isClippingMode || !currentObject) return true;

            const currentObjectGeometry =
                getGeometry(currentObject)?.coordinates;
            if (!currentObjectGeometry) return true;

            return isInsidePolygon(
                obj.coordinates,
                currentObjectGeometry as LatLngTuple[],
            );
        },
    );

    useEffect(() => {
        const handleZoom = () => {
            const currentZoom = map.getZoom();
            setZoom(currentZoom);
            /*  console.log('currentZoom', currentZoom); */
        };

        map.on('zoomend', handleZoom);
        return () => {
            map.off('zoomend', handleZoom);
        };
    }, [map]);

    return (
        <>
            {objects.map((object) => {
                const { Component, ...props } = getProps(object, zoom);

                if (!Component) return null; // Если компонент не определен, пропускаем объект

                return (
                    // @ts-ignore
                    <Component {...props} key={object._id}>
                        <MapEditorPopup object={object} />
                    </Component>
                );
            })}
        </>
    );
};

/**
 * Функция для получения свойств компонента на основе типа объекта
 */
const getProps = (object: EditorObject, zoom: number) => {
    const { _id, type, selected, readonly, coordinates } = object;

    // Размеры объектов зависят от уровня зума
    const sizeMultiplier = Math.max(1, zoom / 12);

    let sizeMultiplierForRadius = 18;

    if (zoom >= 16) {
        sizeMultiplierForRadius = zoom;
    } else if (zoom > 13 && zoom < 16) {
        sizeMultiplierForRadius = zoom / 3;
    } else if (zoom <= 13) {
        sizeMultiplierForRadius = zoom / 10;
    }

    const radius = 100 / sizeMultiplierForRadius; // Радиус точек
    const weight = 2 * sizeMultiplier; // Толщина линий

    const common = {
        pathOptions: getColorOptions(selected, readonly),
        eventHandlers: {
            click: () => !selected && editorModel.toggleObjectSelect(_id),
        },
    };

    switch (type) {
        case 'Point':
            return {
                ...common,
                radius,
                center: coordinates as LatLngTuple,
                Component: Circle,
            };
        case 'PolyLine':
            return {
                ...common,
                weight,
                positions: coordinates as LatLngTuple[],
                Component: Polyline,
            };
        case 'Polygon':
            return {
                ...common,
                weight,
                positions: coordinates as LatLngTuple[],
                Component: Polygon,
            };
    }
};
