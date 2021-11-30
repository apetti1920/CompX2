import { v4 as uuidv4 } from 'uuid';
import { CompXError } from "../Network";
import {PortStorageType} from "../Network/BlockStorage";

export const PortTypeStrings = ["string", "number"] as const;
export type AcceptedPortTypes = string | number;
export type PortTypes = typeof PortTypeStrings[number];

export class Port implements PortStorageType {
    public readonly id: string;
    public readonly name: string;
    public readonly parentId: string;
    public readonly type: PortTypes;
    public readonly initialValue?: AcceptedPortTypes;
    private _objectValue?: AcceptedPortTypes;

    constructor(name: string, parentId: string, type: PortTypes, initialValue?: AcceptedPortTypes) {
        this.id = uuidv4();
        this.name = name;
        this.parentId = parentId;
        this.type = type;
        this.initialValue = initialValue;

        if (initialValue !== undefined) this.TrySetValue(initialValue);
        else {
            switch (this.type) {
                case "string": {
                    this._objectValue = "";
                    break;
                } case "number": {
                    this._objectValue = 0;
                    break;
                }
            }
        }
    }

    // static constructor from thhe port storage type
    public static FromPortStorage(portStorage: PortStorageType, parentId: string) {
        return new Port(portStorage['id'], parentId, portStorage['type'], portStorage['initialValue']);
    }

    // Gets the current Value of the port
    public GetObjectValue(): AcceptedPortTypes | never {
        if (this._objectValue)
            return this._objectValue;
        else
            throw new CompXError(
                "warning",
                "Port Get Value Warning",
                "The Ports value has not been defined"
            )
    }

    // function to set the value of the port
    public TrySetValue(value: AcceptedPortTypes): void | never {
        if (typeof value === this.type)
            this._objectValue = value;
        else
            throw new CompXError(
                "warning",
                "Port Set Value Error",
                `Port value (${value}) must be type of type ${this.type}`
            )
    }

    public ToStorage(): PortStorageType {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            initialValue: this.initialValue
        }
    }
}