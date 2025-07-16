import React from 'react';
import { useUnit } from 'effector-react';
import cx from 'classnames';
import { Spoiler } from '../../../../shared/ui/spoiler';
import { TextWithCopy } from '../../../../shared/ui/text-with-copy';
import { Button } from '../../../../shared/ui/button';
import { getGeometry, type GeoObject } from '../../../../entities/geoobject';

import styles from './map-object-description.module.css';
import { ProxyGeoSystemSummary } from '../../../../entities/geoobject/model/types';

interface MapObjectDescriptionProps {
    geoObject: GeoObject | ProxyGeoSystemSummary;
}

export const MapObjectDescription = ({
    geoObject,
}: MapObjectDescriptionProps) => {
    /*     const uniqueAspects = useUnit(aspectsModel.$uniqueAspects);

    const geoobjectClassifiers = geoObject.geoObjectInfo?.classifiers;

    const geoobjectTopologies = useUnit(topologyModel.$topologies).filter(
        ({ geographicalObjectInId, geographicalObjectOutId }) =>
            geographicalObjectInId === geoObject.id || geographicalObjectOutId === geoObject.id,
    );

    const geoobjectAspects = useUnit(aspectsModel.$assignedAspects).filter(
        ({ geographicalObjectId }) => geographicalObjectId === geoObject.id,
    );
 */
    const geometry = getGeometry(geoObject);
    if (!geometry) {
        return <h3>Ошибка: выбран обьект с неизвестной геометрией</h3>;
    }

    /*    const handleAddClassFormOpen = () => geoObjectFormModel.setIsUpdateModalOpen(true);

    const handleTopologyFormOpen = () => geoObjectFormModel.setIsTopologyFormOpen(true);

    const handleAspectsFormOpen = () => geoObjectFormModel.setIsAssignAspectModalOpen(true);
    const handleNewAspectFormOpen = () => aspectsModel.setIsNewAspectModalOpen(true); */

    return (
        <>
            <h3 className={styles.title}>
                {geometry.type}: {geoObject.name}
            </h3>
            <TextWithCopy title="ID" text={geoObject.id} />

            {/*             <Spoiler mix={styles.spoiler} title="Классификаторы" badgeText="К">
                {geoobjectClassifiers?.length ? (
                    <div className={styles.spoilerList}>
                        {geoobjectClassifiers.map(({ id, code, commonInfo }) => (
                            <div key={id} className={styles.class}>
                                <TextWithCopy title="id" text={id} />
                                <TextWithCopy title="code" text={code} />
                                <p className={styles.listItem}>{commonInfo}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noObject}>Классификаторов пока нет</div>
                )}

                  <Button mix={styles.btn} onClick={handleAddClassFormOpen}>
                    Добавить обьекту классификатор
                </Button>
            </Spoiler>

            <Spoiler mix={styles.spoiler} title="Аспекты" badgeText="А">
                {geoobjectAspects.length ? (
                    <div className={styles.spoilerList}>
                        {geoobjectAspects.map(({ id, code, commonInfo, endPoint }) => (
                            <div key={id} className={styles.class}>
                                <TextWithCopy title="id связи" text={id} />
                                <TextWithCopy title="code аспекта" text={code} />
                                <p className={cx(styles.listItem, styles.aspectInfo)}>{commonInfo}</p>

                                <p className={cx(styles.listItem, styles.endPoint)}>{endPoint}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noObject}>Аспектов пока нет</div>
                )}

                {uniqueAspects.length ? (
                    <Button mix={styles.btn} onClick={handleAspectsFormOpen}>
                        Добавить обьекту аспект
                    </Button>
                ) : (
                    <Button mix={styles.btn} onClick={handleNewAspectFormOpen}>
                        Создать новый аспект
                    </Button>
                )}
            </Spoiler>

            <Spoiler mix={styles.spoiler} title="Топологии" badgeText="Т">
                {geoobjectTopologies.length ? (
                    <div className={styles.spoilerList}>
                        {geoobjectTopologies.map((topology) => (
                            <TopologyDescription key={topology.id} topology={topology} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.noObject}>Топологий пока нет</div>
                )}

                <Button mix={styles.btn} onClick={handleTopologyFormOpen}>
                    Добавить топологию
                </Button>
            </Spoiler>
            {childGeoObjects && childGeoObjects?.length > 0 ? (
                <Spoiler mix={styles.spoiler} title="Дети" badgeText="Д" color="gray">
                    <div className={styles.classes}>
                        {childGeoObjects.map((child) =>
                            child ? (
                                <div key={child.id} className={styles.class}>
                                    <TextWithCopy title="id" text={child.id} />
                                    <p className={styles.classInfo}> {child.name}</p>
                                </div>
                            ) : null,
                        )}
                    </div>
                </Spoiler>
            ) : (
                <div className={styles.noObject}>Нет дочерних элементов</div>
            )}
            {parentGeoObjects && parentGeoObjects.length > 0 ? (
                <Spoiler mix={styles.spoiler} title="Родители" badgeText="Р" color="gray">
                    <div className={styles.classes}>
                        {parentGeoObjects.map((parent) =>
                            parent ? (
                                <div key={parent.id} className={styles.class}>
                                    <TextWithCopy title="id" text={parent.id} />
                                    <p className={styles.classInfo}> {parent.name}</p>
                                </div>
                            ) : null,
                        )}
                    </div>
                </Spoiler>
            ) : (
                <div className={styles.noObject}>Нет родительских элементов</div>
            )} */}
        </>
    );
};
