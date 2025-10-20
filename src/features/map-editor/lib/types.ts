import type { LatLngTuple } from 'leaflet';

/** Базовый тип для объектов редактора (черновая геометрия) */

interface Obj {
    /** Локальный id (генерируется на фронте, у сохранённых объектов используется id с бэка) */
    _id: string;

    selected?: boolean;

    /** Только для чтения — нельзя удалить, но можно выделить */
    readonly?: boolean;
}

export interface EditorPoint extends Obj {
    type: 'Point';
    coordinates: LatLngTuple;
}

export interface EditorPolygon extends Obj {
    type: 'PolyLine';
    coordinates: LatLngTuple[];
}

export interface EditorPolyLine extends Obj {
    type: 'Polygon';
    coordinates: LatLngTuple[];
}

/** Объединённый тип всех объектов редактора */
export type EditorObject = EditorPoint | EditorPolyLine | EditorPolygon;
