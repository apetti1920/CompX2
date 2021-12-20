import {BlockStorageWithIDType, isBlockStorageWithIDType} from "./BlockStorage";
import {EdgeStorageType, isEdgeStorageType} from "./EdgeStorage";

export interface GraphStorageType {
    blocks: BlockStorageWithIDType<any, any>[],
    edges: EdgeStorageType<any>[]
}

export function isGraphStorageType(obj: any): obj is GraphStorageType {
    if (typeof obj !== 'object' || Array.isArray(obj)) return false;

    const requiredKeys = ["blocks", "edges"];
    if (!requiredKeys.every(k => k in obj)) return false;

    if (!Array.isArray(obj['blocks']) || !obj['blocks'].every(b => isBlockStorageWithIDType(b))) return false;
    if (!Array.isArray(obj['edges']) || !obj['edges'].every(b => isEdgeStorageType(b))) return false;

    return true;
}