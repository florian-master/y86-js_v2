import { Document } from './nodes/document'
import { Label } from './nodes/label'

export class ProgramData {
    private _labelToPC = new Map<string, number>()
    private _lineNumberToPc = new Map<number, number>()
    private _pcToLineNumber = new Map<number, number>()

    constructor(document : Document) {
        document.forEachLine((line) => {
            if(line.instructionBytes.length != 0) {
                this._lineNumberToPc.set(line.line, line.vaddr)
                this._pcToLineNumber.set(line.line, line.vaddr)
            }
            
            line.forEachInnerNode((node) => {
                if(node instanceof Label) {
                    this._labelToPC.set(node.getName(), node.vaddr)
                }
            })
        })
    }

    labelToPC(label : string) : number {
        if(this._labelToPC.has(label)) {
            return this._labelToPC.get(label) as number
        } else {
            throw new Error('There is no label named "' + label + '"')
        }
    }

    lineToPC(line : number) : number {
        if(this._lineNumberToPc.has(line)) {
            return this._lineNumberToPc.get(line) as number
        } else {
            throw new Error('The line ' + line + ' is not associated to any instruction')
        }
    }

    pcToLine(pc : number) : number {
        if(this._pcToLineNumber.has(pc)) {
            return this._pcToLineNumber.get(pc) as number
        } else {
            throw new Error('The PC ' + pc + ' is not associated to any line')
        }
    }
}