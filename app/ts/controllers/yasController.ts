import { IKernelController } from "./interfaces/IKernelController";
import { ICompiler, CompilationResult } from "../model/interfaces/ICompiler";
import { BasicController } from "./basicController"

export class YasController extends BasicController implements ICompiler {

    constructor(kernelController : IKernelController) {
        super(kernelController)
    }

    /**
     * Compiles the given sources and if there are no errors,
     * put the code into the simulator's memory.
     * @param src 
     */
    assemble(src : string) : CompilationResult {
        const compilationResult = this.kernelController.getYas().assemble(src)
        
        if(compilationResult.errors.length == 0) {
            this.kernelController.getSim().loadProgram(compilationResult.output)
        }

        return compilationResult
    }
}