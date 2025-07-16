import React from 'react';
import { useUnit } from 'effector-react';
import { mapObjectsModel } from '../../lib/map-objects.model';
import { geoObjectModel } from '../../../../entities/geoobject';
import { MapObjectItem } from '../object-actions/object-actions';
import { mapModel } from '../../../../entities/map';

/** Рендерит список карточек с информацией о геобъекте и возможных действиях*/
export const MapObjectActions = () => {
    const selectedGeoobject = useUnit(mapObjectsModel.$selectedGeoobject);

    if (selectedGeoobject === null) {
        return <h3>Нажмите на геообъект, чтобы редактировать его</h3>;
    }
    return (
        <div>
            {selectedGeoobject != null ? (
                <MapObjectItem
                    key={selectedGeoobject.id}
                    geoObject={selectedGeoobject}
                />
            ) : null}
        </div>
    );
};
