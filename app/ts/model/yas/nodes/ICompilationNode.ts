/**
 * Represents a node created when parsing the grammar.
 */
export interface ICompilationNode {
    /**
     * Evaluates the node. 
     * In case the node can not been evaluated directly, the postEvaluate
     * method must be called.
     * @param ctx The context given by the compiler
     */
    evaluate(ctx : any) : void;

    /**
     * Post evaluates the node.
     * If this function is called, you can assume that all nodes' evaluate
     * methods have been executed.
     * @param ctx 
     */
    postEvaluate(ctx : any) : void;
}

export function isCompilationNode(obj : any) : obj is ICompilationNode {
    return obj.constructor.prototype.hasOwnProperty('toCode')
}

export class CompilationToken {
    line    : number
    column  : number
    
    constructor(line : number, column : number = -1) {
        this.line = line
        this.column = column
    }
}