import { CompilationToken, ICompilationNode } from './ICompilationNode'
import { createObjectLine } from '../yas'

export class YasNode extends CompilationToken implements ICompilationNode {
    vaddr : number
    instructionBytes : number[]
    statementAsText : string

    constructor(line : number) {
        super(line)

        this.vaddr = 0
        this.instructionBytes = []
        this.statementAsText = ""
    }

    /**
     * Renders a node.
     * It expects the node evaluation to be done.
     */
    render() : string {
        return createObjectLine(this.vaddr, this.instructionBytes, this.statementAsText)
    }

    evaluate(ctx : any) : void {
        throw new Error('Function is not implemented')
    }

    postEvaluate(ctx : any) : void {
    }
}