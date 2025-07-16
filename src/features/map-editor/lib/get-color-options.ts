import type { PathOptions } from 'leaflet';

export const defaultOptions: PathOptions = {
    fillColor: 'gray',
    color: 'gray',
};
export const selectedOptions: PathOptions = {
    fillColor: 'green',
    color: 'green',
};
export const readonlyOptions: PathOptions = {
    fillColor: '#884444',
    color: '#884444',
};
export const selectedReadonlyOptions: PathOptions = {
    fillColor: '#dd4444',
    color: '#dd4444',
};

export const getColorOptions = (selected?: boolean, readonly?: boolean) => {
    if (selected && readonly) {
        return selectedReadonlyOptions;
    } else if (selected) {
        return selectedOptions;
    } else if (readonly) {
        return readonlyOptions;
    }
    return defaultOptions;
};
