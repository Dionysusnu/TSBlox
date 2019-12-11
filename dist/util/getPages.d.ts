import { Base } from '../structures/Base';
import { Collection } from '../structures/Collection';
declare type Constructor<T> = new (...args: any[]) => T;
export default function getPages<ClassToConstruct extends Base>(url: string, objectType: Constructor<ClassToConstruct>, constructorParent: Base, transformer?: Function): Promise<Collection<Base['id'], ClassToConstruct>>;
export {};
