import { createStore, sample, createEffect, createEvent } from 'effector';
import { status } from 'patronum/status';

import {
    getAvailableGeoObjectRequest,
    getGeoObjectRequest,
    patchGeoSystemGeometry,
} from '../api/requests';
import type { GeoObject, GeoObjectGeometryPatch } from './types';

/** Стор выбранной геосистемы */
const $geoObject = createStore<GeoObject | null>(null);
/** Стор списка доступных геосистем */
const $availableGeoObjects = createStore<GeoObject[] | null>(null);

/** Триггер загрузки списка доступных геосистем */
const getAvailableGeoObjects = createEvent();
const getAvailableGeoObjectsFx = createEffect(getAvailableGeoObjectRequest);
/** Статус загрузки списка доступных геосистем */
const $getAvailableGeoObjectLoading = status({
    effect: getAvailableGeoObjectsFx,
});

/** Запускает загрузку списка, если нет активного pending */
sample({
    source: $getAvailableGeoObjectLoading,
    clock: getAvailableGeoObjects,
    filter: (loading) => loading !== 'pending',
    target: getAvailableGeoObjectsFx,
});

/** Кладёт полученный список в стор */
sample({
    clock: getAvailableGeoObjectsFx.doneData,
    target: $availableGeoObjects,
});

/** Устанавливает выбранную геосистему вручную */
const setGeoObject = createEvent<GeoObject | null>();
/** Триггер загрузки одной геосистемы по id */
const getGeoObject = createEvent<string>();
const getGeoObjectFx = createEffect(getGeoObjectRequest);
/** Статус загрузки одной геосистемы */
const $getGeoObjectLoading = status({ effect: getGeoObjectFx });

/** Запускает загрузку объекта, если нет активного pending */
sample({
    source: $getGeoObjectLoading,
    clock: getGeoObject,
    filter: (loading) => loading !== 'pending',
    target: getGeoObjectFx,
});

/** Кладёт полученную геосистему в стор */
sample({ clock: getGeoObjectFx.doneData, target: $geoObject });

/** Эффект PATCH обновления геометрии геосистемы */
export const patchGeoSystemGeometryFx = createEffect(
    async (geobject: GeoObjectGeometryPatch) => {
        return await patchGeoSystemGeometry(geobject);
    },
);

/** После успешного PATCH — перезагружает объект по его id */
sample({
    clock: patchGeoSystemGeometryFx.done,
    fn: ({ params }) => params.id,
    target: getGeoObjectFx,
});

/** После успешной загрузки объекта — обновляет список доступных геосистем */
sample({
    clock: getGeoObjectFx.done,
    fn: () => ({}),
    target: getAvailableGeoObjectsFx,
});

// target: getGeoObject,  повторный запрос после успешного PATCH - вообще нужно
// обновлять только один геообъект и заменить его в массиве, но пока запрашиваем все

/** Ручная установка выбранной геосистемы */
$geoObject.on(setGeoObject, (_, geo) => geo);

/** Публичный API модели геосистем */
export const geoObjectModel = {
    $geoObject,

    $getGeoObjectLoading,
    getGeoObject,
    getGeoObjectFx,

    patchGeoSystemGeometryFx,

    $availableGeoObjects,
    getAvailableGeoObjects,
    setGeoObject,
};
