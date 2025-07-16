import type { Map } from 'leaflet';
import { createStore, createEvent, sample } from 'effector';

/* import type { DraftAspect } from '../../geoobject/'; */

import type { MapMode } from './types';

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

const $isClippingMode = createStore<boolean>(false);
const setClippingMode = createEvent<boolean>();
sample({ clock: setClippingMode, target: $isClippingMode });

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
};
