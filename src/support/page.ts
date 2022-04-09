import {MathStatement} from './parse'
import * as math from 'mathjs'
import {DepGraph} from 'dependency-graph'
import { v4 as uuidv4 } from 'uuid'
import {EvaluationResult, StatementID, VariableName} from '../types'

/**
 * Wrapper for a page containing multiple interrelated mathematical statements.
 */
export class MathPage {
    /** The statements on the page. */
    protected statements: Record<StatementID, MathStatement> = {}

    constructor(
        /** Unique page ID. */
        public readonly id: string,
    ) {}

    /** Add a statement to this page. */
    addStatement(statement: MathStatement): this {
        this.statements[statement.id] = statement
        return this
    }

    /** Parse the math expression and add it to the page as a statement. */
    addRaw(statement: string): this {
        return this.addStatement(new MathStatement(uuidv4() as StatementID, statement))
    }

    /** Get all symbols referenced by statements on this page. */
    symbols(): math.SymbolNode[] {
        return Object.values(this.statements)
            .map(x => x.symbols())
            .reduce((carry, current) => current.concat(carry), [])
    }

    /** Get all symbols defined on this page. */
    defines(): math.SymbolNode[] {
        return Object.values(this.statements)
            .map(x => x.defines())
            .reduce((carry, current) => current.concat(carry), [])
    }

    /** Get all symbols used on this page. */
    uses(): math.SymbolNode[] {
        return Object.values(this.statements)
            .map(x => x.uses())
            .reduce((carry, current) => current.concat(carry), [])
    }

    /** Get a mapping of symbol names to the statements where they are defined. */
    definers(): Record<VariableName, MathStatement> {
        const definers: Record<VariableName, MathStatement> = {}

        for ( const statement of Object.values(this.statements) ) {
            for ( const symbol of statement.defines() ) {
                definers[symbol.name as VariableName] = statement
            }
        }

        return definers
    }

    /** Get the dependency graph of variable declarations between statements on this page. */
    dependencies(): DepGraph<MathStatement> {
        const graph = new DepGraph<MathStatement>()
        const defined: Record<VariableName, MathStatement> = this.definers()

        for ( const statement of Object.values(this.statements) ) {
            graph.addNode(statement.id, statement)
        }

        for ( const statement of Object.values(this.statements) ) {
            for ( const symbol of statement.uses() ) {
                const provider = defined[symbol.name as VariableName]
                if ( !provider ) {
                    throw new Error('No provider for undefined symbol: ' + symbol.name)
                }

                graph.addDependency(statement.id, provider.id)
            }
        }

        return graph
    }

    /** Evaluate the current state of the page and get the result. */
    evaluate(): EvaluationResult {
        const evaluations: Record<StatementID, any> = {}
        const scope: Record<VariableName, any> = {}
        const graph = this.dependencies()

        for ( const node of graph.overallOrder() ) {
            const stmt = this.statements[node as StatementID]
            evaluations[stmt.id] = stmt.parse()
                .compile()
                .evaluate(scope)
        }

        return {
            variables: scope,
            statements: evaluations,
        }
    }
}
