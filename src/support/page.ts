import {MathStatement} from './parse'
import * as math from 'mathjs'

export class MathPage {
    protected statements: Record<string, MathStatement> = {}

    constructor(
        public readonly id: string,
    ) {}

    addStatement(statement: MathStatement): this {
        this.statements[statement.id] = statement
        return this
    }

    symbols(): math.SymbolNode[] {
        return Object.values(this.statements)
            .map(x => x.symbols())
            .reduce((carry, current) => current.concat(carry), [])
    }

    defines(): math.SymbolNode[] {
        return Object.values(this.statements)
            .map(x => x.defines())
            .reduce((carry, current) => current.concat(carry), [])
    }

    uses(): math.SymbolNode[] {
        return Object.values(this.statements)
            .map(x => x.uses())
            .reduce((carry, current) => current.concat(carry), [])
    }
}
