import _ from 'lodash';

import {BlockStorageType, BlockStorageWithIDType} from "../Network/GraphItemStorage/BlockStorage";
import {PortStorageType, PortStorageWithIDType} from "../Network/GraphItemStorage/PortStorage";
import {Port, PortStringListType, PortTypes} from "./Port";
import { v4 as uuidV4 } from "uuid";
import { CompXError } from "../Helpers/ErrorHandling";
import { GraphObject } from "./GraphObjectBase";
import {ReplaceInTuple} from "../Helpers/Types";

export type MapStringsToPortStoragesType<T extends PortStringListType> =
    { [K in keyof T]: T[K] extends PortStringListType[number] ? PortStorageType<T[K]> : never };
export type MapStringsToPortStoragesWithIDType<T extends PortStringListType> =
    { [K in keyof T]: T[K] extends PortStringListType[number] ? PortStorageWithIDType<T[K]> : never };
export type MapStringsToPortsType<T extends PortStringListType> =
    { [K in keyof T]: T[K] extends PortStringListType[number] ? Port<T[K]> : never };
export type MapStringsToTypes<T extends PortStringListType> =
    { [K in keyof T]: T[K] extends PortStringListType[number] ? PortTypes[T[K]] : never };

type Callback<Inputs extends PortStringListType, Outputs extends PortStringListType> = (
    t: number, dt: number, prevInputs: MapStringsToTypes<Inputs>,
    prevOutputs: MapStringsToTypes<Outputs>, newInputs: MapStringsToTypes<Inputs>
) => MapStringsToTypes<Outputs>;

export class Block<Inputs extends PortStringListType, Outputs extends PortStringListType>
    implements Omit<BlockStorageType<Inputs, Outputs>, "callbackString">, GraphObject<Block<Inputs, Outputs>>
{
    id: string;
    public name: string;
    public description: string;
    public tags: string[];
    public inputPorts: MapStringsToPortsType<Inputs>;
    public outputPorts: MapStringsToPortsType<Outputs>;
    private _callbackString: string;
    private _callback?: Callback<Inputs, Outputs>;

    // hide the constructor from view
    private constructor(name: string, description: string, tags: string[],
                        inputPorts: MapStringsToPortStoragesType<Inputs>,
                        outputPorts: MapStringsToPortStoragesType<Outputs>,
                        callbackString: string)
    {
        this.id = uuidV4();
        this.name = name;
        this.description = description;
        this.tags = tags;
        this.inputPorts =
            inputPorts.map(i => Port.InitializeFromStorage(i, this.id)) as unknown as MapStringsToPortsType<Inputs>;
        this.outputPorts =
            outputPorts.map(i => Port.InitializeFromStorage(i, this.id)) as unknown as MapStringsToPortsType<Outputs>;
        this._callbackString = callbackString;
    }

    //initialize a block from a storage object
    public static InitializeFromStorage<
        Inputs extends PortStringListType,
        Outputs extends PortStringListType
    >(blockStorage: BlockStorageType<Inputs, Outputs>): Block<Inputs, Outputs> {
        return new Block(
            blockStorage.name, blockStorage.description, blockStorage.tags,
            blockStorage.inputPorts, blockStorage.outputPorts, blockStorage.callbackString
        );
    }

    public static InitializeFromStorageWithId<
        Inputs extends PortStringListType,
        Outputs extends PortStringListType
        >(blockStorage: BlockStorageWithIDType<Inputs, Outputs>): Block<Inputs, Outputs>
    {
        const tmpBlock = new Block(
            blockStorage.name, blockStorage.description, blockStorage.tags,
            blockStorage.inputPorts.map(p => _.omit(p, ["id"])),
            blockStorage.outputPorts.map(p => _.omit(p, ["id"])), blockStorage.callbackString
        );

        tmpBlock.id = blockStorage.id;
        tmpBlock.inputPorts.map((p, i) => {
            const tmpP = p;
            tmpP.id = blockStorage.inputPorts[i].id;
            tmpP.parentId = tmpBlock.id;
        });
        tmpBlock.outputPorts.map((p, i) => {
            const tmpP = p;
            tmpP.id = blockStorage.outputPorts[i].id;
            tmpP.parentId = tmpBlock.id;
        });

        return tmpBlock as never as Block<Inputs, Outputs>;
    }

    set callbackString(value: string) {
        this._callbackString = value;
    }

    public SetCallback(callback: Callback<Inputs, Outputs>) {
        this._callback = callback;
    }

    public ChangeInputPortType<I extends number, U extends keyof PortTypes>(
        portIndex: I, type: U, initialValue?: PortTypes[U] ): Block<ReplaceInTuple<Inputs, I, U>, Outputs>
    {
        if (!Number.isInteger(portIndex) || portIndex < 0 || portIndex > this.inputPorts.length - 1)
            throw new CompXError("error", "Change Input Error", "Not a valid index");
        if (this.inputPorts.length > 0 && this.inputPorts[portIndex].type === type)
            throw new CompXError(
                "warning", "Change Input Warning",
                `Port ${this.inputPorts[portIndex].name} is already a ${type}`
            )

        const tempInputs = _.cloneDeep(this.inputPorts) as MapStringsToPortsType<PortStringListType>

        tempInputs[portIndex] =
            tempInputs[portIndex].GetPortResetType(type, initialValue);

        const storage = JSON.parse(JSON.stringify(this.ToStorage()));
        storage['inputPorts'] = tempInputs;

        const tempBlock = Block.InitializeFromStorage(storage);
        tempBlock.id = this.id;

        return tempBlock as never as Block<ReplaceInTuple<Inputs, I, U>, Outputs>;
    }

    // public ChangeOutputPortType<U extends keyof PortTypes>(
    //     portIndex: number, type: U, initialValue?: PortTypes[U] ): Block<Inputs, PortStringListType>
    // {
    //     if (!Number.isInteger(portIndex) || portIndex < 0 || portIndex > this.outputPorts.length - 1)
    //         throw new CompXError("error", "Change Output Error", "Not a valid index");
    //     if (this.outputPorts[portIndex].type === type)
    //         throw new CompXError(
    //             "warning", "Change Output Warning",
    //             `Port ${this.outputPorts[portIndex].name} is already a ${type}`
    //         )
    //
    //     const outputs = Object.assign({}, this.outputPorts) as MapStringsToPortsType<PortStringListType>;
    //     outputs[portIndex] = outputs[portIndex].GetPortResetType(type, initialValue);
    //
    //     const block = Object.assign({}, this) as Block<Inputs, PortStringListType>;
    //     block.outputPorts = outputs;
    //
    //     return block;
    // }
    //
    // public Execute(t: number, dt: number, newInputs: MapStringsToTypes<Inputs>): void {
    //     if (this._callback === undefined)
    //         throw new CompXError("error", "Block Execute Error", "Callback was left undefined");
    //
    //     const prevInputs = this.inputPorts.map(p => p.GetObjectValue()) as unknown as MapStringsToTypes<Inputs>;
    //     const prevOutputs = this.outputPorts.map(p => p.GetObjectValue()) as unknown as MapStringsToTypes<Outputs>;
    //
    //     const newOutputs = this._callback(t, dt, prevInputs, prevOutputs, newInputs);
    //
    //     this.outputPorts.forEach((p, i) => { p.SetValue(newOutputs[i]); });
    //     this.inputPorts.forEach((p, i) => { p.SetValue(newInputs[i]); });
    // }

    public ToStorage(): BlockStorageWithIDType<Inputs, Outputs> {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            tags: this.tags,
            inputPorts: this.inputPorts.map(p => p.ToStorage()) as never as MapStringsToPortStoragesWithIDType<Inputs>,
            outputPorts: this.outputPorts.map(p => p.ToStorage()) as never as MapStringsToPortStoragesWithIDType<Outputs>,
            callbackString: this._callbackString
        }
    }
}