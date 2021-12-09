import {BlockStorageType, isBlockStorageType} from "../../src/Network";
import {Block} from "../../src/Graph/Block";

describe("Block Tests", () => {
    describe("Block Storage Tests", () => {
        const testBlock1: BlockStorageType<["STRING"], ["NUMBER"]> = {
            name: "test", description: "a test block", tags: ['test'],
            inputPorts: [
                { name: "test p 1", type: "STRING", initialValue: "" }
            ],
            outputPorts: [
                { name: "test p 2", type: "NUMBER", initialValue: 0 }
            ],
            callbackString: ""
        }

        test("Is valid Block Storage", () => {
           expect(isBlockStorageType(testBlock1)).toBeTruthy();
        });

        test("Is invalid Block Storage", () => {
            const b0a = 0;
            expect(isBlockStorageType(b0a)).not.toBeTruthy();

            const b0b = {...testBlock1} as any;
            delete b0b['name'];
            expect(isBlockStorageType(b0b)).not.toBeTruthy();

            const b1 = {...testBlock1} as any;
            b1.name = 0;
            expect(isBlockStorageType(b1)).not.toBeTruthy();

            const b2 = {...testBlock1} as any;
            b2.description = 0;
            expect(isBlockStorageType(b2)).not.toBeTruthy();

            const b3 = {...testBlock1} as any;
            b3.tags = 0;
            expect(isBlockStorageType(b3)).not.toBeTruthy();

            const b4 = {...testBlock1} as any;
            b4.tags = ["test", 0];
            expect(isBlockStorageType(b4)).not.toBeTruthy();

            const b5 = {...testBlock1} as any;
            b5.inputPorts = 0;
            expect(isBlockStorageType(b5)).not.toBeTruthy();

            const b6 = {...testBlock1} as any;
            b6.outputPorts = 0;
            expect(isBlockStorageType(b6)).not.toBeTruthy();
        });
    });

    describe("Block Tests", () => {
        const testBlock2: BlockStorageType<[], ["NUMBER"]> = {
            name: "test", description: "a test block", tags: ['test'],
            inputPorts: [],
            outputPorts: [
                { name: "test p 2", type: "NUMBER", initialValue: 0 }
            ],
            callbackString: ""
        }

        let block: Block<[], ["NUMBER"]>;

        beforeAll(() => {
            block = Block.InitializeFromStorage(testBlock2);
        });

        test("Callback Call Error", () => {
            expect(()=>block.Execute(0, 0, [])).toThrowError();
        });

        test("Can Set Callback", () => {
            expect(block.outputPorts[0].GetObjectValue()).toBe(0);

            block.SetCallback(
                (t, dt, prevInputs,
                 prevOutputs, newInputs
            ) => {
                return [prevOutputs[0] + 5];
            });

            for (let i = 0; i < 10; i++) {
                block.Execute(i, 1, []);
            }

            expect(block.outputPorts[0].GetObjectValue()).toBe(50);
        });

        test("Change Output Port", () => {
            const b2 = block.ChangeOutputPortType(0, "STRING");
            expect(b2.outputPorts[0].type).toBe("STRING");
        });
    });
});