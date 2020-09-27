import { IKernelController } from "./interfaces/IKernelController";
import { ICompiler, CompilationResult } from "../model/interfaces/ICompiler";
import { BasicController } from "./basicController"

export class HclController extends BasicController implements ICompiler {

    constructor(kernelController : IKernelController) {
        super(kernelController)
    }

    /**
     * Compiles the given hcl code.
     * If there are no errors, the code is injected into the simulator.
     * @param src 
     */
    assemble(src : string) : CompilationResult {
        const compilationResult = this.kernelController.getHcl2js().assemble(src)

        if(compilationResult.errors.length == 0) {
            this.kernelController.getSim().insertHclCode(compilationResult.output)
        }

        return compilationResult
    }
}