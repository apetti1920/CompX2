import { EdgePointType, EdgeStorageType } from "../Network/GraphItemStorage";
import {PortTypes} from "./Port";
import {GraphObject} from "./index";

export class Edge<U extends keyof PortTypes> implements EdgeStorageType<U>, GraphObject<Edge<U>>{
    public type: U;
    public input: EdgePointType;
    public output: EdgePointType;

    private constructor(edgeType: U, input: EdgePointType, output: EdgePointType) {
        this.type = edgeType;
        this.input = input;
        this.output = output;
    }

    ToStorage(): EdgeStorageType<U> {
        return this
    }
}