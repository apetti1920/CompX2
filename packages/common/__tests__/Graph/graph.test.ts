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
        test("Add Block Test", () => {
            const graph = new Graph({
                blocks: [{
                    id: "", name: "", tags: [], description: "", callbackString: "",
                    inputPorts: [{id: "", name: "", type: "STRING", initialValue: ""}],
                    outputPorts: [{id: "", name: "", type: "STRING", initialValue: ""}]
                }],
                edges: []
            });

            graph.AddBlock({
                name: "test",
                tags: [],
                description: "",
                callbackString: "",
                inputPorts: [{name: "", type: "STRING", initialValue: ""}],
                outputPorts: [{name: "", type: "STRING", initialValue: ""}]
            });

            expect(graph.blocks.length).toBe(2);
        });
   });
});