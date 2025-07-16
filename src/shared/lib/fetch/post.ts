import { request, type Settings } from './request';

export function post<RETURNS>(path: string, settings?: Settings): Promise<RETURNS> {
    return request(path, 'POST', settings);
}
