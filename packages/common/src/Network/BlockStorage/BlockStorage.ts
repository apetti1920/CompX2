import { isPortStorageType } from "./PortStorage";
import { PortStringListType } from "../../Graph/Port";
import { MapStringsToPortStoragesType } from "../../Graph/Block";

export type BlockStorageType<
    Inputs extends PortStringListType, Outputs extends PortStringListType
> = {
    name: string,
    description: string,
    tags: string[]
    inputPorts: MapStringsToPortStoragesType<Inputs>,
    outputPorts: MapStringsToPortStoragesType<Outputs>,
    callbackString: string
}

export function isBlockStorageType<
    Inputs extends PortStringListType,
    Outputs extends PortStringListType
>(obj: any): obj is BlockStorageType<PortStringListType, PortStringListType> {
    if (typeof obj !== 'object' || Array.isArray(obj)) return false;

    const requiredKeys = ["name", "description", "tags", "inputPorts", "outputPorts", "callbackString"];
    if (!requiredKeys.every(k => k in obj)) return false;

    if (typeof obj['name'] !== 'string') return false;
    if (typeof obj['description'] !== "string") return false;
    if (!Array.isArray(obj['tags']) || !obj['tags'].every(t => typeof t === 'string')) return false;
    if (!Array.isArray(obj['inputPorts']) || !obj['inputPorts'].every(p => isPortStorageType(p))) return false;
    if (!Array.isArray(obj['outputPorts']) || !obj['outputPorts'].every(p => isPortStorageType(p))) return false;
    if (typeof obj["callbackString"] !== "string") return false;

    return true;
}