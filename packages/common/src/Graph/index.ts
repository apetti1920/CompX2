import { Block } from "./Block";
import { Port } from "./Port";
import { Edge } from "./Edge";
import { BlockStorageType, PortStorageType, EdgeStorageType } from "../Network";

type StorageSelect<T> = T extends Port<infer V> ? PortStorageType<V> : (
    T extends Block<infer V, infer U> ? BlockStorageType<V, U> : (
        T extends Edge<infer V> ? EdgeStorageType<V> : never
    )
)
export abstract class GraphObject<T> {
    public static InitializeFromStorage<U>(storage: StorageSelect<U>): U | void { }
    public abstract ToStorage(): StorageSelect<T>
}