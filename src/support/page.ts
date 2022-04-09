import {MathStatement} from './parse'
import * as math from 'mathjs'
import {DepGraph} from 'dependency-graph'
import { v4 as uuidv4 } from 'uuid'

export class MathPage {
    protected statements: Record<string, MathStatement> = {}

    constructor(
        public readonly id: string,
    ) {}

    addStatement(statement: MathStatement): this {
        this.statements[statement.id] = statement
        return this
    }

    addRaw(statement: string): this {
        return this.addStatement(new MathStatement(uuidv4(), statement))
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

    dependencies(): DepGraph<MathStatement> {
        const graph = new DepGraph<MathStatement>()
        const defined: Record<string, MathStatement> = {}

        for ( const statement of Object.values(this.statements) ) {
            for ( const symbol of statement.defines() ) {
                defined[symbol.name] = statement
            }
        }

        for ( const statement of Object.values(this.statements) ) {
            graph.addNode(statement.id, statement)
        }

        for ( const statement of Object.values(this.statements) ) {
            for ( const symbol of statement.uses() ) {
                const provider = defined[symbol.name]
                if ( !provider ) {
                    throw new Error('No provider for undefined symbol: ' + symbol.name)
                }

                graph.addDependency(statement.id, provider.id)
            }
        }

        return graph
    }
}
