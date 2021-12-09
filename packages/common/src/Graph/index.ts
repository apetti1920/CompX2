import {Block} from "./Block";
import {BlockStorageType, isBlockStorageType, isPortStorageType, PortStorageType} from "../Network";
import {Port} from "./Port";

export { Port } from './Port';

type StorageSelect<T> = T extends Port<infer V> ? PortStorageType<V> : (
    T extends Block<infer V, infer U> ? BlockStorageType<V, U> : never
)
export abstract class GraphObject<T> {
    public static InitializeFromStorage<U>(storage: StorageSelect<U>): U | void { }
    public abstract ToStorage(): StorageSelect<T>
}