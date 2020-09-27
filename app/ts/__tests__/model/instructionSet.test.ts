import { InstructionSet, Instruction, InstructionArg } from "../../model/instructionSet";

test('No overlap between fields', () => {
    let is = new InstructionSet()
    is.clear()

    is.addInstruction(new Instruction("instr", 0, 0, []))

    // Same instruction name 
    expect(() => {
        is.addInstruction(new Instruction("instr", 1, 0, []))
    }).toThrow()

    // Same instruction icode/ifun pair
    expect(() => {
        is.addInstruction(new Instruction("instr2", 0, 0, []))
    }).toThrow()

    // Same icode but not ifun
    is.addInstruction(new Instruction("instr2", 0, 1, []))
})

test('Instructions sizes', () => {
    let is = new InstructionSet()
    is.clear()

    // 0-sized instructions are allowed
    is.addInstruction(new Instruction("instr", 0, 0, []))
    is.clear()

    // An instruction can not have more than 2 arguments
    expect(() => {
        is.addInstruction(new Instruction("instr", 0, 0,
        [InstructionArg.CONST, InstructionArg.REG, InstructionArg.MEM]))
    }).toThrow()
})

test('icode / ifun', () => {
    let is = new InstructionSet()
    is.clear()

    // Negative icode
    expect(() => {
        is.addInstruction(new Instruction("instr", -1, 0, []))
    }).toThrow()

    // Higher than 4 bits icode
    expect(() => {
        is.addInstruction(new Instruction("instr", 16, 0, []))
    }).toThrow()

    // Negative ifun
    expect(() => {
        is.addInstruction(new Instruction("instr", 0, -1, []))
    }).toThrow()

    // Higher than 4 bits ifun
    expect(() => {
        is.addInstruction(new Instruction("instr", 0, 16, []))
    }).toThrow()
})

test('Instruction name', () => {
    let is = new InstructionSet()
    is.clear()

    // Empty name
    expect(() => {
        is.addInstruction(new Instruction("", 0, 0, []))
    }).toThrow()
})

test('Instruction arguments position', () => {
    let is = new InstructionSet()
    is.clear()

    // The given arg type does not exist
    expect(() => {
        is.addInstruction(new Instruction("instr", 0, 0,
        [999]))
    }).toThrow()

    // There is a maximum of two registers
    expect(() => {
        is.addInstruction(new Instruction("instr", 0, 0,
        [InstructionArg.REG, InstructionArg.REG, InstructionArg.REG]))
    }).toThrow()

    // There is a maximum of one valc
    expect(() => {
        is.addInstruction(new Instruction("instr", 0, 0,
        [InstructionArg.CONST, InstructionArg.CONST]))
    }).toThrow()
})

test('Default instruction set is not impacted when modifying instructions from instruction set', () => {
    let is = new InstructionSet()
    
    is.getHandle().get('addl')!.icode = 999
    is.getHandle().get('addl')!.ifun = 999
    is.getHandle().get('addl')!.args[0] = 999

    is.getDefaultInstructions().forEach((instruction : Instruction) => {
        if(instruction.name === 'addl') {
            expect(instruction.icode).not.toBe(999)
            expect(instruction.ifun).not.toBe(999)
            expect(instruction.args[0]).not.toBe(999)
        }
    })
})