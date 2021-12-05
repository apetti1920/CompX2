import { v4 as uuidv4 } from 'uuid';
import { CompXError } from "../Helpers";
import {PortStorageType} from "../Network";

export interface PortTypes {
    STRING: string;
    NUMBER: number;
}

export class Port<T extends PortTypes[U], U extends keyof PortTypes> implements PortStorageType<U> {
    public readonly id: string;
    public readonly name: string;
    public readonly parentId: string;
    public readonly type: U
    public readonly initialValue?: T;
    private _objectValue?: T;

    private constructor(name: string, parentId: string, type: U, initialValue?: T, id?: string) {
        this.id = id ?? uuidv4();
        this.name = name;
        this.type = type;
        this.parentId = parentId;
        this.initialValue = initialValue;
        if (initialValue !== undefined) this.SetValue(initialValue);
    }

    // Initializer to hide constructor
    public static Initialize<U extends keyof PortTypes>(
        name: string, parentId: string, type: U, initialValue?: PortTypes[U]
    ): Port<PortTypes[U], U> {
        return new Port(name, parentId, type, initialValue);
    }

    //static constructor from the port storage type
    public static InitializeFromStorage<U extends keyof PortTypes>(
        portStorage: PortStorageType<U>, parentId: string
    ): Port<PortTypes[U], U> {
        return new Port(portStorage['name'], parentId,
            portStorage['type'], portStorage['initialValue'], portStorage['id']);
    }

    // Gets the current Value of the port
    public GetObjectValue(): T | never {
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
    public SetValue(value: T): void {
        // check if an error should be thrown based on the value type
        let errCheck = false;
        switch (this.type) {
            case "NUMBER": {
                if (typeof value !== 'number')
                    errCheck = true;
                break;
            } case "STRING": {
                if (typeof value !== 'number')
                    errCheck = true;
                break
            }
        }

        // throw error if needed
        if (errCheck)
            throw new CompXError("error", "Port Value Error",
                `Tried to set port ${this.id} of type ${this.type} to a value of type ${typeof value}`);

        // set the objeects value
        this._objectValue = value
    }

    public ToStorage(): PortStorageType<U> {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            initialValue: this.initialValue
        }
    }
}