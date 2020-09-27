import { CompilationError } from '../../interfaces/ICompiler'
import { YasNode } from './yasNode'
import { Line } from './line'

export class Document extends YasNode {
    private _lines : Line[]

    constructor(lines : Line[]) {
        super(0)
        this._lines = lines
    }

    evaluate(ctx : any) : void {
        this._lines.forEach((line) => {
            try{
                line.evaluate(ctx)
            } catch(e) {
                if(e instanceof CompilationError) {
                    ctx.errors.push(e)
                } else {
                    ctx.errors.push(new CompilationError(1, e))
                }
            }
        })
    }

    postEvaluate(ctx : any) {
        this._lines.forEach((line) => {
            try{
                line.postEvaluate(ctx)
            } catch(e) {
                if(e instanceof CompilationError) {
                    ctx.errors.push(e)
                } else {
                    ctx.errors.push(new CompilationError(1, e))
                }
            }
        })
    }

    render() : string {
        let output = ''

        this._lines.forEach((line) => {
            output += line.render() + '\n'
        })

        return output
    }

    forEachLine(callback : (line : Line) => void) {
        this._lines.forEach((line) => {
            callback(line)
        })
    }
}