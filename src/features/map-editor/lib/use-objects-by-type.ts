import { useUnit } from 'effector-react';

import { editorModel } from './editor.model';
import type { EditorObject } from './types';

/** Возвращает выбранные обьекты списком! */
export const useSelectedObjectsByType = (objectType: EditorObject['type']) => {
    const selectedObjects = useUnit(editorModel.$selectedObjects);

    return Object.values(selectedObjects).filter(({ type }) => type === objectType);
};

export const useObjectsByType = (objectType: EditorObject['type']) => {
    const selectedObjects = useUnit(editorModel.$objects);

    return Object.values(selectedObjects).filter(({ type }) => type === objectType);
};
