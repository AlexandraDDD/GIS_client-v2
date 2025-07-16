import React from 'react';
import { Popup } from 'react-leaflet';
import { useUnit } from 'effector-react';

import { Button } from '../../../../shared/ui/button';
import { mapModel } from '../../../../entities/map';

import type { EditorObject } from '../../lib/types';
import { editorModel } from '../../lib/editor.model';

import styles from './map-editor-popup.module.css';

interface Props {
    object: EditorObject;
}

/** Рендерит попап для черновиковых обьектов на карте */
export const MapEditorPopup = (props: Props) => {
    return (
        <Popup>
            <Content {...props} />
        </Popup>
    );
};

/** Выделяем отдельно, чтобы не рендерить, пока попап скрыт */
const Content = ({ object }: Props) => {
    const { _id, type, readonly } = object;

    //

    const map = useUnit(mapModel.$map);

    const handleRemoveSelect = (e: React.MouseEvent) => {
        e.stopPropagation();

        map?.closePopup();
        editorModel.toggleObjectSelect(_id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        editorModel.deleteObject(_id);
    };

    /*     const handleModalFormOpen = () => {

        geoObjectFormModel.setSelectedEditorObject(object);

        geoObjectFormModel.setIsGeoObjectModalOpen(true);
    }; */

    /*     const selectedAspect = useUnit(mapModel.$mapAspect);
        const handleModalAspectsOpen = () => {
           geoObjectFormModel.setSelectedEditorObject({ _id, type });
            geoObjectFormModel.setIsAspectsModalOpen(true);
        }; */

    return (
        <>
            <h3>
                {type} : {_id}
            </h3>
            {readonly && <span className={styles.readonly}>Это readonly точка для создания границ</span>}

            <div className={styles.btns}>
                <Button /* onClick={handleModalFormOpen} */>Создать геообъект - not ready</Button>

                <Button onClick={handleRemoveSelect}>Снять выделение</Button>
                {!readonly && (
                    <Button onClick={handleDelete} color="orange">
                        Удалить
                    </Button>
                )}
            </div>
        </>
    );
};
