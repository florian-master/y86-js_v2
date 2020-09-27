import { MemoryException } from "../exceptions/simulatorException"
import { numberToByteArray, isByte, byteArrayToNumber } from "../numberUtils"

class Memory {
    /**
     * The last reachable address.
     */
    static LAST_ADDRESS = 0x1ffc
    static WORD_SIZE    = 4
    
    private _content    = new Map<number, number>()

    private _changedWordAddress = new Set<number>()

    getWordSize(){
        return Memory.WORD_SIZE;
    }

    getChangedMem(){
        let modifiedWords = new Map<number, number>()

        this._changedWordAddress.forEach((wordAddress) => {
            const word = this.readWord(wordAddress)
            if(word != 0) {
                modifiedWords.set(wordAddress, word)
            }
        })
        
        let json = {
            "wordSize" : this.getWordSize(),
            "startAddress" : 0,
            "maxAddress" : Memory.LAST_ADDRESS,
            "modifiedMem" : modifiedWords,
            "bytes" : this._content, 
        }

        return json
    }

    /**
     * Inserts a word starting at the given address.
     * If the register is 0xddccbbaa and we write it at 0x6,
     * the memory will be :
     * ...
     * 0x4 : 00 00 aa bb
     * 0x8 : cc dd 00 00
     * ...
     * @param address 
     * @param word
     */
    writeWord(address : number, word : number) {
        const bytes = numberToByteArray(word)
        bytes.forEach((byte, offset) => {
            this._writeByte(address + offset, byte)
        })
    }

    private _writeByte(address : number, byte : number) {
        Memory._checkAddress(address, 0)
        this._content.set(address, byte)

        const wordAddress = address - (address % Memory.WORD_SIZE)
        this._changedWordAddress.add(wordAddress)
    }

    /**
     * Returns a word starting at the given address.
     * If the memory is :
     * ...
     * 0x4 : aa bb cc dd
     * 0x8 : ee ff 00 11
     * ...
     * and we read at 0x4, we will get the 0xddccbbaa word.
     * @param address 
     */
    readWord(address : number) : number {
        let bytes = new Array<number>()

        for(let i = 0; i < Memory.WORD_SIZE; i++) {
            bytes.push(this.readByte(address + i))
        }

        return byteArrayToNumber(bytes)
    }

    /**
     * Returns the byte at the given address.
     * @param address 
     */
    readByte(address : number) : number {
        Memory._checkAddress(address, 0)

        const byte = this._content.get(address)
        return byte == undefined ? 0 : byte
    }

    static byteArrayToWord(bytes : number[]) {
        if(bytes.length > Memory.WORD_SIZE) {
            throw new Error("A word can not hold more than " + Memory.WORD_SIZE + " bytes (current : " + bytes.length + ")")
        }
        return byteArrayToNumber(bytes)
    }

    /**
     * Returns the 4 HSB of the current byte.
     */
    static HI4(value : number) : number {
        if(!isByte(value)) {
            throw new Error("Memory.HI4() was expecting a byte as argument (current : " + value + ")")
        }
        return (value >> 4) & 0xf
    }

    /**
     * Returns the 4 LSB of the current byte.
     */
    static LO4(value : number) : number {
        if(!isByte(value)) {
            throw new Error("Memory.LO4() was expecting a byte as argument (current : " + value + ")")
        }
        return value & 0xf
    }

    private static _checkAddress(address : number, size : number) {
        if(address < 0 || address + size > Memory.LAST_ADDRESS) {
            throw new MemoryException(address)
        }
    }

    /**
     * Loads in memory a .yo program.
     * The given string is supposed to be correct.
     * Therefore, the format is not checked and incorrect
     * lines are not used.
     * @param yo 
     */
    loadProgram(yo : string) {
        const lines = yo.split("\n")

        lines.forEach((line, index) => {
            const splittedLine = line.split("|")

            if(splittedLine.length == 1) {
                return // Line is considered as empty
            }
            else if(splittedLine.length != 2) {
                throw new Error("Line " + index + " : Invalid format (no or multiple '|' separators) --> '" + line + "'")
            }

            if(splittedLine.length == 2) {
                const instructionsWithAddress = splittedLine[0]
                const instructionsWithAddressSplitted = instructionsWithAddress.split(":")
                
                if(instructionsWithAddressSplitted.length == 1) {
                    return // There is no instruction on this line
                }
                else if(instructionsWithAddressSplitted.length != 2) {
                    throw new Error("Line " + index + " : Invalid format (no or multiple ':' separators) --> '" + instructionsWithAddress + "'")
                }
    
                if(instructionsWithAddressSplitted.length == 2) {
                    const firstAddress = Number(instructionsWithAddressSplitted[0])
                    const instructionAsString = instructionsWithAddressSplitted[1].trim()

                    if(instructionAsString.length == 0) {
                        return
                    }

                    const instruction = stringHexaToByteArray(instructionAsString)
                    
                    Memory._checkAddress(firstAddress, instruction.length)

                    if(Number.isNaN(firstAddress)) {
                        throw new Error('The given address (' + firstAddress + ') is not a number')
                    }

                    instruction.forEach((byte, offset) => {
                        this._writeByte(firstAddress + offset, byte)
                    })
                    // The program code is not supposed to be considered as changed memory
                    this._changedWordAddress.clear()
                }
            }
        })
    }
}


function stringHexaToByteArray(value : string) : number[] {
    if(!value.match('([0-9a-zA-Z][0-9a-zA-Z])+')) {
        throw new Error('The string "' + value + '" is not an hexadecimal number or has an odd number of digits')
    }
    
    let bytes = new Array<number>()

    for(let i = 0; i < value.length; i += 2) {
        bytes.push(Number('0x' + value.slice(i, i + 2)))
    }

    return bytes
}

export { Memory }