import { request, type Settings } from './request';

export function get<RETURNS>(path: string, settings?: Settings): Promise<RETURNS> {
    return request(path, 'GET', settings);
}
