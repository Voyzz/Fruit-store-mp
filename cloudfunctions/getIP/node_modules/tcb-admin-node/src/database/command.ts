import { QueryCommand, QUERY_COMMANDS_LITERAL } from './commands/query'
import { LogicCommand, LOGIC_COMMANDS_LITERAL } from './commands/logic'
import { UpdateCommand, UPDATE_COMMANDS_LITERAL } from './commands/update'
import { isArray } from './utils/type'



export type IQueryCondition = Record<string, any> | LogicCommand

export const Command = {

  eq(val: any) {
    return new QueryCommand(QUERY_COMMANDS_LITERAL.EQ, [val])
  },

  neq(val: any) {
    return new QueryCommand(QUERY_COMMANDS_LITERAL.NEQ, [val])
  },

  lt(val: any) {
    return new QueryCommand(QUERY_COMMANDS_LITERAL.LT, [val])
  },

  lte(val: any) {
    return new QueryCommand(QUERY_COMMANDS_LITERAL.LTE, [val])
  },

  gt(val: any) {
    return new QueryCommand(QUERY_COMMANDS_LITERAL.GT, [val])
  },

  gte(val: any) {
    return new QueryCommand(QUERY_COMMANDS_LITERAL.GTE, [val])
  },

  in(val: any) {
    return new QueryCommand(QUERY_COMMANDS_LITERAL.IN, val)
  },

  nin(val: any) {
    return new QueryCommand(QUERY_COMMANDS_LITERAL.NIN, val)
  },

  and(...__expressions__: IQueryCondition[]) {
    const expressions = isArray(arguments[0]) ? arguments[0] : Array.from(arguments)
    return new LogicCommand(LOGIC_COMMANDS_LITERAL.AND, expressions)
  },

  or(...__expressions__: IQueryCondition[]) {
    const expressions = isArray(arguments[0]) ? arguments[0] : Array.from(arguments)
    return new LogicCommand(LOGIC_COMMANDS_LITERAL.OR, expressions)
  },

  set(val: any) {
    return new UpdateCommand(UPDATE_COMMANDS_LITERAL.SET, [val])
  },

  remove() {
    return new UpdateCommand(UPDATE_COMMANDS_LITERAL.REMOVE, [])
  },

  inc(val: number) {
    return new UpdateCommand(UPDATE_COMMANDS_LITERAL.INC, [val])
  },

  mul(val: number) {
    return new UpdateCommand(UPDATE_COMMANDS_LITERAL.MUL, [val])
  },

  push(...__values__: any[]) {
    const values = isArray(arguments[0]) ? arguments[0] : Array.from(arguments)
    return new UpdateCommand(UPDATE_COMMANDS_LITERAL.PUSH, values)
  },

  pop() {
    return new UpdateCommand(UPDATE_COMMANDS_LITERAL.POP, [])
  },

  shift() {
    return new UpdateCommand(UPDATE_COMMANDS_LITERAL.SHIFT, [])
  },

  unshift(...__values__: any[]) {
    const values = isArray(arguments[0]) ? arguments[0] : Array.from(arguments)
    return new UpdateCommand(UPDATE_COMMANDS_LITERAL.UNSHIFT, values)
  },

}

export default Command

