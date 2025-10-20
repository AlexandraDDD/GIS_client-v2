import React from 'react';
import { Popup } from 'react-leaflet';
import { useUnit } from 'effector-react';
import { Button } from '../../../../shared/ui/button';
import { mapModel } from '../../../map';
import type { EditorObject } from '../../lib/types';
import { editorModel } from '../../lib/editor.model';
import styles from './map-editor-popup.module.css';

interface Props {
    object: EditorObject;
}

/** Рендерит всплывающий попап для черновых объектов */
export const MapEditorPopup = (props: Props) => {
    return (
        <Popup>
            <Content {...props} />
        </Popup>
    );
};

/** Содержимое попапа (монтируется только когда попап открыт) */
const Content = ({ object }: Props) => {
    const { _id, type, readonly } = object;

    /** Инстанс карты для закрытия попапа по клику на кнопки */
    const map = useUnit(mapModel.$map);

    /** Снять выделение объекта и закрыть попап */
    const handleRemoveSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        map?.closePopup();
        editorModel.toggleObjectSelect(_id);
    };

    /** Удалить объект (если не readonly) */
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        editorModel.deleteObject(_id);
    };

    return (
        <>
            <h3>
                {type} : {_id}
            </h3>

            {readonly && (
                <span className={styles.readonly}>
                    Это readonly точка для создания границ
                </span>
            )}

            <div className={styles.btns}>
                <Button /* onClick={handleModalFormOpen} */>
                    Создать геообъект - not ready
                </Button>

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
