import { CompilationError } from '../../interfaces/ICompiler'
import { stringToNumber, numberToByteArray } from '../../numberUtils'
import { YasNode } from './yasNode'

export class Directive extends YasNode {
    directiveName : string
    value : string

    constructor(directiveName : string, value : string, line : number) {
        super(line)
        this.directiveName = directiveName
        this.value = value
    }

    evaluate(ctx : any) : void {
        this.vaddr = ctx.vaddr

        let value = stringToNumber(this.value)

        switch(this.directiveName) {
            case 'align': {
                if(value < 1) {
                    throw new CompilationError(this.line, "Alignement value must be higher than 1")
                }
                while(ctx.vaddr % value != 0) {
                    ctx.vaddr++
                }
                this.instructionBytes = []
                break;
            }
            case 'long': {
                const bytes = numberToByteArray(stringToNumber(this.value), ctx.wordSize, true)
                ctx.vaddr += bytes.length

                this.instructionBytes = bytes
                break;
            }
            case 'pos': {
                if(value < 0) {
                    throw new CompilationError(this.line, "An address is expected to be positive")
                }
                ctx.vaddr = value

                this.instructionBytes = []
                break;
            }
            default:
                throw new CompilationError(this.line, 'The directive ".' + this.directiveName + '" does not exist')
        }

        this.statementAsText = '.' + this.directiveName + ' ' + this.value
    }
}