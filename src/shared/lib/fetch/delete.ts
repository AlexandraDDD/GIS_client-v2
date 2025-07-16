import { request, type Settings } from './request';

export function del<RETURNS>(path: string, settings?: Settings): Promise<RETURNS> {
    return request(path, 'DELETE', settings);
}
