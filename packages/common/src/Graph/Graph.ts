import { v4 as uuid } from 'uuid';

import {GraphStorageType} from "../Network/GraphItemStorage/GraphStorage";
import {GraphObject} from "./GraphObjectBase";
import { BlockStorageType } from "../Network/GraphItemStorage/BlockStorage";
import {Block} from "./Block";
import {Edge} from "./Edge";
import {CompXError} from "../Helpers/ErrorHandling";

export class Graph implements GraphStorageType, GraphObject<any> {
    public blocks: Block<any, any>[];
    public edges: Edge<any>[];

    // Contructs a graph from storage
    public constructor(graph: GraphStorageType) {
        this.blocks = graph.blocks.map(bs => {
           const tempBlock = Block.InitializeFromStorage(bs);
           tempBlock.id = bs.id;
           return tempBlock;
        });
        this.edges = graph.edges.map(es => Edge.InitializeFromStorage(es));
    }

    // Function to add a block to the graph
    public AddBlock(block: BlockStorageType<any, any>): void {
        this.blocks.push(Block.InitializeFromStorage(block));
    }

    // Function To Add an edge to thee graph
    public AddEdge(outputBlockId: string, outputPortId: string,
                   inputBlockId: string, inputPortId: string): void | never
    {
        if (this.edges.findIndex(e => e.output.blockID === outputBlockId &&
            e.output.portID === outputPortId && e.input.blockID === inputBlockId &&
            e.input.portID === inputPortId) !== -1
        ) return;

        const outputBlockIndex = this.blocks.findIndex(b => b.id === outputBlockId);
        if (outputBlockIndex === -1)
            throw new CompXError(
                "warning", "Add Edge Warning", `Output block ${outputBlockId} not found`);

        const outputPortIndex = this.blocks[outputBlockIndex].outputPorts.findIndex(p => p.id === outputPortId);
        if (outputPortIndex === -1)
            throw new CompXError(
                "warning", "Add Edge Warning", `Output port ${outputPortId} not found`);

        const inputBlockIndex = this.blocks.findIndex(b => b.id === inputBlockId);
        if (inputBlockIndex === -1)
            throw new CompXError(
                "warning", "Add Edge Warning", `Input block ${inputBlockId} not found`);

        const inputPortIndex = this.blocks[inputBlockIndex].inputPorts.findIndex(p => p.id === inputPortId);
        if (inputPortIndex === -1)
            throw new CompXError(
                "warning", "Add Edge Warning", `Input port ${inputPortId} not found`);

        if (this.blocks[outputPortIndex].outputPorts[outputPortIndex].type !==
            this.blocks[inputPortIndex].inputPorts[inputPortIndex].type)
            throw new CompXError(
                "warning",
                "Add Edge Warning",
                `Output port type ${this.blocks[outputPortIndex].outputPorts[outputPortIndex].type} 
                is not the same type as the input ports 
                (${this.blocks[inputPortIndex].inputPorts[inputPortIndex].type})`
            );

        this.edges.push(Edge.InitializeFromStorage({
            id: uuid(),
            type: this.blocks[outputPortIndex].outputPorts[outputPortIndex].type,
            input: { blockID: inputBlockId, portID: inputPortId },
            output: { blockID: outputBlockId, portID: outputPortId }
        }));
    }

    public ToStorage(): GraphStorageType {
        return {
          blocks: this.blocks,
          edges: this.edges
        };
    }
}