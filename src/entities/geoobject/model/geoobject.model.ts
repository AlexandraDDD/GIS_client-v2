import { createStore, sample, createEffect, createEvent } from 'effector';
import { status } from 'patronum/status';

import {
    getDeafaultGeoObjectRequest,
    patchGeoSystemGeometry,
} from '../api/requests';
import type { GeoObject, GeoObjectGeometryPatch } from './types';

// Создаем стор
const $geoObject = createStore<GeoObject | null>(null);

//PROXY
//const $proxyGeoObject = createStore<T[]>([]);

// Запрос за первым геобъектом
const getGeoObject = createEvent();
const getGeoObjectFx = createEffect(getDeafaultGeoObjectRequest);
const $getGeoObjectLoading = status({ effect: getGeoObjectFx });

sample({
    source: $getGeoObjectLoading,
    clock: getGeoObject,

    filter: (loading) => loading !== 'pending',
    target: getGeoObjectFx,
});

sample({ clock: getGeoObjectFx.doneData, target: $geoObject });

// Перезапрашиваем геообьекты после изменения данных .... - добавить после появления crud
export const patchGeoSystemGeometryFx = createEffect(
    async (geobject: GeoObjectGeometryPatch) => {
        return await patchGeoSystemGeometry(geobject);
    },
);

sample({
    clock: patchGeoSystemGeometryFx.done,
    target: getGeoObject, // повторный запрос после успешного PATCH
});

export const geoObjectModel = {
    $geoObject,

    $getGeoObjectLoading,
    getGeoObject,
    getGeoObjectFx,

    patchGeoSystemGeometryFx,
};
