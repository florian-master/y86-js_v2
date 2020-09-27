import { IInstructionSet } from './interfaces/IInstructionSet'

/**
 * Represents the different types an instruction argument can be.
 *  - REG : A register name
 *  - MEM : A memory address
 *  - CONST : A constant integer value
 *  - LABEL : A label name
 */
export enum InstructionArg {
    REG     = 0,
    MEM     = 1,
    CONST   = 2,
    LABEL   = 3,
}

/**
 * Represents an instruction.
 */
export class Instruction {
    /**
     * How many arguments an instruction can have ?
     */
    private static MAX_ARGS = 2

    private static MAX_REGISTERS_ARGS = 2
    private static MAX_VALC_ARGS = 1

    private static ICODE_IFUN_BYTES_LENGTH = 1
    private static REGISTERS_BYTE_LENGTH = 1

    /**
     * The name of the instruction. It can not be empty.
     */
    name: string

    /**
     * The code representing the instruction. It must be in [0; 15] (encoded on 4 bits).
     */
    icode: number

    /**
     * The code representing the function of the instruction. It must be in [0; 15] (encoded on 4 bits).
     */
    ifun: number

    /**
     * Length in bytes of the encoded instructions.
     */
    length = 0

    /**
     * Expected arguments for this instruction.
     */
    args: InstructionArg[] = []

    useRegisters = false

    useValC = false

    useMemory = false

    constructor(name: string, icode: number, ifun: number, args: InstructionArg[], wordSize : number = 4) {
        try {
            this._checkName(name)
            this._checkCodes(icode, ifun)
            this._checkArgs(args)
        } catch (e) {
            throw name + " : " + e
        }

        this.name = name
        this.icode = icode
        this.ifun = ifun
        
        this._setArgs(args)
        this._computeLength(wordSize)
    }

    private _checkName(name: string) {
        if (name.length === 0) {
            throw new Error("An instruction name can not be empty")
        }
    }

    private _checkArgType(type: InstructionArg) {
        for (const possibleType in InstructionArg) {
            if (type === Number(InstructionArg[possibleType])) {
                return
            }
        }
        throw new Error("The given arg type does not exist")
    }

    private _checkCodes(icode: number, ifun: number) {
        if (icode < 0 || ifun < 0 || icode > 15 || ifun > 15) {
            throw new Error("icode and ifun must be in [0;15]. icode = " + icode + ", ifun = " + ifun)
        }
    }

    private _checkArgs(args: InstructionArg[]) {
        let registersArgsCount  = 0
        let valcArgsCount       = 0

        if(args.length > Instruction.MAX_ARGS) {
            throw new Error('An instruction can not have more than ' + Instruction.MAX_ARGS + ' arguments. Current : ' + args.length)
        }

        args.forEach((arg) => {
            this._checkArgType(arg)

            switch(arg) {
                case InstructionArg.REG: {
                    registersArgsCount++
                    break
                }
                case InstructionArg.MEM: {
                    registersArgsCount++
                    valcArgsCount++
                    break
                }
                default: {
                    valcArgsCount++
                }
            }
        })

        if(registersArgsCount > Instruction.MAX_REGISTERS_ARGS) {
            throw new Error("An instruction can not hold more than " + Instruction.MAX_REGISTERS_ARGS + " registers arguments")
        }

        if(valcArgsCount > Instruction.MAX_VALC_ARGS) {
            throw new Error("An instruction can not hold more than " + Instruction.MAX_VALC_ARGS + "  valC argument")
        }
    }

    private _setArgs(args : InstructionArg[]) {
        this.useRegisters = this.useValC = false

        args.forEach((arg) => {
            switch(arg) {
                case InstructionArg.REG: {
                    this.useRegisters = true
                    break
                }
                case InstructionArg.MEM: {
                    this.useMemory = true
                    this.useRegisters = true
                    this.useValC = true
                    break
                }
                default: {
                    this.useValC = true
                }
            }
        })

        this.args = args
    }

    private _computeLength(wordSize : number) {
        this.length = Instruction.ICODE_IFUN_BYTES_LENGTH

        this.length += this.useRegisters ? Instruction.REGISTERS_BYTE_LENGTH : 0
        this.length += this.useValC ? wordSize : 0
    }
}

/**
 * Represents a set of instructions.
 * This class takes the responsability to check the coherency 
 * of all its instructions.
 * When instanciating the class, it is by default filled with
 * the default instructions.
 */
export class InstructionSet implements IInstructionSet {
    /**
     * Handler of all the instructions of the set.
     * To each instruction name is associated its instruction
     * representation.
     */
    handle = new Map<string, Instruction>()

    constructor(instructions : Instruction[] = defaultInstructions) {
        this.addInstructions(instructions)
    }

    getHandle(): Map<string, Instruction> {
        return this.handle
    }

    addInstructions(instructions: Instruction[]) {
        instructions.forEach((item) => {
            this.addInstruction(item)
        })
    }

    addInstruction(instruction: Instruction) {
        this.handle.forEach((item) => {
            if (item.name === instruction.name) {
                throw new Error("An instruction '" + item.name + "' already exists")
            }
            if (item.icode === instruction.icode && item.ifun === instruction.ifun) {
                throw new Error("The pair of (icode, ifun) (" + item.icode + ", " + item.ifun + ") already exists")
            }
        })

        let args : InstructionArg[] = []

        instruction.args.forEach((arg) => {
            args.push(arg)
        })
        this.handle.set(instruction.name, new Instruction(instruction.name, instruction.icode, instruction.ifun, args))
    }

    getDefaultInstructions() : Instruction[] {
        return defaultInstructions
    }

    getHaltCode() : number {
        let haltinstr = this.handle.get("halt");
        // @ts-ignore
        return haltinstr.icode;
    }

    clear() {
        this.handle.clear()
    }
}

/**
 * Default instructions
 */
const defaultInstructions: Instruction[] = [
    new Instruction("nop", 1, 0,
        []),
    new Instruction("halt", 0, 0,
        []),
    new Instruction("rrmovl", 2, 0,
        [InstructionArg.REG, InstructionArg.REG]),
    new Instruction("irmovl", 3, 0,
        [InstructionArg.CONST, InstructionArg.REG]),
    new Instruction("rmmovl", 4, 0,
        [InstructionArg.REG,  InstructionArg.MEM]),
    new Instruction("mrmovl", 5, 0,
        [ InstructionArg.MEM, InstructionArg.REG]),
    new Instruction("addl", 6, 0,
        [ InstructionArg.REG, InstructionArg.REG]),
    new Instruction("subl", 6, 1,
        [ InstructionArg.REG, InstructionArg.REG]),
    new Instruction("andl", 6, 2,
        [ InstructionArg.REG, InstructionArg.REG]),
    new Instruction("xorl", 6, 3,
        [ InstructionArg.REG, InstructionArg.REG]),
    new Instruction("sall", 6, 4,
        [ InstructionArg.REG, InstructionArg.REG]),
    new Instruction("sarl", 6, 5,
        [ InstructionArg.REG, InstructionArg.REG]),
    new Instruction("jmp", 7, 0,
        [ InstructionArg.LABEL]),
    new Instruction("jle", 7, 1,
        [ InstructionArg.CONST]),
    new Instruction("jl", 7, 2,
        [ InstructionArg.CONST]),
    new Instruction("je", 7, 3,
        [ InstructionArg.CONST]),
    new Instruction("jne", 7, 4,
        [ InstructionArg.CONST]),
    new Instruction("jge", 7, 5,
        [ InstructionArg.CONST]),
    new Instruction("jg", 7, 6,
        [ InstructionArg.CONST]),
    new Instruction("call", 8, 0,
        [ InstructionArg.CONST]),
    new Instruction("ret", 9, 0,
        []),
    new Instruction("pushl", 10, 0,
        [ InstructionArg.REG]),
    new Instruction("popl", 11, 0,
        [ InstructionArg.REG]),
    new Instruction("iaddl", 12, 0,
        [ InstructionArg.CONST,  InstructionArg.REG]),
    new Instruction("isubl", 12, 1,
        [ InstructionArg.CONST,  InstructionArg.REG]),
    new Instruction("iandl", 12, 2,
        [ InstructionArg.CONST,  InstructionArg.REG]),
    new Instruction("ixorl", 12, 3,
        [ InstructionArg.CONST,  InstructionArg.REG]),
    new Instruction("isall", 12, 4,
        [ InstructionArg.CONST,  InstructionArg.REG]),
    new Instruction("isarl", 12, 5,
        [ InstructionArg.CONST,  InstructionArg.REG]),
    new Instruction("leave", 13, 0,
        []),
    new Instruction("jreg", 14, 0,
        [ InstructionArg.REG]),
    new Instruction("jmem", 15, 0,
        [InstructionArg.MEM]),
]
