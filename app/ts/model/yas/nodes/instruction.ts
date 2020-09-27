import { CompilationError } from '../../interfaces/ICompiler'
import { Instruction, InstructionArg } from '../../instructionSet'
import { stringToNumber, numberToByteArray, isNumber } from '../../numberUtils'
import { AddressFromRegister } from '../yas'
import { YasNode } from './yasNode'

const REG_POSITION = 1
let valcPosition = 0

export class InstructionLine extends YasNode {
    name : string
    args : string[]

    constructor(name : string, args : string[] = [], line : number) {
        super(line)
        this.name = name
        this.args = args
    }

    evaluate(ctx : any) : void {
        if(!ctx.instructionSet.getHandle().has(this.name)) {
            throw new CompilationError(this.line, "The instruction '" + this.name + "' does not exist")
        }
        const instruction = ctx.instructionSet.getHandle().get(this.name) as Instruction

        if(instruction.args.length != this.args.length) {
            throw new CompilationError(this.line, "The instruction '" + this.name + "' expects " + instruction.args.length + " arguments")
        }
        
        this.statementAsText = this._getRepresentation(instruction)
        this.vaddr = ctx.vaddr
        ctx.vaddr += instruction.length
    }

    postEvaluate(ctx : any) {
        const instruction = ctx.instructionSet.getHandle().get(this.name) as Instruction

        let sizeInBytes = 1
        sizeInBytes += instruction.useRegisters ? 1 : 0
        sizeInBytes += instruction.useValC ? ctx.wordSize : 0
        
        this.instructionBytes = new Array<number>(0)
        
        for(let i = 0; i < sizeInBytes; i++) {
            this.instructionBytes.push(0)
        }

        this.instructionBytes[0] |= instruction.icode << 4
        this.instructionBytes[0] |= instruction.ifun

        if(instruction.useRegisters) {
            this.instructionBytes[REG_POSITION] = 0xff
            valcPosition = REG_POSITION + 1
        } else {
            valcPosition = REG_POSITION
        }

        instruction.args.forEach((arg, index) => {
            const userArg = this.args[index]

            switch(arg) {
                case InstructionArg.REG: {
                    const registerPosition = instruction.useMemory ? 0 : index
                    this._processRegister(ctx, this.instructionBytes, userArg, registerPosition)
                    break
                }
                case InstructionArg.MEM: {
                    this._processMem(ctx, this.instructionBytes, userArg)
                    break
                }
                case InstructionArg.LABEL: {
                    this._processLabel(ctx, this.instructionBytes, userArg)
                    break
                }
                case InstructionArg.CONST: {
                    this._processConst(ctx, this.instructionBytes, userArg)
                    break
                }
                default: {
                    throw new CompilationError(this.line, "The given arg type is not defined")
                }
            }
        })
    }

    private _getRepresentation(instruction : Instruction) {
        let output = '    ' + this.name + ' '

        this.args.forEach((arg, index) => {
            output += arg + ', '
        })

        const offset = this.args.length === 0 ? 0 : 2
        return output.substr(0, output.length - offset)
    }

    private _processConst(ctx : any, instructionBytes : Array<number>, userArg : string) {
        let value = 0
        
        if(!isNumber(userArg)) {
            if(!ctx.labels.has(userArg)) {
                throw new CompilationError(this.line, "The label '" + userArg + "' does not exist")
            }
            value = ctx.labels.get(userArg) as number
        } else {
            value = stringToNumber(userArg)
        }

        const bytes = numberToByteArray(value, ctx.wordSize, true)
        bytes.forEach((byte, index) => {
            instructionBytes[valcPosition + index] = byte
        })
    }

    private _processLabel(ctx : any, instructionBytes : Array<number>, userArg : string) {
        if(!ctx.labels.has(userArg)) {
            throw new CompilationError(this.line,"The label '" + userArg + "' does not exist")
        }
        const bytes = numberToByteArray(ctx.labels.get(userArg) as number, ctx.wordSize, true)
        bytes.forEach((byte, index) => {
            instructionBytes[valcPosition + index] = byte
        })
    }

    private _processMem(ctx : any, instructionBytes : Array<number>, userArg : any) {
        let valC = 0

        if(userArg instanceof AddressFromRegister) { // address from a register value
            this._processRegister(ctx, instructionBytes, userArg.registerName, 1)
            valC = stringToNumber(userArg.offset)
        } else {
            if(!isNumber(userArg)){ // label
                if(!ctx.labels.has(userArg)) {
                    throw new CompilationError(this.line,"The label '" + userArg + "' does not exist")
                }
                valC = ctx.labels.get(userArg) as number
            } else { // constant
                valC = stringToNumber(userArg)
            }

            if(valC < 0) {
                throw new CompilationError(this.line,"A memory address must be positive")
            }
        }

        const bytes = numberToByteArray(valC, ctx.wordSize, true)
        bytes.forEach((byte, index) => {
            instructionBytes[valcPosition + index] = byte
        })
    }

    private _processRegister(ctx : any, instructionBytes : Array<number>, userArg : string, position : number) {
        let regName = userArg.substr(1) // Remove the '%'

        if(!ctx.registersEnum.hasOwnProperty(regName)) {
            throw new CompilationError(this.line, "Register '" + userArg + "' does not exist")
        }
        if(position < 0 || position > 1) {
            throw new CompilationError(this.line, 'A register must have a position in [0;1]. Received : ' + position.toString())
        }
        let registerID = ctx.registersEnum[regName] as number 
        
        if(position == 0) {
            registerID <<= 4
            registerID |= 0x0f
        } else {
            registerID |= 0xf0
        }

        instructionBytes[REG_POSITION] &= registerID
    }
}
