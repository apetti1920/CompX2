import { VisualGraphStorageType } from '@compx/common/Network/GraphItemStorage/GraphStorage';
import { PointType } from '@compx/common/Types'

export type StateType = {
    currentGraph: VisualGraphStorageType,
    userStorage: {
        canvas: {
            zoom: number,
            translation: PointType
        }
    }
};

export const defaultState: StateType = {
    currentGraph: { blocks: [] },
    userStorage: {
        canvas: {
            zoom: 1,
            translation: { x: 0.0, y: 0.0 }
        }
    }
}

export type ActionPayloadType = { type: string, payload: {[key: string]: any} }
export type ActionType = (...args: any) => ActionPayloadType;