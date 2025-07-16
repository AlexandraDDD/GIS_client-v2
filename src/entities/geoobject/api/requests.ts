import { get } from '../../../shared/lib/fetch';
import type { GeoObject } from '../model/types';
import mockGeoObject from '../../../mockdata/geosystemmock.json';

export const getDeafaultGeoObjectRequest = async () => {
    const data = await get<GeoObject>(
        '/api/GeoSystem/35545d45-284a-46ed-9bd5-33d8d30c78aa',
    );
    return data;
};
//запрос за моковыми данными
export const getGeoObjectsMockRequest = async (): Promise<GeoObject> => {
    return mockGeoObject;
};
