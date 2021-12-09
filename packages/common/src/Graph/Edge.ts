import {EdgePointType, EdgeStorage} from "../Network/BlockStorage/EdgeStorage";
import {PortTypes} from "./Port";

class Edge<U extends keyof PortTypes> {
    public edgeType: U;
    public input: EdgePointType;
    public output: EdgePointType;

    private constructor(edgeType: U, input: EdgePointType, output: EdgePointType) {
        this.edgeType = edgeType;
        this.input = input;
        this.output = output;
    }


}