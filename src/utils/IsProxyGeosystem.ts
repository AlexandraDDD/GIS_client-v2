import { ProxyGeoSystemSummary } from '../entities/geoobject/model/types';

export function isProxyGeoSystem(obj: any): obj is ProxyGeoSystemSummary {
    return obj && typeof obj === 'object' && 'proxyRank' in obj;
}

export function safeIsProxyGeoSystem(obj: any): boolean | null {
    if (obj == null || typeof obj !== 'object') return null;
    if (isProxyGeoSystem(obj)) return true;
    if ('geometry' in obj && 'type' in obj) return false;
    return null;
}
