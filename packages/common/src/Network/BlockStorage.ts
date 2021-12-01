import { PortTypes } from "../Graph/Port";

export interface PortStorageType<U extends keyof PortTypes> {
    id: string,
    name: string,
    type: U,
    initialValue?: PortTypes[U]
}

// export function isPortStorageType(obj: any): obj is PortStorageType {
//     if (typeof obj !== 'object' || Array.isArray(obj)) return false;
//
//     const requiredKeys = ["id", "name", "type"];
//     if (!requiredKeys.every(k => k in obj)) return false;
//
//     if (typeof obj['id'] !== "string") return false;
//     if (typeof obj['name'] !== "string") return false;
//     if (typeof obj['type'] !== "string" || !PortTypeStrings.includes(obj['type'] as PortTypes)) return false;
//     if ("initialValue" in obj) {
//         if (typeof obj['initialValue'] !== obj['type']) return false;
//     }
//
//     return true;
// }