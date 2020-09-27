import {BasicController} from "./basicController";
import {IKernelController} from "./interfaces/IKernelController";
import {byteArrayToNumber, numberToByteArray, padStringNumber, toInt32, stringToNumber} from '../model/numberUtils'

export const MAX_STEPS = 10000

export class SimulatorController extends BasicController {
    constructor(kernelController : IKernelController) {
        super(kernelController)
    }

    getRegistersView() : any {
        let registers = this.kernelController.getSim().getRegistersView()
        let registersView : any[] = []

        for(const name in registers) {
            const value = registers[name]

            registersView.push({
                name: '%' + name,
                value_hex: '0x' + padStringNumber(value.toString(16), this.kernelController.getWordSize() * 2),
                value_dec: toInt32(value),
            })
        }

        return registersView
    }

    getStatusView() : any {
        let sim = this.kernelController.getSim() 

        let status_list = [
            {name: 'STAT', value: sim.getStatusView().status},
            {name: 'ERR', value: sim.getErrorMessage()},
            {name: 'PC', value: '0x' + padStringNumber(sim.getNewPC().toString(16), this.kernelController.getWordSize())}
        ]

        return status_list
    }

    getFlagsView() : any {
        let flagsView = this.kernelController.getSim().getFlagsView()

        let output : any[] = []
        for(let flagName in flagsView) {
            output.push({name: flagName, value: flagsView[flagName]})
        }
        
        return output
    }

    getCPUState() : any {
        const stageView = this.kernelController.getSim().getStageView()
        
        let stages : any[] = []
        for(const stageName in stageView) {
            const stage =  stageView[stageName]

            let indicators : any[] = []
            for(const indiactorName in stage) {
                let value = stage[indiactorName]
                value = typeof(value) === 'number' ? '0x' + padStringNumber(value.toString(16), this.kernelController.getWordSize()) : value

                indicators.push({name: indiactorName, value: value})
            }

            stages.push({name: stageName, indicators: indicators})
        }

        return stages
    }

    getChangedMemoryView() : any {
        const memoryView = this.kernelController.getSim().getMemoryView()

        let modifiedStringWords : any[] = []
        memoryView.modifiedMem.forEach((word : number, address : number) => {
            const wordAsString = byteArrayToNumber(numberToByteArray(word, memoryView.wordSize, true).reverse())
            modifiedStringWords.push({
               address: padStringNumber(address.toString(16), 4),
               value: padStringNumber(wordAsString.toString(16), memoryView.wordSize * 2)
            })
        })

        return {
            wordSize: memoryView.wordSize,
            startAddress: memoryView.startAddress,
            maxAddress: memoryView.maxAddress,
            words: modifiedStringWords
        }
    }

    getMemoryView() : any {
        const memoryView = this.kernelController.getSim().getMemoryView()
        const registers = this.kernelController.getSim().getRegistersView()

        let words = new Array<any>((memoryView.maxAddress - memoryView.startAddress)/4)

        for(let address = memoryView.startAddress; address < memoryView.maxAddress; address += memoryView.wordSize) {
            let value = ''

            for(let offset = 0; offset < memoryView.wordSize; offset++) {
                let byte = memoryView.bytes.get(address + offset)
                byte = byte == undefined ? 0 : byte
                value += padStringNumber(byte.toString(16), 2)
            }

            words[address / memoryView.wordSize] = {
                address: padStringNumber(address.toString(16), 4),
                value: value
            }
        }

        return {
                ebp: registers.ebp,
                esp: registers.esp,
                nullWord: "00000000",
                words: words,
                maxAddress: memoryView.maxAddress
        };
    }

    getDump() {
        const status = this.kernelController.getSim().getStatusView().status
        const flags = this.kernelController.getSim().getFlagsView()
        const registers = this.getRegistersView()
        const words = this.getChangedMemoryView().words

        let output = 'Exception status = ' + status + '\n'
        output += 'Error Message = "' + this.kernelController.getSim().getErrorMessage() + '"\n'
        output += 'Condition Codes:'

        for(let name in flags) {
            output += ' ' + name + '=' + (flags[name] ? '1' : '0')
        }
        output += '\n'

        output += 'Changed Register State:\n'
        registers.forEach((register : any) => {
            if(parseInt(register.value_dec) != 0) {
                output += register.name + ':    0x' + padStringNumber('0', this.kernelController.getWordSize() * 2) + '    ' + register.value_hex + '\n'
            }
        })

        output += 'Changed Memory State:\n'

        let sortedWords = words.sort((left : any, right : any) => {
            return left.address - right.address
        })
        sortedWords.forEach((word : any) => {
            output += word.address + ':    0x' + padStringNumber('0', this.kernelController.getWordSize() * 2) + '    ' + word.value + '\n'
        })

        return output
    }

    step() {
        return this.kernelController.getSim().step()
    }

    continue(breakpoints : number[] = [], maxSteps : number = MAX_STEPS) {
        return this.kernelController.getSim().continue(breakpoints, maxSteps)
    }

    reset() {
        this.kernelController.getSim().reset()
    }

    loadProgram(yo: string): void {
        this.kernelController.getSim().loadProgram(yo)
    }


    getNewPC() {
        return this.kernelController.getSim().getNewPC()
    }
}