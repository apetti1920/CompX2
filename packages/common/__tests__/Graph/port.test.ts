import {PortStorageType} from "../../src/Network";
import {Port} from "../../src/Graph";

// Tests port features
describe("Port Tests", () => {
    // Tests if a port can be instantiated
    test("Creat from Constructor", () => {
        const port = Port.Initialize("p1", "1", "NUMBER", 0);
        expect(port).toBeInstanceOf(Port);
    });

    // Tests if a port can be instantiated from storage
    test("Creat from Constructor", () => {
        const portStorage: PortStorageType<"NUMBER"> = { id: "12345", name: "p1", type: "NUMBER", initialValue: 0};
        const port = Port.InitializeFromStorage(portStorage, "1");
        expect(port).toBeInstanceOf(Port);
    });

    // Tests if a ports value can be updated
    test("Can Update Value", () => {
        const portStorage: PortStorageType<"NUMBER"> = { id: "12345", name: "p1", type: "NUMBER", initialValue: 0};
        const port = Port.InitializeFromStorage(portStorage, "1");
        expect(typeof port.GetObjectValue()).toBe("number");
        expect(port.GetObjectValue()).toBe(0);
        port.SetValue(1);
        expect(port.GetObjectValue()).toBe(1);
    });

    // Tests if a port can be saved
    test("To port storage type", () => {
        const portStorage: PortStorageType<"NUMBER"> = { id: "12345", name: "p1", type: "NUMBER", initialValue: 0};
        const port = Port.InitializeFromStorage(portStorage, "1");
        expect(port.ToStorage()).toEqual(portStorage);
    });

    // Tests if getting value from uninitialiezed port throws an error
    test("Uninitialized port error", () => {
        const port = Port.Initialize("p1", "1", "NUMBER");
        expect(() => port.GetObjectValue()).toThrow("The Ports value has not been defined");
    });

    // Test if a port forced given conflicting types will throw an error
    test("Port conflicting types", () => {
        const portStorage1 = { id: "12345", name: "p1", type: "NUMBER", initialValue: "0"};
        expect(()=>Port.InitializeFromStorage(portStorage1 as PortStorageType<any>, "1"))
            .toThrow("Tried to set port 12345 of type NUMBER to a value of type string");

        const portStorage2 = { id: "12345", name: "p1", type: "STRING", initialValue: {test: "test"}};
        expect(()=>Port.InitializeFromStorage(portStorage2 as PortStorageType<any>, "1"))
            .toThrow("Tried to set port 12345 of type STRING to a value of type object");
    });
});