import { v4 as uuidV4 } from 'uuid';
import { CompXError } from "../Helpers";
import {PortStorageType} from "../Network";

export const PortTypesStringList = ['STRING', "NUMBER"] as const;
type PortInterfaceType = {[K in typeof PortTypesStringList[number]]: any};
export interface PortTypes extends PortInterfaceType {
    STRING: string;
    NUMBER: number;
}

export type PortStringListType = ReadonlyArray<typeof PortTypesStringList[number]>;
export type MapStringsToPortsType<T extends PortStringListType> =
    { [K in keyof T]: T[K] extends PortStringListType[number] ? Port<T[K]> : never }

export class Port<U extends keyof PortTypes> implements PortStorageType<U> {
    public readonly id: string;
    public name: string;
    public parentId: string;
    public type: U
    public initialValue?: PortTypes[U];
    private _objectValue?: PortTypes[U];

    private constructor(name: string, parentId: string, type: U, initialValue?: PortTypes[U]) {
        this.id = uuidV4();
        this.name = name;
        this.type = type;
        this.parentId = parentId;
        this.initialValue = initialValue;
        if (initialValue !== undefined) this.SetValue(initialValue);
    }

    //static constructor from the port storage type
    public static InitializeFromStorage<U extends keyof PortTypes>(
        portStorage: PortStorageType<U>, parentId: string
    ): Port<U> {
        return new Port(portStorage['name'], parentId,
            portStorage['type'], portStorage['initialValue']);
    }

    // Gets the current Value of the port
    public GetObjectValue(): PortTypes[U] | never {
        if (this._objectValue !== undefined)
            return this._objectValue;
        else
            throw new CompXError(
                "warning",
                "Port Get Value Warning",
                "The Ports value has not been defined"
            )
    }

    // function to set the value of the port
    public SetValue(value: PortTypes[U]): void {
       // set the objects value
        this._objectValue = value
    }

    public ToStorage(): PortStorageType<U> {
        return {
            name: this.name,
            type: this.type,
            initialValue: this.initialValue
        }
    }
}

