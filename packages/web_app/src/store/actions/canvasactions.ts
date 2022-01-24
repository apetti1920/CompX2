import { TranslatedCanvasActionType, ZoomedCanvasActionType } from './actiontypes';
import { PointType } from '@compx/common/Types';
import { ActionPayloadType, ActionType } from "../types";

// Creates the Payload type and action to translate the canvas by a delta
export const TranslatedCanvasAction: ActionType = (delta: PointType): ActionPayloadType => ({
    type: TranslatedCanvasActionType,
    payload: {delta: delta}
});

// Creates the Payload type and action to translate the canvas by a delta
export const ZoomedCanvasAction = (delta: number, around: PointType): ActionPayloadType => ({
    type: ZoomedCanvasActionType,
    payload: { delta: delta, around: around }
});