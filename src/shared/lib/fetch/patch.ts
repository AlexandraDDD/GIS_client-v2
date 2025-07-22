import { request, Settings } from './request';

export function patch<RETURNS>(
    path: string,
    settings?: Settings,
): Promise<RETURNS> {
    return request(path, 'PATCH', settings);
}
