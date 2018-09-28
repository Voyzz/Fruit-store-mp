"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(logicParam) {
        this.logicParam = {};
        this.placeholder = "{{{AAA}}}";
        this.toString = () => {
            return this.logicParam[0];
        };
        if (logicParam) {
            this.logicParam = logicParam;
        }
    }
    eq(target) {
        return new Command(this.baseOperate("$eq", target));
    }
    neq(target) {
        return new Command(this.baseOperate("$ne", target));
    }
    gt(target) {
        return new Command(this.baseOperate("$gt", target));
    }
    gte(target) {
        return new Command(this.baseOperate("$gte", target));
    }
    lt(target) {
        return new Command(this.baseOperate("$lt", target));
    }
    lte(target) {
        return new Command(this.baseOperate("$lte", target));
    }
    in(target) {
        return new Command(this.baseOperate("$in", target));
    }
    nin(target) {
        return new Command(this.baseOperate("$nin", target));
    }
    mul(target) {
        return new Command({ $mul: { [this.placeholder]: target } });
    }
    remove() {
        return new Command({ $unset: { [this.placeholder]: "" } });
    }
    inc(target) {
        return new Command({ $inc: { [this.placeholder]: target } });
    }
    set(target) {
        return new Command({ $set: { [this.placeholder]: target } });
    }
    push(target) {
        let value = target;
        if (Array.isArray(target)) {
            value = { $each: target };
        }
        return new Command({ $push: { [this.placeholder]: value } });
    }
    pop() {
        return new Command({ $pop: { [this.placeholder]: 1 } });
    }
    unshift(target) {
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
    baseOperate(operator, target) {
        return {
            [this.placeholder]: { [operator]: target }
        };
    }
    and(...targets) {
        if (targets.length === 1 && Array.isArray(targets[0])) {
            targets = targets[0];
        }
        return new Command(this.connectOperate("$and", targets));
    }
    or(...targets) {
        if (targets.length === 1 && Array.isArray(targets[0])) {
            targets = targets[0];
        }
        return new Command(this.connectOperate("$or", targets));
    }
    connectOperate(operator, targets) {
        let logicParams = [];
        if (Object.keys(this.logicParam).length > 0) {
            logicParams.push(this.logicParam);
        }
        for (let target of targets) {
            if (target instanceof Command) {
                if (Object.keys(target.logicParam).length === 0) {
                    continue;
                }
                logicParams.push(target.logicParam);
            }
            else {
                const tmp = this.concatKeys(target);
                logicParams.push({
                    [tmp.keys]: tmp.value instanceof Command ? tmp.value.logicParam : tmp.value
                });
            }
        }
        this.logicParam = [];
        return {
            [operator]: logicParams
        };
    }
    parse(key) {
        return JSON.parse(JSON.stringify(this.logicParam).replace(/{{{AAA}}}/g, key));
    }
    concatKeys(obj) {
        let keys = "", value;
        for (let key in obj) {
            if (typeof obj[key] === "object" &&
                obj[key] instanceof Command === false) {
                let tmp = this.concatKeys(obj[key]);
                keys = key + "." + tmp.keys;
                value = tmp.value;
            }
            else {
                keys = key;
                value = obj[key];
            }
            break;
        }
        return { keys, value };
    }
}
exports.Command = Command;
