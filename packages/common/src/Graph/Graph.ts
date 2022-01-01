import { v4 as uuid } from 'uuid';

import {GraphStorageType} from "../Network/GraphItemStorage/GraphStorage";
import {GraphObject} from "./GraphObjectBase";
import { BlockStorageType } from "../Network/GraphItemStorage/BlockStorage";
import {Block} from "./Block";
import {Edge, EdgeTypes} from "./Edge";
import {CompXError} from "../Helpers/ErrorHandling";
import {PortStringListType} from "./Port";

type DFSBlockType = { blockId: string, nodeCompletion: "WHITE" | "GRAY" | "BLACK", d: number, f: number };

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
    public GetSourceBlocks(): string[] {
        return this.blocks.filter(b => b.inputPorts.length === 0).map(b => b.id);
    }

    // Gets all sink blocs in the graph (Inputs only)
    public GetSinkBlocks(): string[] {
        return this.blocks.filter(b => b.outputPorts.length === 0).map(b => b.id);
    }

    // Gets all blocks connected to the output of a block
    public GetAdjacentBlocks(blockId: string): string[] {
        return this.edges.filter(e => e.output.blockID === blockId)
            .map(e => e.input.blockID);
    }

    // A depth first search of the graph
    public DFS(startBlock: string): string[] {
        // Construct an array to hold which blocks have been visited
        const visited: boolean[] = Array(this.blocks.length);

        //Create an anonomous function which traverses the graph in a depth wise recursive mannor
        let dfsutil: { (arg0: string, arg1: boolean[]): string[]; (blockId: string, tempVisited: boolean[]): string[]; };
        dfsutil = (blockId: string, tempVisited: boolean[]): string[] => {
            // on the current block, mark the index in visited as visited
            tempVisited[this.blocks.findIndex(b => b.id === blockId)] = true;

            // create a return list of block id's which the current block touches, then push the current block
            let retList: string[] = [];
            retList.push(blockId);

            // Get the blocks adjaccent to the current block and recursivly add the adjacent blocks to the list
            // if the adjacent block has not already been visited
            this.GetAdjacentBlocks(blockId).forEach(adjBlock => {
                if (!tempVisited[this.blocks.findIndex(b => b.id === adjBlock)]) {
                    retList = retList.concat(dfsutil(adjBlock, tempVisited));
                }
            });

            return retList;
        }

        // Start the recursion
        return dfsutil(startBlock, visited);
    }

    // Classifies the types of edges of the graph
    public ClassifyEdges(): { [edgeId: string]: EdgeTypes } {
        // Convert all the blocks to "DFS Blocks" which tracks the node completion start and stop of each block
        const dfsBlocks: DFSBlockType[] = this.blocks.map(b => ({
            blockId: b.id,
            nodeCompletion: "WHITE",
            d: -1, f: -1
        }));

        // Start a counter for the node completion
        let t = 0;

        // Create a recursive function to track the completion of each block
        let dfsVisit: { (arg0: number): void; (index: number): void; };
        dfsVisit = (index: number) => {
            // Set the nodeCompletion as started (GRAY)
            dfsBlocks[index].nodeCompletion = "GRAY";

            // Set the start of the block as t then increase the count
            dfsBlocks[index].d = t;
            t++

            //  For each adjacent block visit each adjacent block if it has not already been started (white)
            this.GetAdjacentBlocks(dfsBlocks[index].blockId)
                .map(b => dfsBlocks.findIndex(b2 => b2.blockId === b))
                .forEach(bInd => {
                    if (dfsBlocks[bInd].nodeCompletion === "WHITE") {
                        dfsVisit(bInd);
                    }
                });

            // Finish off the current block by setting it to compleeted "BLACK"
            // Set its finish position with the counter then increase the counter
            dfsBlocks[index].nodeCompletion = "BLACK";
            dfsBlocks[index].f = t;
            t++;


        }

        // Run through each block and visit it if it has not already been visited
        dfsBlocks.forEach((b, i) => {
            if (b.nodeCompletion === "WHITE") {
                dfsVisit(i);
            }
        });

        // Finally, run through each edge and classify according to the start and stop points
        const retVec: { [edgeId: string]: EdgeTypes } = {};
        this.edges.forEach(e => {
            // Get where each edge leaves and comes back within the dfsblocks
            const outBlock = dfsBlocks.find(b => b.blockId === e.output.blockID)!;
            const inBlock = dfsBlocks.find(b => b.blockId === e.input.blockID)!;

            // Classify
            if (inBlock.d - outBlock.d === 1 || outBlock.f - inBlock.f == 1) {
                retVec[e.id] = "TREE";
            } else if (inBlock.d - outBlock.d < 0 && outBlock.f - inBlock.f < 0) {
                retVec[e.id] = "BACK";
            } else if (inBlock.d - outBlock.d > 0 && outBlock.f - inBlock.f > 0) {
                retVec[e.id] = "FORWARD"
            } else {
                retVec[e.id] = "CROSS";
            }
        });

        // Return the map
        return retVec;
    }

    // Reverse all the edges of the graph
    public Transpose(): Graph {
        const tmpGraphStorage = this.ToStorage();
        tmpGraphStorage.blocks = tmpGraphStorage.blocks.map(block => {
            const tmpBlock = Object.assign({}, block);
            tmpBlock.inputPorts = block.outputPorts;
            tmpBlock.outputPorts = block.inputPorts;

            return tmpBlock;
        });

        tmpGraphStorage.edges = tmpGraphStorage.edges.map(edge => {
            const tmpEdge = Object.assign({},  edge);
            tmpEdge.input = edge.output;
            tmpEdge.output = edge.input;

            return tmpEdge;
        });

        return new Graph(tmpGraphStorage);
    }

    // A function to find all the strongly connected groups of the graph
    public SCC(): string[][] {
        // Create a list to hold visited nodes and the finish order
        const visited: string[] = [];
        const stack: string[] = [];

        // Recursive function to visit all the nodees
        const visit = (blockId: string) => {
            // if a node has not been visited
            if (!visited.includes(blockId)) {
                // push it to the visited list and visit all its neighbors
                visited.push(blockId);
                this.GetAdjacentBlocks(blockId).forEach(adjBlock => {
                    visit(adjBlock);
                });

                // add the block to the stack
                stack.unshift(blockId);
            }
        };

        // visit each node in the graph
        this.blocks.forEach(block => {
            visit(block.id);
        });

        // Second part of function
        // create a new visited list and a list to hold the component groups
        const visited2: string[] = [];
        const retVar: string[][] = [];

        // reverse the graph
        const graphRev = this.Transpose();

        // A new recusive function to visit all the nodes of the stack
        const visit2 = (blockId: string, group: string[] = []) => {
            // if the node hasnt been visited
            if (!visited2.includes(blockId)) {
                // mark it as visited then recursivly visit its neighbors
                visited2.push(blockId);
                graphRev.GetAdjacentBlocks(blockId).forEach(adjBlock => {
                    visit2(adjBlock, group);
                });

                // finally push the block to the group and if the block
                // was not already added to the return var push it
                // this works because of references
                group.unshift(blockId);
                if (!retVar.includes(group)) retVar.push(group);
            }
        }

        // visit each node in the stack
        stack.forEach(s => {
            visit2(s);
        });

        return retVar;
    }

    // Create a graph storage object
    public ToStorage(): GraphStorageType {
        return {
          blocks: this.blocks.map(b => b.ToStorage()),
          edges: this.edges.map(e => e.ToStorage())
        };
    }
}