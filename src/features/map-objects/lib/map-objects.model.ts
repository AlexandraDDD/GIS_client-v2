import { createStore, createEvent, sample } from 'effector';
import { geoObjectModel, type GeoObject } from '../../../entities/geoobject';
import { ProxyGeoSystemSummary } from '../../../entities/geoobject/model/types';

/** Визуальное взаимодействие с геобъектами на карте и их отрисовка */
/** Стор выбранного геообъекта (GeoObject или Proxy) */
const $selectedGeoobject = createStore<
    GeoObject | ProxyGeoSystemSummary | null
>(null);

/** Установить выбранный геообъект */
const setSelectedGeoobject = createEvent<GeoObject | ProxyGeoSystemSummary>();

/** Удалить выбранный геообъект */
const removeSelectedGeoobject = createEvent();

/** Установить объект, к которому нужно приблизиться */
const setZoomedObject = createEvent<GeoObject | ProxyGeoSystemSummary | null>();
/** Триггер повторного зума */
const triggerZoom = createEvent();

/** Стор текущего приближенного объекта */
const $zoomedObject = createStore<GeoObject | ProxyGeoSystemSummary | null>(
    null,
);

/** Стор с временем последнего вызова зума */
const $zoomedObjectTimestamp = createStore<number>(0);

/** Обработка выбора геообъекта */
sample({
    clock: setSelectedGeoobject,
    target: $selectedGeoobject,
});

/** Очистка выбранного объекта */
sample({
    clock: removeSelectedGeoobject,
    source: $selectedGeoobject,
    fn: () => {
        console.log('removeSelectedGeoobject');
        return null;
    },
    target: $selectedGeoobject,
});

/** Установка приближенного объекта */
sample({
    clock: setZoomedObject,
    target: $zoomedObject,
});

/** Обновление времени последнего зума при изменении объекта или триггере */
sample({
    clock: [setZoomedObject, triggerZoom],
    fn: () => Date.now(),
    target: $zoomedObjectTimestamp,
});

/** Публичный API модели объектов на карте */
export const mapObjectsModel = {
    $selectedGeoobject,
    setSelectedGeoobject,
    removeSelectedGeoobject,

    $zoomedObject,
    setZoomedObject,
    triggerZoom,
    $zoomedObjectTimestamp,
};
