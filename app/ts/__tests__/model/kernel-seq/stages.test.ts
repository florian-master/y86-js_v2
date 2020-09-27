import {Sim} from "../../../model/kernel-seq/sim";
import {decode, execute, fetch, memory, updatePC, writeBack} from "../../../model/kernel-seq/stages";
import {registers_enum} from "../../../model/kernel-seq/registers";
import { KernelController } from "../../../controllers/kernelController";

/**
 * Test all stages with instruction.
 * To work, the sim.memory.loadProgram should be functional.
 */

/**
 * Instruction to test
 */
let irmovl_prog : string =
    "  0x0000: 30f500010000 | irmovl 0x100, %ebp\n" +
    "                       | \n";

let rrmovl_prog : string =
    "  0x0000: 2001         | rrmovl %eax, %ecx\n" +
    "                       | \n";

let rmmovl_prog : string =
    "  0x0000: 402f00010000 | rmmovl %edx, 0x100\n" +
    "                       | \n";

let addl_prog : string =
    "  0x0000: 6011         | addl %ecx, %ecx\n" +
    "                       | \n";
let subl_prog : string =
    "  0x0000: 6111         | subl %ecx,%ecx\n" +
    "                       | \n";

/**
 * Some macro
 */
function load_sim(program : string){
    let sim = new KernelController('seq').getSim() as Sim;
    sim.memory.loadProgram(program);
    return sim;
}


/**
 * tests
 */
test("Test with irmovl", () => {
    let sim = load_sim(irmovl_prog);

    // pre context verification
    expect(sim.registers.read(registers_enum.ebp)).toBe(0);

    fetch(sim);
    expect(sim.context.icode).toBe(3);
    expect(sim.context.ifun).toBe(0);
    expect(sim.context.rb).toBe(registers_enum.ebp);
    expect(sim.context.ra).toBe(registers_enum.none);
    expect(sim.context.valC).toBe(0x100);
    expect(sim.context.valP).toBe(sim.context.pc + 6);

    decode(sim);
    expect(sim.context.valA).toBe(0);
    expect(sim.context.valB).toBe(0);
    expect(sim.context.dstE).toBe(registers_enum.ebp);

    execute(sim);
    expect(sim.context.valE).toBe(0x100);

    memory(sim);

    writeBack(sim);
    expect(sim.registers.read(registers_enum.ebp)).toBe(0x100);

    updatePC(sim);
    expect(sim.context.valP).toBe(6);
    expect(sim.context.newPC).toBe(sim.context.pc + 6);

});

test("Test with rrmovl", () => {
    // rrmovl %eax, %ecx

    let sim = load_sim(rrmovl_prog);

    // pre context
    sim.registers.write(registers_enum.eax, 0x10);
    expect(sim.registers.read(registers_enum.eax)).toBe(0x10);
    expect(sim.registers.read(registers_enum.ecx)).toBe(0x0);

    fetch(sim);
    expect(sim.context.icode).toBe(2);
    expect(sim.context.ifun).toBe(0);
    expect(sim.context.rb).toBe(registers_enum.ecx);
    expect(sim.context.ra).toBe(registers_enum.eax);
    expect(sim.context.valC).toBe(0);
    expect(sim.context.valP).toBe(sim.context.pc + 2);

    decode(sim);
    expect(sim.context.valA).toBe(0x10);
    expect(sim.context.valB).toBe(0);

    execute(sim);
    expect(sim.context.valE).toBe(0x10);

    memory(sim);

    writeBack(sim);
    expect(sim.registers.read(registers_enum.ecx)).toBe(0x10);

    updatePC(sim);
    expect(sim.context.valP).toBe(2);
    expect(sim.context.newPC).toBe(sim.context.pc + 2);
});

test("Test with rmmovl", () => {
    let sim = load_sim(rmmovl_prog);

    // pre context
    sim.registers.write(registers_enum.edx, 0x200);

    fetch(sim);
    expect(sim.context.icode).toBe(4);
    expect(sim.context.ifun).toBe(0);
    expect(sim.context.rb).toBe(registers_enum.none);
    expect(sim.context.ra).toBe(registers_enum.edx);
    expect(sim.context.valC).toBe(0x100);
    expect(sim.context.valP).toBe(sim.context.pc + 6);

    decode(sim);
    expect(sim.context.valA).toBe(0x200);
    expect(sim.context.valB).toBe(0);

    execute(sim);
    expect(sim.context.valE).toBe(0x100);

    memory(sim);
    expect(sim.memory.readWord(0x100)).toBe(0x200);

    writeBack(sim);

    updatePC(sim);
    expect(sim.context.valP).toBe(6);
    expect(sim.context.newPC).toBe(sim.context.pc + 6);

});

test("Test with addl", () => {
    let sim = load_sim(addl_prog);

    // pre context
    sim.registers.write(registers_enum.ecx, 0x200);

    fetch(sim);
    expect(sim.context.icode).toBe(0x6);
    expect(sim.context.ifun).toBe(0);
    expect(sim.context.rb).toBe(registers_enum.ecx);
    expect(sim.context.ra).toBe(registers_enum.ecx);
    expect(sim.context.valC).toBe(0x0);
    expect(sim.context.valP).toBe(sim.context.pc + 2);

    decode(sim);
    expect(sim.context.valA).toBe(0x200);
    expect(sim.context.valB).toBe(0x200);

    execute(sim);
    expect(sim.context.valE).toBe(0x400);

    memory(sim);

    writeBack(sim);
    expect(sim.registers.read(registers_enum.ecx)).toBe(0x400);

    updatePC(sim);
    expect(sim.context.valP).toBe(2);
    expect(sim.context.newPC).toBe(sim.context.pc + 2);

});

test("Test with addl", () => {
    let sim = load_sim(addl_prog);

    // pre context
    sim.registers.write(registers_enum.ecx, 0x200);

    fetch(sim);
    expect(sim.context.icode).toBe(0x6);
    expect(sim.context.ifun).toBe(0);
    expect(sim.context.rb).toBe(registers_enum.ecx);
    expect(sim.context.ra).toBe(registers_enum.ecx);
    expect(sim.context.valC).toBe(0x0);
    expect(sim.context.valP).toBe(sim.context.pc + 2);

    decode(sim);
    expect(sim.context.valA).toBe(0x200);
    expect(sim.context.valB).toBe(0x200);

    execute(sim);
    expect(sim.context.valE).toBe(0x400);

    memory(sim);

    writeBack(sim);
    expect(sim.registers.read(registers_enum.ecx)).toBe(0x400);

    updatePC(sim);
    expect(sim.context.valP).toBe(2);
    expect(sim.context.newPC).toBe(sim.context.pc + 2);

});

test("Test with subl", () => {
    let sim = load_sim(subl_prog);

    // pre context
    sim.registers.write(registers_enum.ecx, 0x200);

    fetch(sim);
    expect(sim.context.icode).toBe(0x6);
    expect(sim.context.ifun).toBe(1);
    expect(sim.context.rb).toBe(registers_enum.ecx);
    expect(sim.context.ra).toBe(registers_enum.ecx);
    expect(sim.context.valC).toBe(0x0);
    expect(sim.context.valP).toBe(sim.context.pc + 2);

    decode(sim);
    expect(sim.context.valA).toBe(0x200);
    expect(sim.context.valB).toBe(0x200);

    execute(sim);
    expect(sim.context.valE).toBe(0);

    memory(sim);

    writeBack(sim);
    expect(sim.registers.read(registers_enum.ecx)).toBe(0);

    updatePC(sim);
    expect(sim.context.valP).toBe(2);
    expect(sim.context.newPC).toBe(sim.context.pc + 2);

});