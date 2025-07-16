import { createStore, createEffect, sample, createEvent } from 'effector';

import { getTimezoneRequest, type GetTimezoneRequestParams } from '../api/get-timezone';

// America/Los_Angeles
export type Timezone = string;

const $savedTimezones = createStore<{ [id: string]: Timezone | undefined }>({});

const getTimezoneFx = createEffect(getTimezoneRequest);

sample({
    clock: getTimezoneFx.doneData,
    source: $savedTimezones,
    fn: (saved, newTimezone) => ({ ...saved, ...newTimezone }),
    target: $savedTimezones,
});

export const timezoneModel = {
    $savedTimezones,

    getTimezoneFx,
};
