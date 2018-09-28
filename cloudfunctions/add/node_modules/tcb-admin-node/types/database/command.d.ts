export declare class Command {
    logicParam: object;
    private placeholder;
    constructor(logicParam?: object);
    eq(target: any): Command;
    neq(target: any): Command;
    gt(target: any): Command;
    gte(target: any): Command;
    lt(target: any): Command;
    lte(target: any): Command;
    in(target: any[]): Command;
    nin(target: any[]): Command;
    mul(target: number): Command;
    remove(): Command;
    inc(target: number): Command;
    set(target: any): Command;
    push(target: any): Command;
    pop(): Command;
    unshift(target: any): Command;
    shift(): Command;
    private baseOperate;
    and(...targets: any[]): Command;
    or(...targets: any[]): Command;
    private connectOperate;
    parse(key?: string): object;
    toString: () => object;
    concatKeys(obj: object): {
        keys: string;
        value: any;
    };
}
