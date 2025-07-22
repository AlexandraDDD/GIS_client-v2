import type { Map } from 'leaflet';
import { createStore, createEvent, sample } from 'effector';

/* import type { DraftAspect } from '../../geoobject/'; */

import type { MapMode } from './types';
import { GeometryGeoJSON } from '../../geoobject';

const $map = createStore<Map | null>(null);
const setMap = createEvent<Map>();
sample({ clock: setMap, target: $map });

const $mapMode = createStore<MapMode>('view');
const setMapMode = createEvent<MapMode>();
sample({ clock: setMapMode, target: $mapMode });

const $editorPointsOnCorners = createStore<boolean>(true);
const setEditorPointsOnCorners = createEvent<boolean>();
sample({ clock: setEditorPointsOnCorners, target: $editorPointsOnCorners });

/* const $mapAspect = createStore<DraftAspect | null>(null);
const setMapAspect = createEvent<DraftAspect | null>();
sample({ clock: setMapAspect, target: $mapAspect }); */

// режим клиппирования для создания геобъектов внутри площади полигона
const $isClippingMode = createStore<boolean>(false);
const setClippingMode = createEvent<boolean>();
sample({ clock: setClippingMode, target: $isClippingMode });

// режим редактирования геометрии для геосистемы (не для прокси)
const $isGeometryEditMode = createStore<boolean>(false);

const toggleGeometryEditMode = createEvent();

sample({
    source: $isGeometryEditMode,
    clock: toggleGeometryEditMode,
    fn: (current) => !current,
    target: $isGeometryEditMode,
});

//временно тут хранится геометрия для редактирования
export const setEditedGeometry = createEvent<GeometryGeoJSON>();
export const resetEditedGeometry = createEvent();

export const $editedGeometry = createStore<GeometryGeoJSON | null>(null)
    .on(setEditedGeometry, (_, geometry) => geometry)
    .reset(resetEditedGeometry);

const $descriptionMode = createStore<boolean>(false);
const setDescriptionMode = createEvent<boolean>();
sample({ clock: setDescriptionMode, target: $descriptionMode });

export const mapModel = {
    $map,
    setMap,

    $mapMode,
    setMapMode,

    /*     $mapAspect,
    setMapAspect,
 */
    $editorPointsOnCorners,
    setEditorPointsOnCorners,

    setClippingMode,
    $isClippingMode,

    setDescriptionMode,
    $descriptionMode,

    $isGeometryEditMode,
    toggleGeometryEditMode,

    setEditedGeometry,
    resetEditedGeometry,
    $editedGeometry,
};
