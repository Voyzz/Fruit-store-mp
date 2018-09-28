// import { UpdateOperatorList } from "./constant";

export class Command {
  public logicParam: object = {};
  private placeholder = "{{{AAA}}}";

  constructor(logicParam?: object) {
    if (logicParam) {
      this.logicParam = logicParam;
    }
  }

  /**
   * Query and Projection Operators
   * https://docs.mongodb.com/manual/reference/operator/query/
   * @param target
   */
  eq(target: any) {
    return new Command(this.baseOperate("$eq", target));
  }

  neq(target: any) {
    return new Command(this.baseOperate("$ne", target));
  }

  gt(target: any) {
    return new Command(this.baseOperate("$gt", target));
  }

  gte(target: any) {
    return new Command(this.baseOperate("$gte", target));
  }

  lt(target: any) {
    return new Command(this.baseOperate("$lt", target));
  }

  lte(target: any) {
    return new Command(this.baseOperate("$lte", target));
  }

  in(target: any[]) {
    return new Command(this.baseOperate("$in", target));
  }

  nin(target: any[]) {
    return new Command(this.baseOperate("$nin", target));
  }

  /**
   * Update Operators
   * https://docs.mongodb.com/manual/reference/operator/update/
   * @param target
   */
  mul(target: number) {
    return new Command({ $mul: { [this.placeholder]: target } });
  }

  remove() {
    return new Command({ $unset: { [this.placeholder]: "" } });
  }

  inc(target: number) {
    return new Command({ $inc: { [this.placeholder]: target } });
  }

  set(target: any) {
    return new Command({ $set: { [this.placeholder]: target } });
  }

  push(target: any) {
    let value = target;
    if (Array.isArray(target)) {
      value = { $each: target };
    }

    return new Command({ $push: { [this.placeholder]: value } });
  }

  pop() {
    return new Command({ $pop: { [this.placeholder]: 1 } });
  }

  unshift(target: any) {
    let value = { $each: [target], $position: 0 };
    if (Array.isArray(target)) {
      value = { $each: target, $position: 0 };
    }

    return new Command({
      $push: { [this.placeholder]: value }
    });
  }

  shift() {
    return new Command({ $pop: { [this.placeholder]: -1 } });
  }

  private baseOperate(operator: string, target: any): object {
    return {
      [this.placeholder]: { [operator]: target }
    };
  }

  and(...targets: any[]) {
    if (targets.length === 1 && Array.isArray(targets[0])) {
      targets = targets[0]
    }
    return new Command(this.connectOperate("$and", targets));
  }

  or(...targets: any[]) {
    // console.log(targets)
    if (targets.length === 1 && Array.isArray(targets[0])) {
      targets = targets[0]
    }
    return new Command(this.connectOperate("$or", targets));
  }

  // not(target: any) {
  //   return new Command(this.connectOperate("$not", target));
  // }

  private connectOperate(operator: string, targets: any[]) {
    // console.log(this.logicParam, target.logicParam, targets);
    let logicParams: object[] = [];
    if (Object.keys(this.logicParam).length > 0) {
      logicParams.push(this.logicParam);
    }

    for (let target of targets) {
      if (target instanceof Command) {
        if (Object.keys(target.logicParam).length === 0) {
          continue;
        }
        logicParams.push(target.logicParam);
      } else {
        const tmp = this.concatKeys(target);
        // console.log(tmp);
        logicParams.push({
          [tmp.keys]:
            tmp.value instanceof Command ? tmp.value.logicParam : tmp.value
        });
      }
    }

    this.logicParam = [];
    // console.log(logicParam);
    return {
      [operator]: logicParams
    };
  }

  parse(key?: string): object {
    // if (UpdateOperatorList.indexOf(Object.keys(this.logicParam)[0]) > -1) {
    return JSON.parse(
      JSON.stringify(this.logicParam).replace(/{{{AAA}}}/g, key)
    );
    // }
  }

  public toString = (): object => {
    return this.logicParam[0];
  };

  /**
   * ??????
   * @param obj
   */
  public concatKeys(obj: object) {
    let keys = "",
      value: any;

    for (let key in obj) {
      // console.log(key, obj[key]);
      if (
        typeof obj[key] === "object" &&
        obj[key] instanceof Command === false
      ) {
        let tmp = this.concatKeys(obj[key]);
        keys = key + "." + tmp.keys;
        value = tmp.value;
        // console.log(keys);
      } else {
        keys = key;
        value = obj[key];
        // console.log({ keys, value });
      }
      break;
    }
    return { keys, value };
  }
}
