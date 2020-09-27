import { simStatus } from "../status";

export interface ISimulator {
    /**
     * Makes a step and returns the status after the execution.
     */
    step() : simStatus

    /**
     * Reset all the components of the simulator.
     */
    reset() : void

    /**
     * Returns a json holding CPU stages content.
     * It is of the form : { "stageName1" : {"val1" : val1, ...}, "stageName2" : {"val1" : val1, ...}, ...}
     */
    getStageView() : any 

    /**
     * Returns a json holding registers names and their values.
     * It is of the form : { "registerName1" : value, "registerName2" : value, ...}
     */
    getRegistersView() : any

    /**
     * Returns a json holding information about the memory.
     * It contains the objects :
     *  - wordSize : Size of a word in bytes.
     *  - startAddress : The first address (probably 0).
     *  - maxAddress : The last address of the memory.
     *  - modifiedMem : A map containing every modified words (address -> word).
     * A word is considered modified when it is not equal to 0. The code injected in the memory
     * is not considered as modified memory, even if its value is different from 0.
     *  - bytes : The map (address -> byte) containing all the words 
     * (even those representing the user's code).
     */
    getMemoryView() : any

    /**
     * Returns a json holding the status name.
     * It is of the form { "status" : statusName }
     */
    getStatusView() : any

    /**
     * Returns a json holding the differents flags (name and value.)
     * It is of the form { "flagName1" : value, ... }
     */
    getFlagsView() : any

    /**
     * Takes a compiled ys program and injects it into its memory.
     * Throws an exception if an error occurs. 
     * @param yo 
     */
    loadProgram(yo : string) : void

    /**
     * Injects HCL code.
     * @param js 
     */
    insertHclCode(js : string) : void

    /**
     * Returns the message of the last error.
     */
    getErrorMessage() : string

    /**
     * Executes steps until the program finish or reach a breakpoint.
     * If it executes more than maxSteps steps, the program is halted.
     * maxSteps < 0 means no limits.
     * @param breakpoints 
     */
    continue(breakpoints : Array<number>, maxSteps : number) : simStatus

    /**
     * Returns the pc of the next instruction.
     */
    getNewPC() : number

    /**
     * Sets the pc of the next instruction.
     * @param newPC 
     */
    setNewPC(newPC : number) : void

    /**
     * Returns the icode representing the haslt instruction.
     */
    getHaltIcode() : number;
}
