import { request, type Settings } from './request';

export function put<RETURNS>(path: string, settings?: Settings): Promise<RETURNS> {
    return request(path, 'PUT', settings);
}
