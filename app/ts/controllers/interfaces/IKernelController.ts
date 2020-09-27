import { ISimulator } from "../../model/interfaces/ISimulator";
import { ICompiler } from "../../model/interfaces/ICompiler";
import { IInstructionSet } from "../../model/interfaces/IInstructionSet";

export interface IKernelController {
    /**
     * Uses the specified kernel.
     * If the kernel does not exist, an exception is thrown.
     * The kernels list can be retrieved from 'getAvailableKernelNames' method.
     * @param name 
     */
    useKernel(name : string)    : void;

    /**
     * Returns the name of all the available kernels
     */
    getAvailableKernelNames()   : string[];

    /**
     * Returns the name of the kernel currently in use.
     */
    getCurrentKernelName() : string;

    /**
     * Returns the simulator used by the current toolchain.
     */
    getSim()            : ISimulator;

     /**
     * Returns the yas compiler used by the current toolchain.
     */
    getYas()            : ICompiler;

    /**
     * Returns the hcl2js compiler used by the current toolchain.
     */
    getHcl2js()         : ICompiler;

    /**
     * Returns the instruction set used by the current toolchain.
     */
    getInstructionSet() : IInstructionSet

    /**
     * Returns the word size used by the current toolchain.
     */
    getWordSize()       : number;
}