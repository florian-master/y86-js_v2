import { ICompiler, CompilationResult, CompilationError } from "../interfaces/ICompiler";
import * as yasParser from "./yasParser";
import { IInstructionSet } from "../interfaces/IInstructionSet";
import { InstructionLine } from "./nodes/instruction";
import { Directive } from "./nodes/directive";
import { Label } from "./nodes/label";
import { Line } from './nodes/line'
import { Document } from './nodes/document'
import { ProgramData } from './programData'
import { padStringNumber } from '../numberUtils'

export class Yas implements ICompiler {
    registersEnum: any
    instructionSet: IInstructionSet
    wordSize : number

    constructor(registersEnum: any, instructionSet: IInstructionSet, wordSize : number) {
        this.registersEnum = registersEnum
        this.instructionSet = instructionSet
        this.wordSize = wordSize
    }

    /**
     * Compiles the given source.
     * It also set few data (see ProgramData)
     * int the CompilationResult data field.
     * @param src 
     */
    assemble(src: string): CompilationResult {
        let result = new CompilationResult()

        try {
            // Captures errors when lexing
            (<any>yasParser.parser.yy).parseError = (msg : string, hash : any) => {
                throw new CompilationError(hash.line + 1, msg)
            };
            
            let document = <Document> yasParser.parse(src, {
                CompilationError: CompilationError,
                InstructionLine: InstructionLine,
                Directive: Directive,
                Label: Label,
                AddressFromRegister: AddressFromRegister,
                Line: Line,
                Document: Document,
            })
            result = this._compile(document)
            result.data = new ProgramData(document)
        } catch (error) {
            if(error instanceof CompilationError) {
                result.errors.push(error);
            } else {
                throw new Error("An unknown error happened when parsing in yas : " + error)
            }
        }

        return result
    }

    private _compile(document : Document) : CompilationResult {
        let result = new CompilationResult()
        
        let ctx = {
            vaddr : 0,
            labels: new Map(),
            registersEnum: this.registersEnum,
            instructionSet: this.instructionSet,
            wordSize: this.wordSize,
            errors: result.errors,
        }

        document.evaluate(ctx)
        document.postEvaluate(ctx)

        result.output = document.render()

        return result
    }
}

const ADDRESS_PADDING_SIZE = 2
const MIDDLE_PADDING_SIZE = 25
const YS_PADDING_SIZE = 5

export function createObjectLine(address : number, bytes : number[], ys : string) : string {
    let output = ''

    for(let i = 0; i < ADDRESS_PADDING_SIZE; i++) {
        output += ' '
    }

    output += '0x' + padStringNumber(address.toString(16), 4, '0') + ': '
    
    bytes.forEach((byte) => {
        output += padStringNumber(byte.toString(16), 2, '0')
    })

    while(output.length < MIDDLE_PADDING_SIZE) {
        output += ' '
    }

    output += '|'

    for(let i = 0; i < YS_PADDING_SIZE; i++) {
        output += ' '
    }

    output += ys

    return output
}

export function createEmptyObjectLine(ys = '') : string {
    let output = ''

    for(let i = 0; i < MIDDLE_PADDING_SIZE; i++) {
        output += ' '
    }

    output += '|'

    for(let i = 0; i < YS_PADDING_SIZE; i++) {
        output += ' '
    }

    output += ys

    return output
}

export class AddressFromRegister {
    registerName : string
    offset : string

    constructor(registerName : string, offset : string = '0') {
        this.registerName = registerName
        this.offset = offset
    }

    toString() : string {
        return this.offset + '(' + this.registerName + ')'
    }
}