import {MathStatement} from './parse'
import * as math from 'mathjs'
import {DepGraph} from 'dependency-graph'
import { v4 as uuidv4 } from 'uuid'
import {EvaluationResult, hasOwnProperty, Maybe, StatementID, VariableName} from './types'

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

    /** Get all defined statements. */
    getStatements(): MathStatement[] {
        return Object.values(this.statements)
    }

    /** Remove a statement from the math page. */
    removeStatement(id: StatementID) {
        delete this.statements[id]
    }

    /** Get a statement by ID if it exists. */
    getStatement(id: StatementID): Maybe<MathStatement> {
        return this.statements[id]
    }

    /** Add a statement to this page. */
    addStatement(statement: MathStatement): this {
        this.statements[statement.id] = statement
        return this
    }

    /** Parse the math expression and add it to the page as a statement. */
    addRaw(statement: string): StatementID {
        const stmt = new MathStatement(uuidv4() as StatementID, statement)
        this.addStatement(stmt)
        return stmt.id
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
        const definedFunctions: Record<VariableName, MathStatement> = {}

        for ( const sym of this.functions() ) {
            const node = sym.parse() as math.FunctionAssignmentNode
            definedFunctions[node.name as VariableName] = sym
        }

        for ( const statement of Object.values(this.statements) ) {
            graph.addNode(statement.id, statement)
        }

        for ( const statement of Object.values(this.statements) ) {
            for ( const symbol of statement.uses() ) {
                const functionProvider = definedFunctions[symbol.name as VariableName]
                if ( functionProvider ) {
                    graph.addDependency(statement.id, functionProvider.id)
                    continue
                }

                const provider = defined[symbol.name as VariableName]
                if ( !provider ) {
                    throw new Error('No provider for undefined symbol: ' + symbol.name)
                }

                graph.addDependency(statement.id, provider.id)
            }
        }

        return graph
    }

    /** Returns true if the given variable name is a function definition. */
    isFunctionKey(name: VariableName): boolean {
        return this.functions()
            .some(stmt => {
                const node = stmt.parse() as math.FunctionAssignmentNode
                return node.name === name
            })
    }

    /** Get all the statements defining functions. */
    functions(): MathStatement[] {
        return Object.values(this.statements)
            .filter(x => x.isFunctionDeclaration())
    }

    /** Look up a function statement by name, if it exists. */
    getFunctionByName(name: string): MathStatement|undefined {
        for ( const fn of this.functions() ) {
            const node = fn.parse() as math.FunctionAssignmentNode
            if ( node.name === name ) {
                return fn
            }
        }
    }

    /** Evaluate the current state of the page and get the result. */
    evaluate(): EvaluationResult {
        const evaluations: Record<StatementID, any> = {}
        const scope: Record<VariableName, any> = {}
        const graph = this.dependencies()
        const definers = this.definers()

        for ( const stmt of this.functions() ) {
            const node = stmt.parse() as math.FunctionAssignmentNode
            scope[node.name as VariableName] = stmt.parse().evaluate()
        }

        for ( const node of graph.overallOrder() ) {
            const stmt = this.statements[node as StatementID]
            evaluations[stmt.id] = stmt.parse()
                .compile()
                .evaluate(scope)
        }

        const nonFunctionalScope: Record<VariableName, any> = {}
        for ( const key in scope ) {
            if ( !hasOwnProperty(scope, key) ) {
                continue
            }

            if ( definers[key as VariableName] ) {
                nonFunctionalScope[key as VariableName] = scope[key]
            }
        }

        return {
            variables: nonFunctionalScope,
            statements: evaluations,
        }
    }
}
