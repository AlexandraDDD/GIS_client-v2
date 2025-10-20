import React from 'react';
import { useUnit } from 'effector-react';
import { mapObjectsModel } from '../../lib/map-objects.model';
import { geoObjectModel } from '../../../../entities/geoobject';
import { MapObjectItem } from '../object-actions/object-actions';
import { mapModel } from '../../../map';
import { MapObjectAvailableItem } from '../AvailableGeoSystems/avail-object-actions/avail-object-actions';

/** Рендерит список карточек с информацией о геобъекте и возможных действиях */
export const MapObjectActions = () => {
    const selectedGeoobject = useUnit(mapObjectsModel.$selectedGeoobject);
    const geoobjects = useUnit(geoObjectModel.$availableGeoObjects);

    return (
        <div>
            {selectedGeoobject != null ? (
                <MapObjectItem
                    key={selectedGeoobject.id}
                    geoObject={selectedGeoobject}
                />
            ) : null}

            {selectedGeoobject === null && geoobjects != null
                ? geoobjects.map((geoobject) => (
                      <MapObjectAvailableItem
                          key={geoobject.id}
                          geoObject={geoobject}
                      />
                  ))
                : null}
        </div>
    );
};
