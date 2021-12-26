import { v4 as uuid } from 'uuid';

import {GraphStorageType} from "../Network/GraphItemStorage/GraphStorage";
import {GraphObject} from "./GraphObjectBase";
import { BlockStorageType } from "../Network/GraphItemStorage/BlockStorage";
import {Block} from "./Block";
import {Edge} from "./Edge";
import {CompXError} from "../Helpers/ErrorHandling";
import {PortStringListType} from "./Port";

export class Graph implements GraphStorageType, GraphObject<Graph> {
    public blocks: Block<any, any>[];
    public edges: Edge<any>[];

    // Constructs a graph from storage
    public constructor(graph: GraphStorageType) {
        this.blocks = graph.blocks.map(bs => Block.InitializeFromStorageWithId(bs));
        this.edges = graph.edges.map(es => Edge.InitializeFromStorage(es));
    }

    // Function to add a block to the graph
    public AddBlock(block: BlockStorageType<PortStringListType, PortStringListType>): string {
        const newBlock = Block.InitializeFromStorage(block);
        this.blocks.push(newBlock);
        return newBlock.id;
    }

    // Function to remove a block by id
    public RemoveBlock(blockId: string): void | never {
        const blockIndex = this.blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) throw new CompXError("warning",
            "Block Removal Warning", `Block ${blockId} was not found`);

        this.edges.splice(
            this.edges.findIndex(e => e.output.blockID === blockId || e.input.blockID === blockId), 1)
        this.blocks.splice(blockIndex, 1);
    }

    // Function To Add an edge to thee graph
    public AddEdge(outputBlockId: string, outputPortId: string,
                   inputBlockId: string, inputPortId: string): string | never
    {
        // Check if this edge already exists
        const foundInd = this.edges.find(e => e.output.blockID === outputBlockId &&
            e.output.portID === outputPortId && e.input.blockID === inputBlockId &&
            e.input.portID === inputPortId);
        if (foundInd !== undefined) return foundInd.id;

        // Check if the output block exists
        const outputBlockIndex = this.blocks.findIndex(b => b.id === outputBlockId);
        if (outputBlockIndex === -1)
            throw new CompXError(
                "warning", "Add Edge Warning", `Output block ${outputBlockId} not found`);

        // Check if the output port exists
        const outputPortIndex = this.blocks[outputBlockIndex].outputPorts.findIndex(p => p.id === outputPortId);
        if (outputPortIndex === -1)
            throw new CompXError(
                "warning", "Add Edge Warning", `Output port ${outputPortId} not found`);

        // Check if the input block exists
        const inputBlockIndex = this.blocks.findIndex(b => b.id === inputBlockId);
        if (inputBlockIndex === -1)
            throw new CompXError(
                "warning", "Add Edge Warning", `Input block ${inputBlockId} not found`);

        // Check if the input port exists
        const inputPortIndex = this.blocks[inputBlockIndex].inputPorts.findIndex(p => p.id === inputPortId);
        if (inputPortIndex === -1)
            throw new CompXError(
                "warning", "Add Edge Warning", `Input port ${inputPortId} not found`);

        // Check if the port types are compatible
        if (this.blocks[outputBlockIndex].outputPorts[outputPortIndex].type !==
            this.blocks[inputBlockIndex].inputPorts[inputPortIndex].type)
            throw new CompXError(
                "warning",
                "Add Edge Warning",
                `Output port type ${this.blocks[outputPortIndex].outputPorts[outputPortIndex].type} 
                is not the same type as the input ports 
                (${this.blocks[inputBlockIndex].inputPorts[inputPortIndex].type})`
            );

        // Check that only one edge goes to any input
        if (this.edges.findIndex(e => e.input.blockID === inputBlockId && e.input.portID === inputPortId) !== -1)
            throw new CompXError(
                "warning",
                "Edge Add Warning",
                "More than one  edge can not go to the same input port"
            )

        // Add the edge
        const newEdge = Edge.InitializeFromStorage({
            id: uuid(),
            type: this.blocks[outputPortIndex].outputPorts[outputPortIndex].type,
            input: { blockID: inputBlockId, portID: inputPortId },
            output: { blockID: outputBlockId, portID: outputPortId }
        });
        this.edges.push(newEdge);
        return newEdge.id;
    }

    // Function to remove an edge from the graph
    public RemoveEdge(edgeId: string): void | never {
        const edgeIndex = this.edges.findIndex(e => e.id === edgeId);
        if (edgeIndex === -1) throw new CompXError("warning",
            "Edge Removal Warning", `Edge ${edgeId} was not found`);

        this.edges.splice(edgeIndex, 1);
    }

    // Gets the source blocks in the graph (Outputs only)
    public getSourceBlocks(): string[] {
        return this.blocks.filter(b => b.inputPorts.length === 0).map(b => b.id);
    }

    // Gets all sink blocs in the graph (Inputs only)
    public getSinkBlocks(): string[] {
        return this.blocks.filter(b => b.outputPorts.length === 0).map(b => b.id);
    }

    // A depth first search of the graph
    // public DFS(startBlock: string): string[] {
    //     const visited: boolean[] = Array(this.blocks.length);
    //
    // }

    // Gets all blocks connected to the output of a block
    public getAdjacentBlocks(blockId: string): string[] {
        return this.edges.filter(e => e.output.blockID === blockId)
            .map(e => {
                const tmpB = this.blocks.find(b => b.id === e.input.blockID)!
                return tmpB.id
            });
    }

    public ToStorage(): GraphStorageType {
        return {
          blocks: this.blocks.map(b => b.ToStorage()),
          edges: this.edges.map(e => e.ToStorage())
        };
    }
}