import { IKernelController } from "./interfaces/IKernelController";

export class BasicController {
    kernelController : IKernelController

    constructor(kernelController : IKernelController) {
        this.kernelController = kernelController
    }
}