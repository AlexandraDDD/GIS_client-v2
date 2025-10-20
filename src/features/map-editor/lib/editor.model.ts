import { createStore, sample, createEvent } from 'effector';
import { nanoid } from 'nanoid';

import type { EditorObject, EditorPoint } from './types';
import { GeoObject } from '../../../entities/geoobject';

/** Стор всех редакторских объектов по _id */
const $objects = createStore<Record<EditorObject['_id'], EditorObject>>({});
/** Вычисляемый список выбранных объектов */
const $selectedObjects = sample({
    clock: $objects,
    fn: (objects) => Object.values(objects).filter(({ selected }) => selected),
});

/** Текущий объект для клиппирования (или null) */
const $clippedObject = createStore<GeoObject | null>(null);
/** Установка текущего объекта клиппирования */
const setClippedObject = createEvent<GeoObject | null>();
sample({ clock: setClippedObject, target: $clippedObject });

/** Добавить объект (генерирует _id) */
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

/** Переключить выделение объекта по _id */
const toggleObjectSelect = createEvent<EditorObject['_id']>();
sample({
    clock: toggleObjectSelect,
    source: $objects,
    fn: (objects, _id) => {
        const object = objects[_id];
        return {
            ...objects,
            [object._id]: { ...object, selected: !object.selected },
        };
    },
    target: $objects,
});

/** Удалить объект по _id (если не readonly) */
const deleteObject = createEvent<EditorObject['_id']>();
sample({
    clock: deleteObject,
    source: $objects,
    filter: (objects, _id) => !objects[_id]?.readonly,
    fn: (objects, _id) => {
        const copied = { ...objects };
        delete copied[_id];
        return copied;
    },
    target: $objects,
});

/** Объединить выбранные точки в линию/полигон */
const unitePointsTo = createEvent<Exclude<EditorObject['type'], 'Point'>>();
sample({
    clock: unitePointsTo,
    source: $selectedObjects,
    fn: (selectedObjects, type) => {
        const selectedPoints = Object.values(selectedObjects).filter(
            (object): object is EditorPoint => object.type === 'Point',
        );
        return {
            type,
            coordinates: selectedPoints.map(({ coordinates }) => coordinates),
        };
    },
    target: addObject,
});

/** Публичный API модели редактора объектов */
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
 * Когда загрузились сохраненные объекты или переключилась настройка,
 * можно расставлять служебные точки по углам (пример ниже отключён).
 */

/* sample({
    clock: [mapModel.$editorPointsOnCorners, geoObjectModel.$geoObject],
    source: {
        editorPointsOnCorners: mapModel.$editorPointsOnCorners,
        geoobjects: geoObjectModel.$geoObject,
        objects: $objects,
    },
    fn: ({ objects, geoobjects, editorPointsOnCorners }) => {
        const newObjects: Record<EditorObject['_id'], EditorObject> = {};

        // Убираем предыдущие несистемные элементы
        Object.values(objects).forEach((object) => {
            if (!object.readonly) {
                newObjects[object._id] = object;
            }
        });

        // Добавляем новые точки по углам при включённой настройке
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
}); */
