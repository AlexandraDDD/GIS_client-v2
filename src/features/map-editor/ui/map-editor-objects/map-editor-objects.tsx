import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { Circle, Polyline, Polygon, useMap } from 'react-leaflet';
import { MapEditorPopup } from '../map-editor-popup/map-editor-popup';
import { getColorOptions } from '../../lib/get-color-options';
import { editorModel } from '../../lib/editor.model';
import { EditorObject } from '../../lib/types';
import { mapModel } from '../../../map';
import { getGeometry } from '../../../../entities/geoobject';
import { isInsidePolygon } from '../../../../utils/IsPolygonInside';
import { LatLngTuple } from 'leaflet';

/** Рендерит объекты редактора (черновики) на карте с учётом клиппирования и зума */
export const MapEditorObjects = () => {
    const isClippingMode = useUnit(mapModel.$isClippingMode);
    const currentObject = useUnit(editorModel.$clippedObject);
    const [zoom, setZoom] = useState<number>(12);
    const map = useMap();

    /** Фильтруем объекты по клиппирующему полигону (если режим включен) */
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

    /** Отслеживаем изменение зума карты */
    useEffect(() => {
        const handleZoom = () => setZoom(map.getZoom());
        map.on('zoomend', handleZoom);
        return () => {
            map.off('zoomend', handleZoom);
        };
    }, [map]);

    return (
        <>
            {objects.map((object) => {
                const { Component, ...props } = getProps(object, zoom);
                if (!Component) return null;

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

/** Возвращает пропсы и компонент Leaflet по типу объекта и текущему зуму */
const getProps = (object: EditorObject, zoom: number) => {
    const { _id, type, selected, readonly, coordinates } = object;

    // Масштабирование размеров от уровня зума
    const sizeMultiplier = Math.max(1, zoom / 12);

    let sizeMultiplierForRadius = 18;
    if (zoom >= 16) {
        sizeMultiplierForRadius = zoom;
    } else if (zoom > 13 && zoom < 16) {
        sizeMultiplierForRadius = zoom / 3;
    } else if (zoom <= 13) {
        sizeMultiplierForRadius = zoom / 10;
    }

    const radius = 100 / sizeMultiplierForRadius; // Радиус для точек
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
