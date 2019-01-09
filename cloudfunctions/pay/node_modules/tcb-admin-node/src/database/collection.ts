import { Db } from "./db";
import { DocumentReference } from "./document";
import { Query } from "./query";

/**
 * 集合模块，继承 Query 模块
 *
 * @author haroldhu
 */
export class CollectionReference extends Query {

  /**
   * 初始化
   *
   * @internal
   *
   * @param db    - 数据库的引用
   * @param coll  - 集合名称
   */
  constructor(db: Db, coll: string) {
    super(db, coll);
  }

  /**
   * 读取集合名字
   */
  get name() {
    return this._coll;
  }

  /**
   * 获取文档的引用
   *
   * @param docID - 文档ID
   */
  doc(docID?: string): DocumentReference {
    return new DocumentReference(this._db, this._coll, docID);
  }

  /**
   * 添加一篇文档
   *
   * @param data - 数据
   */
  add(data: Object): Promise<any> {
    let docRef = this.doc();
    return docRef.create(data);
  }
}
