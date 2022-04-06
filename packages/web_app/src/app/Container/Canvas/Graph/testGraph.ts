import { VisualGraphStorageType } from '@compx/common/Network/GraphItemStorage/GraphStorage';
import { VisualBlockStorageType } from '@compx/common/Network/GraphItemStorage/BlockStorage';

function getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function CreateBlock(id: string, name: string): VisualBlockStorageType<any, any> {
    return { id: id, visualName: name, name: name, inputPorts: [], outputPorts: [], callbackString: "",
        tags: [], description: "", mirrored: false, position: {x: getRandom(-100.0, 100.0), y: getRandom(-100.0, 100.0)},
        size: {x: 150, y: 105}, shape: "rect"}
}

export function MakeVisualGraph(): VisualGraphStorageType {
    const blocks = Array(5).fill("const").map((x, i) => CreateBlock(i.toString(), x));
    console.log(blocks);

    return {
        blocks: blocks
    }
}