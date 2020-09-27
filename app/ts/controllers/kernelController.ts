import * as yasDefault from "../model/yas/yas"
import * as hcl2jsDefault from "../model/hcl2js/hcl2js"
import * as instructionSetDefault from "../model/instructionSet"
import { ICompiler } from "../model/interfaces/ICompiler"
import { ISimulator } from "../model/interfaces/ISimulator"
import { IInstructionSet } from "../model/interfaces/IInstructionSet"
import { IKernelController } from "./interfaces/IKernelController"

class Toolchain {
    simulator       : ISimulator
    yas             : ICompiler
    hcl2js          : ICompiler
    instructionSet  : IInstructionSet 
    wordSize        : number

    constructor(simulator : ISimulator, yas : ICompiler, hcl2js : ICompiler, instructionSet : IInstructionSet, wordSize : number) {
        this.simulator = simulator
        this.yas = yas
        this.hcl2js = hcl2js
        this.instructionSet = instructionSet

        this._checkWordSize(wordSize)
        this.wordSize = wordSize
    }

    private _checkWordSize(wordSize : number) {
        if(wordSize < 0) {
            throw new Error('A word size can not be negative')
        }
    }
}

let toolchainsGenerator : Map<string, () => Toolchain> = new Map<string, () => Toolchain>()

export class KernelController implements IKernelController {
    private static DEFAULT_TOOLCHAIN = "seq"
    private _currentToolchain : Toolchain
    private _currentKernelName : string
    
    constructor(name : string = KernelController.DEFAULT_TOOLCHAIN) {
        if(toolchainsGenerator.has(name)) {
            this._currentToolchain = toolchainsGenerator.get(name)!()
            this._currentKernelName = name
        } else {
            throw new Error("The toolchain for the kernel '" + name + "' does not exist.\nAvailable: " + this.getAvailableKernelNames())
        }
    }

    useKernel(name: string): void {
        if(toolchainsGenerator.has(name)) {
            this._currentToolchain = toolchainsGenerator.get(name)!()
            this._currentKernelName = name
        } else {
            throw new Error("The toolchain for the kernel '" + name + "' does not exist.\nAvailable: " + this.getAvailableKernelNames())
        }
    }    
    
    getAvailableKernelNames(): string[] {
        let names : string[] = []

        toolchainsGenerator.forEach((_, name) => {
            names.push(name)
        })

        return names
    }

    getCurrentKernelName() : string {
        return this._currentKernelName
    }

    getSim(): ISimulator {
        return this._currentToolchain.simulator
    }
    getYas(): ICompiler {
        return this._currentToolchain.yas
    }
    getHcl2js(): ICompiler {
        return this._currentToolchain.hcl2js
    }
    getInstructionSet(): IInstructionSet {
        return this._currentToolchain.instructionSet
    }
    getWordSize() : number {
        return this._currentToolchain.wordSize
    }
}

/*
 * Toolchain generation functions below
 */

import * as simSeq from "../model/kernel-seq/sim"
import * as registersSeq from "../model/kernel-seq/registers"
import * as hclDefaultSeq from "../model/kernel-seq/defaultHclCode"

toolchainsGenerator.set("seq", () => {
    let instructionSet = new instructionSetDefault.InstructionSet()
    const wordSize = 4

    let yas = new yasDefault.Yas(registersSeq.registers_enum, instructionSet, wordSize)
    let hcl2js = new hcl2jsDefault.Hcl2js()
    
    let sim = new simSeq.Sim(instructionSet)
    const result = hcl2js.assemble(hclDefaultSeq.defaultSourceCode)
    if(result.errors.length != 0) {
        throw new Error('Failed to create toolchain seq because of HCL compilation failure')
    }
    sim.insertHclCode(result.output)

    return new Toolchain(
        sim,
        yas,
        hcl2js,
        instructionSet,
        wordSize
    )
})
