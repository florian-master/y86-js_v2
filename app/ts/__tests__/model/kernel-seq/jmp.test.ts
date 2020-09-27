import {Sim} from "../../../model/kernel-seq/sim";
import {registers_enum} from "../../../model/kernel-seq/registers";
import { KernelController } from "../../../controllers/kernelController";

test("jmp test", () => {
    let prog : string = "\n" +
        "                       | \n" +
        "  0x0000:              | .pos 0\n" +
        "  0x0000:              | Init:\n" +
        "  0x0000: 30f500010000 |     irmovl Stack, %ebp\n" +
        "  0x0006: 30f400010000 |     irmovl Stack, %esp\n" +
        "  0x000c: 7017000000   |     jmp Label\n" +
        "  0x0011: 30f00a000000 |     irmovl 10,%eax\n" +
        "                       |     \n" +
        "  0x0017:              | Label:\n" +
        "  0x0017: 30f30b000000 |     irmovl 11,%ebx\n" +
        "                       |     \n" +
        "  0x001d:              | .pos 0x100\n" +
        "  0x0100:              | Stack:\n" +
        "                       |     \n";

    let sim = new KernelController('seq').getSim() as Sim;
    sim.loadProgram(prog);

    sim.continue();
    expect(sim.registers.read(registers_enum.eax)).toBe(0);
    expect(sim.registers.read(registers_enum.ebx)).toBe(11);
});

test("jg test", () => {
    let prog : string = "\n" +
        "                       | \n" +
        "  0x0000:              | .pos 0\n" +
        "  0x0000:              | Init:\n" +
        "  0x0000: 30f500010000 |     irmovl Stack, %ebp\n" +
        "  0x0006: 30f400010000 |     irmovl Stack, %esp\n" +
        "  0x000c: 6041         |     addl %esp,%ecx\n" +
        "  0x000e: 7619000000   |     jg Label\n" +
        "  0x0013: 30f00a000000 |     irmovl 10,%eax\n" +
        "                       | \n" +
        "  0x0019:              | Label:\n" +
        "  0x0019: 30f30b000000 |     irmovl 11,%ebx\n" +
        "                       |     \n" +
        "  0x001f:              | .pos 0x100\n" +
        "  0x0100:              | Stack:\n" +
        "                       |     \n";

    let sim = new KernelController('seq').getSim() as Sim;
    sim.loadProgram(prog);

    sim.continue();
    expect(sim.registers.read(registers_enum.eax)).toBe(0);
    expect(sim.registers.read(registers_enum.ecx)).toBe(0x100);
    expect(sim.registers.read(registers_enum.ebx)).toBe(11);
});

test("jge test", () => {
    let prog : string = "\n" +
        "                       | \n" +
        "  0x0000:              | .pos 0\n" +
        "  0x0000:              | Init:\n" +
        "  0x0000: 30f500010000 |     irmovl Stack, %ebp\n" +
        "  0x0006: 30f400010000 |     irmovl Stack, %esp\n" +
        "  0x000c: 6041         |     addl %esp,%ecx\n" +
        "  0x000e: 6141         |     subl %esp,%ecx\n" +
        "  0x0010: 751b000000   |     jge Label\n" +
        "  0x0015: 30f00a000000 |     irmovl 10,%eax\n" +
        "                       | \n" +
        "  0x001b:              | Label:\n" +
        "  0x001b: 30f30b000000 |     irmovl 11,%ebx\n" +
        "                       |     \n" +
        "  0x0021:              | .pos 0x100\n" +
        "  0x0100:              | Stack:\n" +
        "                       |     \n";

    let sim = new KernelController('seq').getSim() as Sim;
    sim.loadProgram(prog);

    sim.continue();
    expect(sim.registers.read(registers_enum.eax)).toBe(0);
    expect(sim.registers.read(registers_enum.ecx)).toBe(0);
    expect(sim.registers.read(registers_enum.ebx)).toBe(11);
});