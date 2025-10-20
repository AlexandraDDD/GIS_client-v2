import { get, patch } from '../../../shared/lib/fetch';
import type { GeoObject, GeoObjectGeometryPatch } from '../model/types';

//Получение всех геосистем как временное решение для возможности начала работы
export const getAvailableGeoObjectRequest = async () => {
    const data = await get<GeoObject[]>('/api/GeoSystem');

    return data;
};
//Получение одной геосистемы
export const getGeoObjectRequest = async (id: string) => {
    const data = await get<GeoObject>(`/api/GeoSystem/${id}`);

    return data;
};

// PATCH изменение геометрии геосистемы
export const patchGeoSystemGeometry = async (
    geoObject: GeoObjectGeometryPatch,
) => {
    const data = await patch<GeoObject>(`/api/GeoSystem/${geoObject.id}`, {
        body: geoObject,
    });
    return data;
};

//запрос за мок данными
/* export const getGeoObjectsMockRequest = async (): Promise<GeoObject> => {
    return mockGeoObject;
};
 */
