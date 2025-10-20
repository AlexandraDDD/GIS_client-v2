import React from 'react';
import { Popup } from 'react-leaflet';
import { useUnit } from 'effector-react';

import {
    GEO_OBJECT_STATUS,
    type GeoObject,
    type GeometryGeoJSON,
    getCenterByCoords,
} from '../../../../entities/geoobject';
import { mapModel } from '../../../map';
import { useTimezoneAndLocalTime } from '../../../../shared/lib/time';
import { TextWithCopy } from '../../../../shared/ui/text-with-copy';

import styles from './map-object-popup.module.css';
import { Button } from '../../../../shared/ui/button';
import { ProxyGeoSystemSummary } from '../../../../entities/geoobject/model/types';
import { isProxyGeoSystem } from '../../../../utils/IsProxyGeosystem';

interface Props {
    object: GeoObject | ProxyGeoSystemSummary;
    geometry?: GeometryGeoJSON;
    isProxy: boolean;
    /**
     * Попап не анмаунтится автоматически, поэтому костылим это сами,
     * иначе будет запущено очень много интервалов и начнутся лаги
     */
    visible: boolean;
}

/** Рендерит попап с описанием для геообьектов на карте */
export const MapObjectPopup = (props: Props) => {
    if (props.isProxy) return null;
    return <Popup>{props.visible && <Content {...props} />}</Popup>;
};

/** Выделяем отдельно, чтобы не рендерить, пока попап скрыт */
const Content = ({ object }: Props) => {
    if (!isProxyGeoSystem(object)) return null;
    const { id, name } = object;

    const handleTransition = (ProxyGeoObject: ProxyGeoSystemSummary) => {
        console.log('функци перехода ( не готово)');
    };

    return (
        <>
            <h3 className={styles.title}>{name}</h3>
            <TextWithCopy title="id" text={id} />

            <div className={styles.content}>
                <Button
                    mix={styles.btn}
                    onClick={() => handleTransition(object)}
                >
                    Перейти к геосистеме
                </Button>
            </div>
        </>
    );
};
