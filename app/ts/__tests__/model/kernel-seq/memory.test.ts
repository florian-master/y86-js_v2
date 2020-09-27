import { Memory } from "../../../model/kernel-seq/memory";

test("Word test", () => {
    let word = Memory.byteArrayToWord([0])

    expect(word).toBe(0)

    // More than 4 bytes
    expect(() => {
        Memory.byteArrayToWord([45, 45, 75, 78, 7])
    }).toThrow()

    // Byte underflow
    expect(() => {
        Memory.byteArrayToWord([-129, 45, 75, 78])
    }).toThrow()

    // Byte overflow
    expect(() => {
        Memory.byteArrayToWord([4, 45, 75, 256])
    }).toThrow()

    // Limit of bytes bounds
    expect(() => {
        Memory.byteArrayToWord([-127, 45, 75, 255])
    }).not.toThrow()

    word = Memory.byteArrayToWord([0x00, 0xef, 0xcd, 0xff])

    // Checks every byte to be what ther're expected to be.
    expect(word & 0xff).toBe(0x00)
    expect(word >> 8  & 0xff).toBe(0xef)
    expect(word >> 16 & 0xff).toBe(0xcd)
    expect(word >> 24 & 0xff).toBe(0xff)
})

test("Memory access test", () => {
    let memory = new Memory()
    
    let word = Memory.byteArrayToWord([0xdd, 0xcc, 0xbb, 0xaa])

    // Write at address 0
    memory.writeWord(0x0, word)
    
    expect(memory.readByte(0)).toBe(0xdd)
    expect(memory.readByte(1)).toBe(0xcc)
    expect(memory.readByte(2)).toBe(0xbb)
    expect(memory.readByte(3)).toBe(0xaa)

    // Checks the conversion word <-> memory is correct
    expect(memory.readWord(0x0)).toBe(word)

    // Write at 0x2. It should write on two differents words
    const address = Memory.WORD_SIZE / 2
    memory.writeWord(address, word)
    expect(memory.readWord(address)).toBe(word)

    expect(memory.readWord(0x0)).toBe(Memory.byteArrayToWord([0xdd, 0xcc, 0xdd, 0xcc]))
    expect(memory.readWord(address)).toBe(Memory.byteArrayToWord([0xdd, 0xcc, 0xbb, 0xaa]))
    expect(memory.readWord(address + Memory.WORD_SIZE / 2)).toBe(Memory.byteArrayToWord([0xbb, 0xaa]))

    // Checks we can not underflow
    expect(() => {
        memory.readByte(-1)
    }).toThrow()

    // Checks we can access the last byte of memory
    expect(() => {
        memory.readByte(Memory.LAST_ADDRESS)
    }).not.toThrow()

    // Checks we can not overflow
    expect(() => {
        memory.readByte(Memory.LAST_ADDRESS + 1)
    }).toThrow()

    // We should be able to access the last word
    expect(() => {
        memory.readWord(Memory.LAST_ADDRESS - Memory.WORD_SIZE + 1)
    }).not.toThrow()

    // We can not access the last word if their are less than 3 bytes left
    expect(() => {
        memory.readWord(Memory.LAST_ADDRESS - Memory.WORD_SIZE + 2)
    }).toThrow()
})

test("Memory loads program test", () => {
    let memory = new Memory()
    let program = `
    | 
    0x0000:              | .pos 0
    0x0000:              | Init:
    0x0000: 30f418000000 |     irmovl Stack, %esp
                         |     
    0x0006:              | .pos 0x14
    0x0014: f4ffffff     | .long -12
    0x0018:              | Stack:
    0x0018:              |     .align 12
    0x0018: 7018000000   |     jmp Stack
                         |            
    `

    memory.loadProgram(program)
    let result = 
    [0x30, 0xf4, 0x18, 0x00,
     0, 0, 0, 0,
     0, 0, 0, 0,
     0, 0, 0, 0,
     0, 0, 0, 0,
     0xf4, 0xff, 0xff, 0xff,
     0x70, 0x18, 0, 0]

    // Checks every byte is well-set in memory
    for(let i = 0; i < result.length; i++) {
        expect(memory.readByte(i)).toBe(result[i])
    }
})