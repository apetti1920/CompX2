import {PortStorageType, isPortStorageType} from "../../src/Network";
import {Port} from "../../src/Graph";
import exp from "constants";

// Tests port features
describe("Port Tests", () => {
    test("Is port storage type", ()=>{
        const p: PortStorageType<"NUMBER"> = { name: "test1", type: "NUMBER", initialValue: 0 };
        expect(isPortStorageType(p)).toBeTruthy();
    });

    test("Is not port storage type", ()=>{
        const p0a = 0;
        expect(isPortStorageType(p0a)).not.toBeTruthy();

        const p0b = { type: "NUMBER", initialValue: 0 };
        expect(isPortStorageType(p0b)).not.toBeTruthy();

        const p1 = { name: 1, type: "NUMBER", initialValue: 0 };
        expect(isPortStorageType(p1)).not.toBeTruthy();

        const p2 = { name: "test1", type: "test", initialValue: 0 };
        expect(isPortStorageType(p2)).not.toBeTruthy();

        const p3 = { name: "test1", type: "NUMBER", initialValue: "test" };
        expect(isPortStorageType(p3)).not.toBeTruthy();

        const p4 = { name: "test1", type: "STRING", initialValue: 0 };
        expect(isPortStorageType(p4)).not.toBeTruthy();
    });

    // Tests if a port can be instantiated from storage
    test("Create from Constructor", () => {
        const portStorage: PortStorageType<"NUMBER"> = { name: "p1", type: "NUMBER", initialValue: 0};
        const port = Port.InitializeFromStorage(portStorage, "1");
        expect(port).toBeInstanceOf(Port);
    });

    // Tests if a ports value can be updated
    test("Can Update Value", () => {
        const portStorage: PortStorageType<"NUMBER"> = { name: "p1", type: "NUMBER", initialValue: 0};
        const port = Port.InitializeFromStorage(portStorage, "1");
        expect(typeof port.GetObjectValue()).toBe("number");
        expect(port.GetObjectValue()).toBe(0);
        port.SetValue(1);
        expect(port.GetObjectValue()).toBe(1);
    });

    // Tests if a port's type can be changed
    test("Change port type", () => {
        const portStorage: PortStorageType<"NUMBER"> = { name: "p1", type: "NUMBER", initialValue: 0};
        const port1 = Port.InitializeFromStorage(portStorage, "1");
        const port2 = port1.GetPortResetType("STRING", "");

        expect(port2.name).toBe(port1.name);
        expect(port2.type).toBe("STRING");
        expect(port2.initialValue).toBe("");
    });

    // Tests if a port can be saved
    test("To port storage type", () => {
        const portStorage: PortStorageType<"NUMBER"> = { name: "p1", type: "NUMBER", initialValue: 0};
        const port = Port.InitializeFromStorage(portStorage, "1");
        expect(port.ToStorage()).toEqual(portStorage);
    });

    // test if an uninitialized port throws an error when accessing its value
    test("Initialized port error", () => {
        const portStorage: PortStorageType<"NUMBER"> = { name: "p1", type: "NUMBER"};
        const port = Port.InitializeFromStorage(portStorage, "1");
        expect(()=>port.GetObjectValue()).toThrow("The Ports value has not been defined");
    });
});