import { PortTypes } from "../Graph/Port";

export interface PortStorageType<U extends keyof PortTypes> {
    id: string,
    name: string,
    type: U,
    initialValue?: PortTypes[U]
}

export function isPortStorageType<U extends keyof PortTypes>(obj: any): obj is PortStorageType<U> {
    if (typeof obj !== 'object' || Array.isArray(obj)) return false;

    const requiredKeys = ["id", "name", "type"];
    if (!requiredKeys.every(k => k in obj)) return false;

    if (typeof obj['id'] !== "string") return false;
    if (typeof obj['name'] !== "string") return false;
    return typeof obj['type'] === "string";
}