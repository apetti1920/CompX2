import {GraphStorageType, isGraphStorageType} from "../../src/Network/GraphItemStorage/GraphStorage";
import {Graph} from "../../src/Graph/Graph";

describe("Graph Tests", () => {
   describe("Graph Storage Tests", () => {
       test("Graph storage is valid", () => {
          const graph: GraphStorageType = {
              blocks: [{
                  id: "", name: "", tags: [], description: "", callbackString: "",
                  inputPorts: [{id: "", name: "", type: "STRING", initialValue: ""}],
                  outputPorts: [{id: "", name: "", type: "STRING", initialValue: ""}]
              }],
              edges: []
          }
          expect(isGraphStorageType(graph)).toBeTruthy();
       });

       test("Graph storage is not valid", () => {
           const graph = {
               blocks: [{
                   id: "", name: "", tags: [], description: "", callbackString: "",
                   inputPorts: [{id: "", name: "", type: "STRING", initialValue: 0}],
                   outputPorts: [{id: "", name: "", type: "STRING", initialValue: ""}]
               }],
               edges: []
           }
           expect(isGraphStorageType(graph)).not.toBeTruthy();
       });
   }) ;

   describe("Graph Tests", () => {
       let graph: Graph;
       beforeEach(() => {
           graph = new Graph({
               blocks: [{
                   id: "1", name: "", tags: [], description: "", callbackString: "",
                   inputPorts: [{id: "1ia", name: "", type: "STRING", initialValue: ""}],
                   outputPorts: [{id: "1oa", name: "", type: "STRING", initialValue: ""}]
               },{
                   id: "2", name: "", tags: [], description: "", callbackString: "",
                   inputPorts: [{id: "2ia", name: "", type: "STRING", initialValue: ""}],
                   outputPorts: [{id: "2oa", name: "", type: "STRING", initialValue: ""}]
               },{
                   id: "3", name: "", tags: [], description: "", callbackString: "",
                   inputPorts: [{id: "3ia", name: "", type: "STRING", initialValue: ""}],
                   outputPorts: [{id: "3oa", name: "", type: "STRING", initialValue: ""}]
               },{
                   id: "4", name: "", tags: [], description: "", callbackString: "",
                   inputPorts: [{id: "4ia", name: "", type: "NUMBER", initialValue: 0}],
                   outputPorts: [{id: "4oa", name: "", type: "STRING", initialValue: ""}]
               }],
               edges: [
                   { id: "1", type: "STRING",
                       output: {blockID: "1", portID: "1oa" },
                       input: { blockID: "2", portID: "2ia" }
                   }
               ]
           });
       });

        test("Add Block Test", () => {
            graph.AddBlock({
                name: "test",
                tags: [],
                description: "",
                callbackString: "",
                inputPorts: [{name: "", type: "STRING", initialValue: ""}],
                outputPorts: [{name: "", type: "STRING", initialValue: ""}]
            });

            expect(graph.blocks.length).toBe(5);
        });

        describe("Add edge tests", () => {
            test("Edge already exists", () => {
                graph.AddEdge("1", "1oa", "2", "2ia");
                expect(graph.edges.length).toBe(1);
            });

            test("Output block does not exist", () => {
                expect(() => graph.AddEdge("test", "1oa", "2", "2ia"))
                    .toThrowError()
            });

            test("Output port does not exist", () => {
                expect(() => graph.AddEdge("1", "test", "2", "2ia"))
                    .toThrowError()
            });

            test("Input block does not exist", () => {
                expect(() => graph.AddEdge("1", "1oa", "test", "2ia"))
                    .toThrowError()
            });

            test("Input port does not exist", () => {
                expect(() => graph.AddEdge("1", "1oa", "2", "test"))
                    .toThrowError()
            });

            test("Differing port types", () => {
                expect(() => graph.AddEdge("3", "3oa", "4", "4ia"))
                    .toThrowError()
            });

            test("Can add an edge", () => {
                graph.AddEdge("2", "2oa", "3", "3ia");
                expect(graph.edges.length).toBe(2)
            });

            test("Can Remove Block", () => {
                expect(() => graph.RemoveBlock("test")).toThrowError();

                graph.RemoveBlock(graph.blocks[1].id);
                expect(graph.blocks.length).toBe(3)
                expect(graph.edges.length).toBe(0)
            });

            test("Can Remove Edge", () => {
                expect(() => graph.RemoveEdge("test")).toThrowError();

                graph.RemoveEdge(graph.edges[0].id);
                expect(graph.edges.length).toBe(0)
            });
        });

       test("Graph to storage", () => {
           expect(isGraphStorageType(graph.ToStorage())).toBeTruthy();
       });
   });
});