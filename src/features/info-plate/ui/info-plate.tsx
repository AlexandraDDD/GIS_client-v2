import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { useSearchParams } from 'react-router-dom';
import { useMount } from 'react-use';
import { mapModel } from '../../map';
import type { MapMode } from '../../map/lib/types';
import styles from './info-plate.module.css';

/** Настройки страницы и карты (выбор режима просмотра) */
export const InfoPlate = () => {
    const mapMode = useUnit(mapModel.$mapMode);
    const [searchParams, setSearchParams] = useSearchParams();

    useMount(() => {
        const mapModeFromSearch = searchParams.get('mapMode') as MapMode | null;

        if (mapModeFromSearch) {
            mapModel.setMapMode(mapModeFromSearch);
        }
    });

    /** Сохраняем режим карты в query, чтобы не сбрасывать вкладку при перезагрузке */
    useEffect(() => {
        if (mapMode) {
            setSearchParams({ mapMode });
        }
    }, [mapMode]);

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        mapModel.setMapMode(e.target.value as MapMode);
    };

    const editorPointsOnCorners = useUnit(mapModel.$editorPointsOnCorners);
    const handlePointsOnCornersChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        mapModel.setEditorPointsOnCorners(e.target.checked);
    };

    return (
        <div className={styles.plate}>
            <div className={styles.settings}>
                <label>
                    <span>Режим работы с картой:</span>
                    <select
                        name="map-mode"
                        onChange={handleModeChange}
                        value={mapMode}
                    >
                        <option value="view">
                            Просмотр сохраненных геообьектов
                        </option>
                        <option value="edit">Создание новых геообьектов</option>
                    </select>
                </label>

                {mapMode === 'edit' && (
                    <label>
                        <span>Точки на углах:</span>
                        <input
                            type="checkbox"
                            onChange={handlePointsOnCornersChange}
                            checked={editorPointsOnCorners}
                        />
                    </label>
                )}
            </div>
            {/*    <div className={styles.groupBtns}>
                <Button mix={styles.btn} onClick={() => classifiersModel.setIsNewClassModalOpen(true)}>
                    Создать классификатор
                </Button>
                <Button mix={styles.btn} onClick={() => aspectsModel.setIsNewAspectModalOpen(true)}>
                    Создать аспект
                </Button>
            </div> */}
        </div>
    );
};
