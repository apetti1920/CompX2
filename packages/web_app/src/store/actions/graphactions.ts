import { MovedBlockActionType } from './actiontypes';
import { PointType } from '@compx/common/Types';
import {ActionPayloadType, ActionType} from "../types";

// Creates the Payload type and action to move a block in a graph
export const MovedBlocksAction: ActionType = (blocks: string[], delta: PointType): ActionPayloadType => ({
    type: MovedBlockActionType,
    payload: {blocks: blocks, delta: delta}
});

