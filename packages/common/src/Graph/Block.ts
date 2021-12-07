import {BlockStorageType, PortStorageType} from "../Network";
import {Port, PortStringListType, PortTypes} from "./Port";
import {v4 as uuidV4} from "uuid";
import {CompXError} from "../Helpers";

export type MapStringsToPortStoragesType<T extends PortStringListType> =
    { [K in keyof T]: T[K] extends PortStringListType[number] ? PortStorageType<T[K]> : never };
export type MapStringsToPortsType<T extends PortStringListType> =
    { [K in keyof T]: T[K] extends PortStringListType[number] ? Port<T[K]> : never };
export type MapStringsToTypes<T extends PortStringListType> =
    { [K in keyof T]: T[K] extends PortStringListType[number] ? PortTypes[T[K]] : never };

type Callback<Inputs extends PortStringListType, Outputs extends PortStringListType> = (
    t: number, dt: number, prevInputs: MapStringsToTypes<Inputs>,
    prevOutputs: MapStringsToTypes<Outputs>, newInputs: MapStringsToTypes<Inputs>
) => MapStringsToTypes<Outputs>;

export class Block<Inputs extends PortStringListType, Outputs extends PortStringListType>
    implements Omit<BlockStorageType<Inputs, Outputs>, "callbackString">
{
    public readonly id: string;
    public name: string;
    public description: string;
    public tags: string[];
    public inputPorts: MapStringsToPortsType<Inputs>;
    public outputPorts: MapStringsToPortsType<Outputs>;
    private callbackString: string;
    private callback?: Callback<Inputs, Outputs>;

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
        this.callbackString = callbackString;
    }

    //initialize a block from a storage object
    public static initializeFromStorage<
        Inputs extends PortStringListType,
        Outputs extends PortStringListType
    >(blockStorage: BlockStorageType<Inputs, Outputs>): Block<Inputs, Outputs> {
        return new Block(
            blockStorage.name, blockStorage.description, blockStorage.tags,
            blockStorage.inputPorts, blockStorage.outputPorts, blockStorage.callbackString
        );
    }

    public SetCallback(callback: Callback<Inputs, Outputs>) {
        this.callback = callback;
    }

    public Execute(t: number, dt: number, newInputs: MapStringsToTypes<Inputs>): void {
        if (this.callback === undefined)
            throw new CompXError("error", "Block Execute Error", "Callback was left undefined");

        const prevInputs = this.inputPorts.map(p => p.GetObjectValue()) as unknown as MapStringsToTypes<Inputs>;
        const prevOutputs = this.outputPorts.map(p => p.GetObjectValue()) as unknown as MapStringsToTypes<Outputs>;

        const newOutputs = this.callback(t, dt, prevInputs, prevOutputs, newInputs);

        this.outputPorts.forEach((p, i) => { p.SetValue(newOutputs[i]); });
        this.inputPorts.forEach((p, i) => { p.SetValue(newInputs[i]); });
    }
}