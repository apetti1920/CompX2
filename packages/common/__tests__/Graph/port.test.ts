import {PortStorageType} from "../../src/Network/BlockStorage";
import {Port} from "../../src/Graph";

describe("Port Tests", () => {
    test("Creat from Constructor", () => {
        const port = new Port("p1", "1", "number", 0);
        expect(port).toBeInstanceOf(Port);
    });

    test("Creat from Constructor", () => {
        const portStorage: PortStorageType = { id: "12345", name: "p1", type: "number", initialValue: 0};
        const port = Port.FromPortStorage(portStorage, "1");
        expect(port).toBeInstanceOf(Port);
    });

    test("Can Update Value", () => {
        const portStorage: PortStorageType = { id: "12345", name: "p1", type: "number", initialValue: 0};
        const port = Port.FromPortStorage(portStorage, "1");
        expect(typeof port.GetObjectValue()).toBe("number");
        expect(port.GetObjectValue()).toBe(0);
        port.TrySetValue(0);
    });
});