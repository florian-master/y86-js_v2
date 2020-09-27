import { Instruction } from '../instructionSet'

/**
 * Represents a consistent set of instructions.
 */
export interface IInstructionSet {
    /**
     * Returns the map (instruction name -> instruction) holding all the instructions.
     */
    getHandle() : Map<string, Instruction>;

    /**
     * Helper functions to call addInstruction method multiple times.
     * @param instructions All the instructions to add.
     */
    addInstructions(instructions : Instruction[]) : void;

    /**
     * Adds the instruction if and only if the instruction set is still
     * in a consistent state after the insertion.
     * If the instruction can not be added, an exception is thrown.
     * @param instruction 
     */
    addInstruction(instruction : Instruction) : void;

    /**
     * Returns the list of instructions initially used by the instruction set,
     */
    getDefaultInstructions() : Instruction[];

    /**
     * Returns the icode of the halt instruction.
     */
    getHaltCode() : number;

    /**
     * Clears all ths instructions from the instruction set.
     */
    clear() : void
}