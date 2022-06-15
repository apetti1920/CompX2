import _ from 'lodash';

import {Clamp} from '@compx/common/Helpers/Other';
import {PointType} from '@compx/common/Types';
import {ActionPayloadType, StateType} from "../types";
import {TranslatedCanvasActionType, ZoomedCanvasActionType} from "../actions/actiontypes";

export default function (state: StateType, action: ActionPayloadType): StateType {
    switch (action.type) {
        case (TranslatedCanvasActionType): {
            const tempState  = _.cloneDeep(state);

            const delta: PointType = action.payload['delta']

            // Calculates the new translation by the delta of the movement of the mouse
            tempState.userStorage.canvas.translation =  {
                x: state.userStorage.canvas.translation.x + delta.x,
                y: state.userStorage.canvas.translation.y + delta.y
            };

            return tempState;
        }
        case (ZoomedCanvasActionType): {
            const tempState  = _.cloneDeep(state);

            // Calculate the new zoom with the delta
            const delta: number = action.payload['delta'];

            const newZoom = state.userStorage.canvas.zoom + delta;
            const clampedZoom = Clamp(newZoom, 1/3, 4);

            //Get the zoom around point
            const zoomAround: PointType = action.payload['around'];

            // calculate the new translation about the scale change
            const scaleChange = clampedZoom - state.userStorage.canvas.zoom;
            const newTranslation = {
                x: state.userStorage.canvas.translation.x - (zoomAround.x * scaleChange),
                y: state.userStorage.canvas.translation.y - (zoomAround.y * scaleChange)
            }

            // Set the temp states
            tempState.userStorage.canvas.zoom = clampedZoom;
            tempState.userStorage.canvas.translation = newTranslation;

            return tempState;
        }
        default: {
            return state
        }
    }
}