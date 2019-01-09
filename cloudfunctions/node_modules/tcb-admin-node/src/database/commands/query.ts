import { LogicCommand } from './logic'
import { InternalSymbol, SYMBOL_QUERY_COMMAND } from '../helper/symbol'


export const EQ = 'eq'
export const NEQ = 'neq'
export const GT = 'gt'
export const GTE = 'gte'
export const LT = 'lt'
export const LTE = 'lte'
export const IN = 'in'
export const NIN = 'nin'

export enum QUERY_COMMANDS_LITERAL {
  EQ = 'eq',
  NEQ = 'neq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  IN = 'in',
  NIN = 'nin',
}

export class QueryCommand extends LogicCommand {

  public operator: QUERY_COMMANDS_LITERAL

  constructor(operator: QUERY_COMMANDS_LITERAL, operands: any[], fieldName?: string | InternalSymbol) {
    super(operator, operands, fieldName)
    this.operator = operator
    this._internalType = SYMBOL_QUERY_COMMAND
  }

  _setFieldName(fieldName: string): QueryCommand {
    const command = new QueryCommand(this.operator, this.operands, fieldName)
    return command
  }

  eq(val: any) {
    const command = new QueryCommand(QUERY_COMMANDS_LITERAL.EQ, [val], this.fieldName)
    return this.and(command)
  }
  
  neq(val: any) {
    const command = new QueryCommand(QUERY_COMMANDS_LITERAL.NEQ, [val], this.fieldName)
    return this.and(command)
  }
  
  gt(val: any) {
    const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GT, [val], this.fieldName)
    return this.and(command)
  }
  
  gte(val: any) {
    const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GTE, [val], this.fieldName)
    return this.and(command)
  }
  
  lt(val: any) {
    const command = new QueryCommand(QUERY_COMMANDS_LITERAL.LT, [val], this.fieldName)
    return this.and(command)
  }
  
  lte(val: any) {
    const command = new QueryCommand(QUERY_COMMANDS_LITERAL.LTE, [val], this.fieldName)
    return this.and(command)
  }
  
  in(list: any[]) {
    const command = new QueryCommand(QUERY_COMMANDS_LITERAL.IN, list, this.fieldName)
    return this.and(command)
  }

  nin(list: any[]) {
    const command = new QueryCommand(QUERY_COMMANDS_LITERAL.NIN, list, this.fieldName)
    return this.and(command)
  }
}

export function isQueryCommand(object: any): object is QueryCommand {
  return object && (object instanceof QueryCommand) && (object._internalType === SYMBOL_QUERY_COMMAND)
}

export function isKnownQueryCommand(object: any): object is QueryCommand {
  return isQueryCommand(object) && (object.operator.toUpperCase() in QUERY_COMMANDS_LITERAL)
}

export function isComparisonCommand(object: any): object is QueryCommand {
  return isQueryCommand(object)
}

export default QueryCommand
