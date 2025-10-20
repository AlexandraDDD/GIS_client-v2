import React, { useEffect } from 'react';
import { LatLngTuple, LeafletMouseEvent } from 'leaflet';
import { useUnit } from 'effector-react';

import { Button } from '../../../../shared/ui/button';
import { mapModel } from '../../../map';

import { editorModel } from '../../lib/editor.model';
import { EditorObject } from '../../lib/types';
import { useSelectedObjectsByType } from '../../lib/use-objects-by-type';

import styles from './map-editor-actions.module.scss';
import { MapObjectActions } from '../../../map-objects';
import { pointInsidePolygon } from '../../../../utils/IsPolygonInside';
import { getGeometry } from '../../../../entities/geoobject';

/** Рендерит список действий в черновиковом режиме (обьединение/удаление кнопок/полигонов) */
export const MapEditorActions = () => {
    const map = useUnit(mapModel.$map);
    const isClippingMode = useUnit(mapModel.$isClippingMode);
    const clippedObject = useUnit(editorModel.$clippedObject);

    // Клик по карте создает новую точку
    useEffect(() => {
        if (!map) {
            console.log(' (!map)');
            return;
        }
        const handleMapClick = (e: LeafletMouseEvent) => {
            if (isClippingMode && clippedObject) {
                const clippedPolygon = getGeometry(clippedObject);

                const isPointInsidePolygon = pointInsidePolygon(
                    [e.latlng.lat, e.latlng.lng],
                    clippedPolygon?.coordinates as LatLngTuple[],
                );

                if (!isPointInsidePolygon) {
                    console.log(
                        'точка не может быть вне родительского полигона',
                    );
                } else {
                    editorModel.addObject({
                        type: 'Point',
                        coordinates: [e.latlng.lat, e.latlng.lng],
                    });
                }
            } else {
                editorModel.addObject({
                    type: 'Point',
                    coordinates: [e.latlng.lat, e.latlng.lng],
                });
            }
        };

        map.addEventListener('click', handleMapClick);

        return () => {
            map.removeEventListener('click', handleMapClick);
        };
    }, [map, isClippingMode, clippedObject]);

    const unitePointsTo = (type: Exclude<EditorObject['type'], 'Point'>) => {
        map?.closePopup();

        editorModel.unitePointsTo(type);
    };

    const selectedPoints = useSelectedObjectsByType('Point');
    const selectedPolylines = useSelectedObjectsByType('PolyLine');
    const selectedPolygons = useSelectedObjectsByType('Polygon');

    return (
        <div>
            <MapObjectActions />
            <h2>Выбранные геообъекты:</h2>

            <ObjectsActionsContainer
                objects={selectedPoints}
                extraButtons={
                    <>
                        {selectedPoints.length > 1 && (
                            <Button onClick={() => unitePointsTo('PolyLine')}>
                                Обьединить в линию
                            </Button>
                        )}
                        {selectedPoints.length > 2 && (
                            <Button onClick={() => unitePointsTo('Polygon')}>
                                Обьединить в полигон
                            </Button>
                        )}
                    </>
                }
            />
            <ObjectsActionsContainer objects={selectedPolylines} />
            <ObjectsActionsContainer objects={selectedPolygons} />
        </div>
    );
};

const typeToText = {
    Point: 'Точки',
    PolyLine: 'Линии',
    Polygon: 'Полигоны',
};

const ObjectsActionsContainer = ({
    objects,
    extraButtons,
}: {
    objects: EditorObject[];
    extraButtons?: React.ReactNode;
}) => {
    const map = useUnit(mapModel.$map);

    if (objects.length === 0) {
        return null;
    }

    /** Обработчик "массовых" событий для обьектов одного типа */
    const handleEvent = (func: (_id: string) => void) => {
        map?.closePopup();

        objects.forEach(({ _id }) => func(_id));
    };
    const handleDelete = () => handleEvent(editorModel.deleteObject);
    const handleRemoveSelection = () =>
        handleEvent(editorModel.toggleObjectSelect);

    return (
        <div className={styles.container}>
            <h3>
                {typeToText[objects[0].type]} ({objects.length})
            </h3>

            <div>
                {objects.map(({ _id, readonly }) => (
                    <div key={_id}>
                        id: {_id} {readonly && '(readonly)'}
                    </div>
                ))}
            </div>

            {extraButtons}

            <Button onClick={handleRemoveSelection}>Снять выделение</Button>
            <Button onClick={handleDelete} color="orange">
                Удалить
            </Button>
        </div>
    );
};
