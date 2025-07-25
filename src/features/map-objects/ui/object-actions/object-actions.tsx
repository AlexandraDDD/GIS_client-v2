import React from 'react';
import { useUnit } from 'effector-react';
import { Button } from '../../../../shared/ui/button';

import { MapObjectDescription } from '../map-object-description/map-object-description';
import {
    GeoObject,
    geoObjectModel,
    getGeometry,
} from '../../../../entities/geoobject';
import styles from './object-actions.module.css';
import { mapObjectsModel } from '../../lib/map-objects.model';
import { mapModel } from '../../../../entities/map';
import { editorModel } from '../../../map-editor/lib/editor.model';
import {
    GeoObjectGeometryPatch,
    ProxyGeoSystemSummary,
} from '../../../../entities/geoobject/model/types';
import { isProxyGeoSystem } from '../../../../utils/IsProxyGeosystem';
import { toast } from 'react-toastify';

interface MapObjectItemProps {
    geoObject: GeoObject | ProxyGeoSystemSummary;
}

export const handleZoom = (geoObject: GeoObject | ProxyGeoSystemSummary) => {
    const currentZoomedObject = mapObjectsModel.$zoomedObject.getState();

    if (currentZoomedObject?.id === geoObject.id) {
        // Объект тот же, вызываем событие для перезума
        mapObjectsModel.triggerZoom();
    } else {
        // Устанавливаем новый зум-объект
        mapObjectsModel.setZoomedObject(geoObject);
    }
};

export const MapObjectItem: React.FC<MapObjectItemProps> = ({ geoObject }) => {
    const mapMode = useUnit(mapModel.$mapMode);
    const mapEditable = mapMode === 'edit';
    const isClippingMode = useUnit(mapModel.$isClippingMode);
    console.log(geoObject);

    const isGeometryEditMode = useUnit(mapModel.$isGeometryEditMode);
    const editedGeometry = useUnit(mapModel.$editedGeometry);

    const isProxy = isProxyGeoSystem(geoObject);
    if (isProxy) {
        console.log('proxy');
    }
    /*     const handleUpdateModalFormOpen = () => {
        geoObjectFormModel.setSelectedObjectToEdit(geoObject);
        geoObjectFormModel.setIsUpdateModalOpen(true);
    };

    const handleChildModalFormOpen = () => {
        geoObjectFormModel.setSelectedObjectToEdit(geoObject);
        geoObjectFormModel.setIsChildModalOpen(true);
    };

    const handleDelete = async (geoObject: GeoObject) => {
        await mapObjectsModel.removeSelectedGeoobject(geoObject);
        await geoObjectModel.deleteGeoObjectFx(geoObject.id);

    }; */

    const handleUnSelect = async () => {
        await mapObjectsModel.removeSelectedGeoobject();
    };

    const handleClipping = (geoObject: GeoObject) => {
        if (!isClippingMode) {
            handleZoom(geoObject);
            mapModel.setEditorPointsOnCorners(false);
            editorModel.setClippedObject(geoObject);
        } else {
            editorModel.setClippedObject(null);
        }
        mapModel.setClippingMode(!isClippingMode);
    };
    /*     const handleDescription = (geoObject: GeoObject) => {
        geoObjectFormModel.setSelectedObjectToEdit(geoObject);

        mapModel.setDescriptionMode(true)
    }; */
    const handleTransition = (ProxyGeoObject: ProxyGeoSystemSummary) => {
        console.log('функци перехода ( не готово)');
    };
    const toggleEditGeometry = () => {
        if (!isGeometryEditMode) {
            const geometry = getGeometry(geoObject);
            if (geometry) {
                mapModel.setEditedGeometry(geometry);
            } else {
                toast('Невозможно получить данные о геометрии', {
                    type: 'error',
                });
                return;
            }
        }
        mapModel.toggleGeometryEditMode();
    };
    const handleSaveGeometry = () => {
        if (!editedGeometry || !geoObject) return;

        // Здесь потом будет запрос на сервер
        console.log('Сохраняем геометрию:', editedGeometry);

        const coords = JSON.stringify(editedGeometry.coordinates);
        if (!editedGeometry.coordinates.length) {
            toast('Геометрия пуста', { type: 'error' });
            return;
        }

        const GeoSystemGeometryPathBody: GeoObjectGeometryPatch = {
            id: geoObject.id,
            geometry: {
                ...geoObject.geometry,
                border: coords,
            },
        };

        geoObjectModel.patchGeoSystemGeometryFx(GeoSystemGeometryPathBody);
        // После успешного сохранения:
        mapModel.resetEditedGeometry();
        mapModel.toggleGeometryEditMode();
    };
    return (
        <div className={styles.wrapper}>
            <MapObjectDescription geoObject={geoObject} />
            {isGeometryEditMode ? (
                <div className={styles.btns}>
                    <Button
                        mix={styles.btn}
                        onClick={() => handleSaveGeometry()}
                        color="violet"
                    >
                        Сохранить изменения
                    </Button>
                    <Button
                        mix={styles.btn}
                        onClick={() => toggleEditGeometry()}
                    >
                        Выйти
                    </Button>

                    <p> Удалить точку ( Shift + клик на маркер )</p>
                    <p> Добавить точку во внтуренний контур ( Alt + клик )</p>
                    <p> Добавить внутренний контур ( Ctrl + клик )</p>
                </div>
            ) : (
                <div className={styles.btns}>
                    <Button
                        mix={styles.btn}
                        onClick={() => handleUnSelect()}
                        color="violet"
                    >
                        Снять выделение
                    </Button>
                    <Button
                        mix={styles.btn}
                        onClick={() => handleZoom(geoObject)}
                    >
                        Приблизить
                    </Button>
                    {isProxy && (
                        <Button
                            mix={styles.btn}
                            onClick={() => handleTransition(geoObject)}
                        >
                            !Переход к геосистеме!
                        </Button>
                    )}
                    {!isProxy && (
                        <Button
                            mix={styles.btn}
                            onClick={() => toggleEditGeometry()}
                        >
                            Редактировать геометрию
                        </Button>
                    )}

                    {/*   {mapEditable &&
                    <Button mix={styles.btn} onClick={() => handleClipping(geoObject)}>
                        {isClippingMode ? 'Отключить редактор' : 'Редактировать местность'}
                    </Button>
                }

                <Button mix={styles.btn} onClick={handleUpdateModalFormOpen}>
                    Изменить геообъект
                </Button>
                <Button mix={styles.btn} onClick={handleChildModalFormOpen}>
                    Создать дочерний геообъект
                </Button>
                <Button mix={styles.btn} onClick={() => handleDelete(geoObject)} color="orange">
                    Удалить
                </Button> */}
                </div>
            )}
        </div>
    );
};
