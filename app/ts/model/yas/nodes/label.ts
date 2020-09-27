import { YasNode } from './yasNode'

export class Label extends YasNode {
    private _name : string 

    constructor(name : string, line : number) {
        super(line)
        this._name = name
    }

    evaluate(ctx : any) : void {
        this.vaddr = ctx.vaddr
        this.instructionBytes = []
        this.statementAsText = this._name + ': '
        
        ctx.labels.set(this._name, this.vaddr)
    }

    getName() : string {
        return this._name
    }
}