import {Registers, registers_enum} from "./registers"
import {Context} from "./context";
import {Memory} from "./memory";
import * as stages from "./stages";
import {simStatus} from "../status"
import {Alu} from "./alu";
import { HCL } from "../hcl"
import {ISimulator} from "model/interfaces/ISimulator";
import {IInstructionSet} from "model/interfaces/IInstructionSet";
import {InstructionSet} from "../instructionSet";
import * as defaultHclCode from './defaultHclCode'

export class Sim implements ISimulator {
    context: Context = new Context();
    registers: Registers = new Registers();
    memory : Memory = new Memory();
    alu : Alu = new Alu();
    status : simStatus = simStatus.AOK;
    errorMessage : string = "";
    hcl : HCL
    
    private instrSet: IInstructionSet;

    constructor(instructionSet : IInstructionSet = new InstructionSet()) {
        this.reset();

        this.instrSet = instructionSet
        this.hcl = new HCL(instructionSet)
    }

    /**
     * Execute a single instruction with all stage in regular order.
     * It set the CPU status to HALT in case of error.
     */
    step() : simStatus {
        try {
            this.hcl.setCtx(this.context);
            stages.fetch(this);
            stages.decode(this);
            stages.execute(this);
            stages.memory(this);
            stages.writeBack(this);
            stages.updatePC(this);
        } catch(error) {
            this.status = simStatus.HALT;
            this.errorMessage = error;
        }

        return this.status;
    }

    /**
     * Execute all the program, while the status is AOK.
     * It accepts breakpoints and stop when it encounters one.
     * It returns the status of the CPU when it finish.
     * @param breakpoints The pc where to stop.
     */
    continue(breakpoints : Array<number> = [], maxSteps : number = 10000) : simStatus {
        let stepNum = 0

        while(this.status == simStatus.AOK && (stepNum < maxSteps || maxSteps < 0)) {
            this.step();
            // breakpoints stop
            for(let brk of breakpoints){
                if (this.context.newPC == brk) {
                    return this.status;
                }
            }
            stepNum++
        }

        if(this.status == simStatus.AOK && stepNum == maxSteps) {
            this.status = simStatus.HALT
            this.errorMessage = "Sim : Max number of steps reached (" + maxSteps + ")"
        }

        return this.status;
    }

    /**
     * Reset the CPU. Clean the context and registers, set the status
     * to AOK and erase error message.
     */
    reset(): void {
        this.context = new Context();
        this.registers = new Registers();
        this.memory = new Memory();
        this.alu = new Alu();
        this.status = simStatus.AOK;
        this.errorMessage = ""
    }

    /**
     * Return a JSON with all the buses value sorted by stages.
     */
    getStageView() {
        return {
            "fetch" : {
                "icode" : this.context.icode,
                "ifun" : this.context.ifun,
                "PC" : this.context.pc
            },
            "decode" : {
                "ra" : this.registers.getRegisterName(this.context.ra),
                "rb" : this.registers.getRegisterName(this.context.rb),
            },
            "execute" : {
                "valC" : this.context.valC,
                "valA" : this.context.valA,
                "valB" : this.context.valB
            },
            "memory" : {
                "valP" : this.context.valP,
                "valA" : this.context.valA,
                "valE" : this.context.valE
            },
            "writeback" : {
                "valE" : this.context.valE,
                "valM" : this.context.valM,
                "srcA" : this.context.srcA,
                "srcB" : this.context.srcB,
                "dstM" : this.context.dstM,
                "dstE" : this.context.dstE,
            },
            "updatePC" : {
                "valP" : this.context.valP
            }
        };
    }

    getRegistersView() {
        return {
            "eax" : this.registers.read(registers_enum.eax),
            "ebx" : this.registers.read(registers_enum.ebx),
            "ecx" : this.registers.read(registers_enum.ecx),
            "edx" : this.registers.read(registers_enum.edx),
            "esi" : this.registers.read(registers_enum.esi),
            "edi" : this.registers.read(registers_enum.edi),
            "esp" : this.registers.read(registers_enum.esp),
            "ebp" : this.registers.read(registers_enum.ebp),
        };
    }

    getMemoryView() {
        return this.memory.getChangedMem();
    }
    
    getStatusView() {
        return {
            "status" : simStatus[this.status]
        };
    }

    /**
     * Load the programme into the beging of the memory.
     * @param yo
     */
    loadProgram(yo: string): void {
        this.memory.loadProgram(yo);
    }

    /**
     * Inject the HCL code into the CPU.
     * The HCL code will be used by all the stages to find the correct
     * behavior to follow.
     * @param js
     */
    insertHclCode(js: string): void {
        this.hcl.setHclCode(js);
    }

    getErrorMessage() : string {
        return this.errorMessage;
    }

    getNewPC() : number {
        return this.context.newPC
    }

    setNewPC(newPC : number) : void {
        this.context.newPC = newPC
    }

    getFlagsView(){
        return {
            "ZF" : this.alu.getZF(),
            "OF" : this.alu.getOF(),
            "SF" : this.alu.getSF()
        }
    }

    /**
     * Return the icode of the halt instruction.
     */
    getHaltIcode() {
        // @ts-ignore
        return this.instrSet.getHaltCode();
    }
}