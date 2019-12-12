import { Base } from '../structures/Base';
import { Collection } from '../structures/Collection';
import { Constructor } from './Util';
import { CatchConfig } from '../structures/Client';
export declare function getPages<ClassToConstruct extends Base>(url: string, objectType: Constructor<ClassToConstruct>, constructorParent: Base, catchConfig: CatchConfig, transformer?: Function): Promise<Collection<Base['id'], ClassToConstruct>>;
