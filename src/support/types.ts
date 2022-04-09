import {
    parse,
    MathNode,
    AccessorNode,
    ArrayNode,
    AssignmentNode,
    BlockNode,
    ConditionalNode,
    ConstantNode,
    FunctionAssignmentNode,
    FunctionNode,
    IndexNode,
    ObjectNode,
    OperatorNode,
    ParenthesisNode,
    RangeNode,
    RelationalNode,
    SymbolNode,
} from 'mathjs'


export abstract class MathNodeWalk<TReturn> {
    abstract walkAccessorNode(node: AccessorNode): TReturn

    abstract walkArrayNode(node: ArrayNode): TReturn

    abstract walkAssignmentNode(node: AssignmentNode): TReturn

    abstract walkBlockNode(node: BlockNode): TReturn

    abstract walkConditionalNode(node: ConditionalNode): TReturn

    abstract walkConstantNode(node: ConstantNode): TReturn

    abstract walkFunctionAssignmentNode(node: FunctionAssignmentNode): TReturn

    abstract walkFunctionNode(node: FunctionNode): TReturn

    abstract walkIndexNode(node: IndexNode): TReturn

    abstract walkObjectNode(node: ObjectNode): TReturn

    abstract walkOperatorNode(node: OperatorNode): TReturn

    abstract walkParenthesisNode(node: ParenthesisNode): TReturn

    abstract walkRangeNode(node: RangeNode): TReturn

    abstract walkRelationalNode(node: RelationalNode): TReturn

    abstract walkSymbolNode(node: SymbolNode): TReturn
}

export class MathStatement {
    constructor(
        public readonly raw: string,
    ) {}

    parse(): MathNode {
        return parse(this.raw)
    }

}

export class MathExpression extends MathStatement {}
