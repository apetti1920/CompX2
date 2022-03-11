import _ from 'lodash';

import {ActionPayloadType, StateType} from "../types";
import { MovedBlockActionType } from "../actions/actiontypes";
import { PointType } from '@compx/common/Types';

export default function (state: StateType, action: ActionPayloadType): StateType {
    switch (action.type) {
        case (MovedBlockActionType): {
            const tempState  = _.cloneDeep(state);

            // Get Variables
            const blocks: string[] = action.payload['blocks'];
            const delta: PointType = action.payload['delta'];

            // Loop through to change position of all the selected blocks
            for (let i=0; i<tempState.currentGraph.blocks.length; i++) {
                if (blocks.includes(tempState.currentGraph.blocks[i].id)) {
                    tempState.currentGraph.blocks[i].position = {
                        x: tempState.currentGraph.blocks[i].position.x + delta.x / (state.userStorage.canvas.zoom),
                        y: tempState.currentGraph.blocks[i].position.y + delta.y / (state.userStorage.canvas.zoom),
                    }
                }
            }

            return tempState;
        } default: {
            return state
        }
    }
}