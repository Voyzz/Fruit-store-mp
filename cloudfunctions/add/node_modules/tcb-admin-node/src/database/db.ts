import { Point } from "./geo/point";
import * as Geo from "./geo";
import { CollectionReference } from "./collection";
import { Command } from "./command";
import { ServerDate } from "./serverDate"
import { Request } from "./request";

/**
 * 地理位置类型
 */
interface GeoTeyp {
  Point: typeof Point;
}

/**
 * 数据库模块
 *
 * @author haroldhu
 */
export class Db {
  /**
   * Geo 类型
   */
  Geo: GeoTeyp;

  /**
   * 逻辑操作的命令
   */
  command: Command;


  /**
   * 初始化
   *
   * 默认是 `default` 数据库，为今后扩展使用
   *
   * @param config
   */
  config: any;

  constructor(config?: any) {
    this.config = config;
    this.Geo = Geo;
    this.command = new Command();
  }

  serverDate({ offset = 0 } = {}) {
    return new ServerDate({ offset })
  }

  /**
   * 获取集合的引用
   *
   * @param collName - 集合名称
   */
  collection(collName: string): CollectionReference {
    if (!collName) {
      throw new Error("Collection name is required");
    }
    return new CollectionReference(this, collName);
  }

  /**
   * 创建集合
   */
  createCollection(collName: string) {
    let request = new Request(this);

    const params = {
      collectionName: collName
    };

    return request.send("addCollection", params)
  }

  // /**
  //  * 获取全部集合列表
  //  *
  //  * @internal
  //  * @todo
  //  * @description 后续版本规划
  //  */
  // private getCollections(): void {

  // }
}
