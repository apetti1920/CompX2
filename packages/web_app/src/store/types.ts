import { VisualGraphStorageType } from '@compx/common/Network/GraphItemStorage/GraphStorage';
import { PointType } from '@compx/common/Types'
import {ThemeType} from "../types";
import DarkTheme from "../theme/DarkTheme";

export type StateType = {
    currentGraph: VisualGraphStorageType,
    userStorage: {
        theme: ThemeType,
        canvas: {
            zoom: number,
            translation: PointType
        }
    }
};

export const defaultState: StateType = {
    currentGraph: { blocks: [] },
    userStorage: {
        theme:  DarkTheme,
        canvas: {
            zoom: 1,
            translation: { x: 0.0, y: 0.0 }
        }
    }
}

export type ActionPayloadType = { type: string, payload: {[key: string]: any} }
export type ActionType = (...args: any) => ActionPayloadType;