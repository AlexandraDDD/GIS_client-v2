/**
 * Компонент карточки доступных в начале геообъектов с действиями (выбор, зум и т.д.)
 */
import React from 'react';
import { useUnit } from 'effector-react';
import { Button } from '../../../../../shared/ui/button';
import { MapObjectDescription } from '../../map-object-description/map-object-description';
import {
    GeoObject,
    geoObjectModel,
    getGeometry,
} from '../../../../../entities/geoobject';
import { mapObjectsModel } from '../../../lib/map-objects.model';
import { ProxyGeoSystemSummary } from '../../../../../entities/geoobject/model/types';
import styles from './avail-object-actions.module.css';

interface MapObjectItemProps {
    geoObject: GeoObject;
}

/** Устанавливает объект для зума; если тот же — триггерит перезум */
export const handleZoom = (geoObject: GeoObject | ProxyGeoSystemSummary) => {
    const currentZoomedObject = mapObjectsModel.$zoomedObject.getState();

    if (currentZoomedObject?.id === geoObject.id) {
        mapObjectsModel.triggerZoom();
    } else {
        mapObjectsModel.setZoomedObject(geoObject);
    }
};

/** Карточка доступного геообъекта с действиями (выбор, зум) */
export const MapObjectAvailableItem: React.FC<MapObjectItemProps> = ({
    geoObject,
}) => {
    /** Установить текущий выбранный геообъект */
    const handleTransition = () => {
        geoObjectModel.setGeoObject(geoObject);
    };

    /** Текущий выбранный объект из стора */
    const selected = useUnit(geoObjectModel.$geoObject);
    const isSelected = selected?.id === geoObject.id;

    /** Геометрия для проверки доступности действий */
    const geometry = getGeometry(geoObject);

    return (
        <div
            className={`${styles.wrapper} ${isSelected ? styles.selected : ''}`}
        >
            <MapObjectDescription geoObject={geoObject} />

            {geometry && !isSelected && (
                <div className={styles.btns}>
                    <Button mix={styles.btn} onClick={handleTransition}>
                        Выбрать геосистему
                    </Button>
                </div>
            )}
        </div>
    );
};
