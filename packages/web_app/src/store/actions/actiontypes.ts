import {GraphReducerName, CanvasReducerName} from './actionnames';

// Graph Reducer Strings
export const MovedBlockActionType = `@@${GraphReducerName}/MOVED_BLOCK`;

// Canvas Reducer Strings
export const TranslatedCanvasActionType = `@@${CanvasReducerName}/TRANSLATED_CANVAS`;
export const ZoomedCanvasActionType     = `@@${CanvasReducerName}/ZOOMED_CANVAS`;