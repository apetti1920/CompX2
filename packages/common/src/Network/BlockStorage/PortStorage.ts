import { PortTypes, PortTypesStringList } from "../../Graph/Port";

export interface PortStorageType<U extends keyof PortTypes> {
    name: string,
    type: U,
    initialValue?: PortTypes[U]
}

export function isPortStorageType<U extends keyof PortTypes>(obj: any): obj is PortStorageType<U> {
    if (typeof obj !== 'object' || Array.isArray(obj)) return false;

    const requiredKeys = ["name", "type"];
    if (!requiredKeys.every(k => k in obj)) return false;

    if (typeof obj['name'] !== "string") return false;
    if (
        typeof obj['type'] !== "string" ||
        !PortTypesStringList.includes(obj['type'] as typeof PortTypesStringList[number])
    ) return false;

    if("initialValue" in obj) {
        switch (obj['type'] as typeof PortTypesStringList[number]) {
            case ("STRING"): {
                if (typeof obj['initialValue'] !== 'string') return false;
                break
            } case ("NUMBER"): {
                if (typeof obj['initialValue'] !== 'number') return false;
                break
            }
        }
    }

    return true;
}