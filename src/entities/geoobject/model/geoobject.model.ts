import { createStore, sample, createEffect, createEvent } from 'effector';
import { status } from 'patronum/status';

import { getDeafaultGeoObjectRequest } from '../api/requests';
import type { GeoObject } from './types';

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

export const geoObjectModel = {
    $geoObject,

    $getGeoObjectLoading,
    getGeoObject,
    getGeoObjectFx,
};
