import {Sim} from "../../../model/kernel-seq/sim"
import {simStatus} from "../../../model/status"
import {registers_enum} from "../../../model/kernel-seq/registers";
import { KernelController } from "../../../controllers/kernelController";

const program = "                       | \n" +
    "  0x0000:              | Init:\n" +
    "  0x0000: 30f02a000000 |     irmovl 42, %eax\n" +
    "  0x0006: 400f13000000 |     rmmovl %eax, 0x13\n" +
    "  0x000c: 503f13000000 |     mrmovl 0x13, %ebx\n" +
    "  0x0012: 10           | halt\n" +
    "                       | ";

test("simulation test", () => {
    let sim = new KernelController('seq').getSim() as Sim;
    sim.memory.loadProgram(program);

    expect(sim.step()).toBe(simStatus.AOK);
    expect(sim.registers.read(registers_enum.eax)).toBe(0x2a);

    sim.reset();
    sim.memory.loadProgram(program);
    expect(sim.continue()).toBe(simStatus.HALT);
    expect(sim.registers.read(registers_enum.eax)).toBe(0x2a);
    expect(sim.registers.read(registers_enum.ebx)).toBe(0x2a);
});

test("Breakpoints tests", () => {
    let sim = new KernelController('seq').getSim() as Sim;
    sim.memory.loadProgram(program);

    expect(sim.continue([0xc])).toBe(simStatus.AOK);
    expect(sim.registers.read(registers_enum.eax)).toBe(0x2a);
    expect(sim.registers.read(registers_enum.ebx)).toBe(0);
});
