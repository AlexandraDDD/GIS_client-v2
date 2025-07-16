import { GeoObject } from '../entities/geoobject';
import { ProxyGeoSystemSummary } from '../entities/geoobject/model/types';

export const isProxyGeoSystem = (
    obj: GeoObject | ProxyGeoSystemSummary,
): obj is ProxyGeoSystemSummary => {
    return 'proxyRank' in obj;
};
