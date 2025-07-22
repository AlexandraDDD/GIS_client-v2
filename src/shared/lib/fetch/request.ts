import qs from 'query-string';

import { domain as defaultDomain } from './constants';

export interface Settings {
    domain?: string;

    body?: object;
    query?: object;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export function request<RETURNS>(
    path: string,
    method: Method,
    settings?: Settings,
): Promise<RETURNS> {
    const domain = settings?.domain ?? defaultDomain;

    const query = settings?.query ? '?' + qs.stringify(settings.query) : '';
    const body = settings?.body ? JSON.stringify(settings.body) : undefined;

    const headers = body
        ? {
              'Content-Type': 'application/json',
          }
        : undefined;

    return fetch(`${domain}${path}${query}`, { method, body, headers }).then(
        (response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            if (method === 'DELETE') {
                return;
            }
            if (response.statusText !== 'No Content') {
                return response.json();
            }
        },
    );
}
