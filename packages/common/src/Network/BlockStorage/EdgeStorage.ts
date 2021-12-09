import {PortTypes} from "../../Graph/Port";

export type EdgePointType = { blockID: string; portID: string; };
export interface EdgeStorage<U extends keyof PortTypes> {
    edgeType: U;
    input: EdgePointType;
    output: EdgePointType;
}