import { registers_enum } from "./registers"
import { CC } from "./cc";

/**
 * Context is an abstraction of buses and all value used by the CPU
 * during the execution.
 */
class Context {
    // Inner state
    pc      : number = 0;
    valP    : number = 0;

    // Instruction
    icode   : number = 0;
    ifun    : number = 0;
    ra      : number = registers_enum.none;
    rb      : number = registers_enum.none;
    valC    : number = 0;

    // Registers output
    valA    : number = 0;
    valB    : number = 0;
    srcA    : number = registers_enum.none;
    srcB    : number = registers_enum.none;

    // Registers input
    dstE    : number = registers_enum.none;
    dstM    : number = registers_enum.none;

    // ALU input
    aluA    : number = 0;
    aluB    : number = 0;

    // ALU output
    valE    : number = 0;

    // Condition flag
    cc      : CC = CC.NONE;
    bcond   : boolean = false;

    // Memory output
    valM    : number = 0;

    // update pc output
    newPC   : number = 0;

    //instructionSet = {}
}

export {Context};