import { post } from '../../fetch';

import type { Timezone } from '../lib/timezone.model';

export interface GetTimezoneRequestParams {
    anyId: string;
    lat: number;
    long: number;
}

export const getTimezoneRequest = async ({ anyId, lat, long }: GetTimezoneRequestParams) => {
    const { timezone } = await post<{ timezone: Timezone[] }>('/api/find-timezone', {
        domain: 'http://localhost:4000',
        body: { lat, long },
    });

    return { [anyId]: timezone[0] };
};
