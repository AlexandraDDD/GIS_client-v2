import type { Map } from 'leaflet';
import { createStore, createEvent, sample } from 'effector';
import type { MapMode } from './types';
import { GeometryGeoJSON } from '../../../entities/geoobject';

/** Стор инстанса Leaflet-карты и событие его установки */
const $map = createStore<Map | null>(null);
const setMap = createEvent<Map>();
sample({ clock: setMap, target: $map });

/** Режим карты (view/edit/...) и событие его смены */
const $mapMode = createStore<MapMode>('view');
const setMapMode = createEvent<MapMode>();
sample({ clock: setMapMode, target: $mapMode });

/** Флаг: редактировать точки по углам (включено/выключено) */
const $editorPointsOnCorners = createStore<boolean>(true);
const setEditorPointsOnCorners = createEvent<boolean>();
sample({ clock: setEditorPointsOnCorners, target: $editorPointsOnCorners });

/** Режим клиппирования для создания объектов внутри полигона */
const $isClippingMode = createStore<boolean>(false);
const setClippingMode = createEvent<boolean>();
sample({ clock: setClippingMode, target: $isClippingMode });

/** Режим редактирования геометрии и переключатель (toggle) */
const $isGeometryEditMode = createStore<boolean>(false);
const toggleGeometryEditMode = createEvent();
sample({
    source: $isGeometryEditMode,
    clock: toggleGeometryEditMode,
    fn: (current) => !current,
    target: $isGeometryEditMode,
});

/** Временная геометрия для редактирования (set/reset + стор) */
export const setEditedGeometry = createEvent<GeometryGeoJSON>();
export const resetEditedGeometry = createEvent();
export const $editedGeometry = createStore<GeometryGeoJSON | null>(null)
    .on(setEditedGeometry, (_, geometry) => geometry)
    .reset(resetEditedGeometry);

/** Режим описания (вкл/выкл) для UI описаний */
const $descriptionMode = createStore<boolean>(false);
const setDescriptionMode = createEvent<boolean>();
sample({ clock: setDescriptionMode, target: $descriptionMode });

/** Публичный API модели карты/редактора */
export const mapModel = {
    $map,
    setMap,

    $mapMode,
    setMapMode,

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
