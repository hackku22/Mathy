import math from 'mathjs'


export abstract class MathNodeWalk<TReturn> {
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

export class MathStatement {
    constructor(
        public readonly raw: string,
    ) {}

    // parse(): MathNode {
    //     return parse(this.raw)
    // }

}

export class MathExpression extends MathStatement {}
