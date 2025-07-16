import { createStore, sample, createEvent } from 'effector';
import { nanoid } from 'nanoid';

import type { EditorObject, EditorPoint } from './types';
import { GeoObject, geoObjectModel, getGeometry } from '../../../entities/geoobject';
import { mapModel } from '../../../entities/map';

const $objects = createStore<Record<EditorObject['_id'], EditorObject>>({});
const $selectedObjects = sample({
    clock: $objects,
    fn: (objects) => Object.values(objects).filter(({ selected }) => selected),
});

// Хранилище для текущего объекта клиппирования
const $clippedObject = createStore<GeoObject | null>(null);

// Событие для добавления текущего объекта клиппирования
const setClippedObject = createEvent<GeoObject | null>();

// Обработка установки текущего приближенного объекта
sample({
    clock: setClippedObject,
    target: $clippedObject,
});

/** Добавить обьект по координатам */
const addObject = createEvent<Omit<EditorObject, '_id'>>();
sample({
    clock: addObject,
    source: $objects,
    fn: (objects, { type, coordinates, selected, readonly }) => {
        // @ts-ignore
        const newObject: EditorObject = {
            _id: nanoid(),
            type,
            coordinates,
            selected: selected ?? true,
            readonly: readonly ?? false,
        };

        return { ...objects, [newObject._id]: newObject };
    },
    target: $objects,
});

/** Добавить/убрать выделение обьекту по _id */
const toggleObjectSelect = createEvent<EditorObject['_id']>();
sample({
    clock: toggleObjectSelect,
    source: $objects,
    fn: (objects, _id) => {
        const object = objects[_id];

        return { ...objects, [object._id]: { ...object, selected: !object.selected } };
    },
    target: $objects,
});

/** Удалить обьект */
const deleteObject = createEvent<EditorObject['_id']>();
sample({
    clock: deleteObject,
    source: $objects,
    filter: (objects, _id) => !objects[_id]?.readonly, // проверяем что его можно удалить
    fn: (objects, _id) => {
        const copiedPoints = { ...objects };
        delete copiedPoints[_id];

        return copiedPoints;
    },
    target: $objects,
});

/** Обьединить выбранные точки в линию или полигон */
const unitePointsTo = createEvent<Exclude<EditorObject['type'], 'Point'>>();
sample({
    clock: unitePointsTo,
    source: $selectedObjects,
    fn: (selectedObjects, type) => {
        const selectedPoints = Object.values(selectedObjects).filter(
            (object): object is EditorPoint => object.type === 'Point',
        );

        return { type, coordinates: selectedPoints.map(({ coordinates }) => coordinates) };
    },
    target: addObject,
});

export const editorModel = {
    $objects,
    $selectedObjects,

    addObject,
    toggleObjectSelect,
    deleteObject,

    unitePointsTo,

    setClippedObject,
    $clippedObject,
};

/**
 * Когда загрузились сохраненные обьекты или переключилась настройка,
 * то на углах полигонов и линий ставим точки для создания границ
 */

/*  sample({
    clock: [mapModel.$editorPointsOnCorners, geoObjectModel.$geoObject],
    source: {
        editorPointsOnCorners: mapModel.$editorPointsOnCorners,
        geoobjects: geoObjectModel.$geoObject,
        objects: $objects,
    },
    fn: ({ objects, geoobjects, editorPointsOnCorners }) => {
        const newObjects: Record<EditorObject['_id'], EditorObject> = {};

       //  Убираем предыдущие ридонли элементы 
        Object.values(objects).forEach((object) => {
            if (!object.readonly) {
                newObjects[object._id] = object;
            }
        });

      //   И добавляем новые если надо
        if (editorPointsOnCorners) {
            geoobjects.forEach((geoobject) => {
                const geometry = getGeometry(geoobject);
                if (!geometry) return;

                const { type, coordinates } = geometry;

                if (type === 'Polygon' || type === 'PolyLine') {
                    coordinates.map((pointCoords) => {
                        // @ts-ignore
                        const newObject: EditorObject = {
                            _id: nanoid(),
                            type: 'Point',
                            coordinates: pointCoords,
                            selected: false,
                            readonly: true,
                        };

                        newObjects[newObject._id] = newObject;
                    });
                }
            });
        }

        return newObjects;
    },
    target: $objects,
}); 
 */
