import { v4 as uuidV4 } from 'uuid';
import { CompXError } from "../Helpers";
import {PortStorageType} from "../Network";
import {GraphObject} from "./index";

export const PortTypesStringList = ['STRING', "NUMBER"] as const;
type PortInterfaceType = {[K in typeof PortTypesStringList[number]]: any};
export interface PortTypes extends PortInterfaceType {
    STRING: string;
    NUMBER: number;
}
export const PortTypeInitializers: PortTypes = {
    STRING: "",
    NUMBER: 0
}

type StringListUnionType = typeof PortTypesStringList[number]
export type PortStringListType = StringListUnionType[];
export type MapStringsToPortsType<T extends PortStringListType> =
    { [K in keyof T]: T[K] extends PortStringListType[number] ? Port<T[K]> : never }

export class Port<U extends keyof PortTypes> implements PortStorageType<U>, GraphObject<Port<U>> {
    private readonly id: string;
    public name: string;
    public readonly parentId: string;
    public readonly type: U
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

    // function to set the objects type
    public GetPortResetType<U extends keyof PortTypes>(type: U, initialValue?: PortTypes[U]) {
        return Port.InitializeFromStorage({
            name: this.name,
            type: type,
            initialValue: initialValue
        }, this.parentId);
    }

    public ToStorage(): PortStorageType<U> {
        return {
            name: this.name,
            type: this.type,
            initialValue: this.initialValue
        }
    }
}

