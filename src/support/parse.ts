import * as math from 'mathjs'
import {hasOwnProperty} from '../types'

/** Base class for walks over MathNode trees. */
export abstract class MathNodeWalk<TReturn> {
    walk(node: math.MathNode): TReturn {
        if ( math.isAccessorNode(node) ) {
            return this.walkAccessorNode(node)
        } else if ( math.isArrayNode(node) ) {
            return this.walkArrayNode(node)
        } else if ( math.isAssignmentNode(node) ) {
            return this.walkAssignmentNode(node)
        } else if ( math.isBlockNode(node) ) {
            return this.walkBlockNode(node)
        } else if ( math.isConditionalNode(node) ) {
            return this.walkConditionalNode(node)
        } else if ( math.isConstantNode(node) ) {
            return this.walkConstantNode(node)
        } else if ( math.isFunctionAssignmentNode(node) ) {
            return this.walkFunctionAssignmentNode(node)
        } else if ( math.isFunctionNode(node) ) {
            return this.walkFunctionNode(node)
        } else if ( math.isIndexNode(node) ) {
            return this.walkIndexNode(node)
        } else if ( math.isObjectNode(node) ) {
            return this.walkObjectNode(node)
        } else if ( math.isOperatorNode(node) ) {
            return this.walkOperatorNode(node)
        } else if ( math.isParenthesisNode(node) ) {
            return this.walkParenthesisNode(node)
        } else if ( math.isRangeNode(node) ) {
            return this.walkRangeNode(node)
        } else if ( (node as unknown as any).isRelationalNode ) {
            return this.walkRelationalNode(node as unknown as any)
        } else if ( math.isSymbolNode(node) ) {
            return this.walkSymbolNode(node)
        }

        throw new TypeError('Invalid MathNode: ' + node)
    }

    abstract walkAccessorNode(node: math.AccessorNode): TReturn

    abstract walkArrayNode(node: math.ArrayNode): TReturn

    abstract walkAssignmentNode(node: math.AssignmentNode): TReturn

    abstract walkBlockNode(node: math.BlockNode): TReturn

    abstract walkConditionalNode(node: math.ConditionalNode): TReturn

    abstract walkConstantNode(node: math.ConstantNode): TReturn

    abstract walkFunctionAssignmentNode(node: math.FunctionAssignmentNode): TReturn

    abstract walkFunctionNode(node: math.FunctionNode): TReturn

    abstract walkIndexNode(node: math.IndexNode): TReturn

    abstract walkObjectNode(node: math.ObjectNode): TReturn

    abstract walkOperatorNode(node: math.OperatorNode): TReturn

    abstract walkParenthesisNode(node: math.ParenthesisNode): TReturn

    abstract walkRangeNode(node: math.RangeNode): TReturn

    abstract walkRelationalNode(node: math.RelationalNode): TReturn

    abstract walkSymbolNode(node: math.SymbolNode): TReturn
}


export class SymbolWalk extends MathNodeWalk<math.SymbolNode[]> {
    walkAccessorNode(node: math.AccessorNode): math.SymbolNode[] {
        return [
            ...this.walk(node.object),
            ...this.walk(node.index),
        ]
    }

    walkArrayNode(node: math.ArrayNode): math.SymbolNode[] {
        return node.items
            .map(x => this.walk(x))
            .reduce((carry, current) => current.concat(carry), [])
    }

    walkAssignmentNode(node: math.AssignmentNode): math.SymbolNode[] {
        return [
            ...this.walk(node.object),
            ...this.walk(node.value),
            ...(node.index ? this.walk(node.index) : []),
        ]
    }

    walkBlockNode(node: math.BlockNode): math.SymbolNode[] {
        return node.blocks
            .map(x => x.node)
            .map(x => this.walk(x))
            .reduce((carry, current) => current.concat(carry), [])
    }

    walkConditionalNode(node: math.ConditionalNode): math.SymbolNode[] {
        return [
            ...this.walk(node.condition),
            ...this.walk(node.trueExpr),
            ...this.walk(node.falseExpr),
        ]
    }

    walkConstantNode(): math.SymbolNode[] {
        return []
    }

    walkFunctionAssignmentNode(node: math.FunctionAssignmentNode): math.SymbolNode[] {
        return this.walk(node.expr)
    }

    walkFunctionNode(node: math.FunctionNode): math.SymbolNode[] {
        return [
            ...this.walk(node.fn),
            ...node.args
                .map(x => this.walk(x))
                .reduce((carry, current) => current.concat(carry), []),
        ]
    }

    walkIndexNode(node: math.IndexNode): math.SymbolNode[] {
        return node.dimensions
            .map(x => this.walk(x))
            .reduce((carry, current) => current.concat(carry), [])
    }

    walkObjectNode(node: math.ObjectNode): math.SymbolNode[] {
        return Object.values(node.properties)
            .map(x => this.walk(x))
            .reduce((carry, current) => current.concat(carry), [])
    }

    walkOperatorNode(node: math.OperatorNode): math.SymbolNode[] {
        return node.args
            .map(x => this.walk(x))
            .reduce((carry, current) => carry.concat(current), [])
    }

    walkParenthesisNode(node: math.ParenthesisNode): math.SymbolNode[] {
        return this.walk(node.content)
    }

    walkRangeNode(node: math.RangeNode): math.SymbolNode[] {
        return [
            ...this.walk(node.start),
            ...this.walk(node.end),
            ...(node.step ? this.walk(node.step) : []),
        ]
    }

    walkRelationalNode(node: math.RelationalNode): math.SymbolNode[] {
        return node.params
            .map(x => this.walk(x))
            .reduce((carry, current) => carry.concat(current), [])
    }

    walkSymbolNode(node: math.SymbolNode): math.SymbolNode[] {
        return [node]
    }
}


export class RValSymbolWalk extends SymbolWalk {
    walkAssignmentNode(node: math.AssignmentNode): math.SymbolNode[] {
        return this.walk(node.value)
    }

    walkFunctionNode(node: math.FunctionNode): math.SymbolNode[] {
        return [
            ...this.walk(node.fn),  // FIXME should this be removed? Not sure if this is rval or lval
            ...node.args
                .map(x => this.walk(x))
                .reduce((carry, current) => current.concat(carry), []),
        ]
    }
}


export class LValSymbolWalk extends SymbolWalk {
    walkAccessorNode(): math.SymbolNode[] {
        return []
    }

    walkArrayNode(): math.SymbolNode[] {
        return []
    }

    walkAssignmentNode(node: math.AssignmentNode): math.SymbolNode[] {
        if ( math.isSymbolNode(node.object) ) {
            return super.walkSymbolNode(node.object)
        }

        return super.walkAccessorNode(node.object)
    }

    walkBlockNode(node: math.BlockNode): math.SymbolNode[] {
        return node.blocks
            .map(x => this.walk(x.node))
            .reduce((carry, current) => current.concat(carry), [])
    }

    walkConditionalNode(): math.SymbolNode[] {
        return []
    }

    walkConstantNode(): math.SymbolNode[] {
        return []
    }

    walkFunctionAssignmentNode(): math.SymbolNode[] {
        return []
    }

    walkFunctionNode(): math.SymbolNode[] {
        return []
    }

    walkIndexNode(): math.SymbolNode[] {
        return []
    }

    walkObjectNode(): math.SymbolNode[] {
        return []
    }

    walkOperatorNode(): math.SymbolNode[] {
        return []
    }

    walkParenthesisNode(node: math.ParenthesisNode): math.SymbolNode[] {
        return this.walk(node.content)
    }

    walkRangeNode(): math.SymbolNode[] {
        return []
    }

    walkRelationalNode(): math.SymbolNode[] {
        return []
    }

    walkSymbolNode(): math.SymbolNode[] {
        return []
    }
}

export class MathStatement {
    constructor(
        public readonly raw: string,
    ) {}

    parse(): math.MathNode {
        return math.parse(this.raw)
    }

    symbols(): math.SymbolNode[] {
        return (new SymbolWalk()).walk(this.parse())
    }

    defines(): math.SymbolNode[] {
        return (new LValSymbolWalk()).walk(this.parse())
    }

    uses(): math.SymbolNode[] {
        return (new RValSymbolWalk()).walk(this.parse())
    }
}
