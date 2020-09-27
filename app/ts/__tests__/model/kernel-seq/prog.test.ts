import {Sim} from "../../../model/kernel-seq/sim";
import {registers_enum} from "../../../model/kernel-seq/registers";
import { KernelController } from "../../../controllers/kernelController"

let prog = "\n" +
    "                       | # Execution begins at address 0\n" +
    "  0x0000:              | \t    .pos 0\n" +
    "  0x0000: 30f400010000 | init:\tirmovl Stack, %esp  \t# Set up Stack pointer\n" +
    "  0x0006: 701c000000   | \t    jmp Main\t\t# Execute main program\n" +
    "                       | \n" +
    "                       | # Array of 4 elements\n" +
    "  0x000b:              | \t    .align 4\n" +
    "  0x000c: 0d000000     | array:\t.long 0xd\n" +
    "  0x0010: c0000000     |         .long 0xc0\n" +
    "  0x0014: 000b0000     |         .long 0xb00\n" +
    "  0x0018: 00a00000     |         .long 0xa000\n" +
    "                       | \n" +
    "  0x001c: 30f004000000 | Main:\tirmovl 4,%eax\n" +
    "  0x0022: a00f         |         pushl %eax\t# Push 4\n" +
    "  0x0024: 30f20c000000 |         irmovl array,%edx\n" +
    "  0x002a: a02f         |         pushl %edx      # Push array\n" +
    "  0x002c: 8032000000   |         call Sum\t# Sum(array, 4)\n" +
    "  0x0031: 00           |         halt\n" +
    "                       | \n" +
    "                       | # int Sum(int *Start, int Count)\n" +
    "  0x0032: 501404000000 | Sum:\tmrmovl 4(%esp),%ecx \t# ecx = Start\n" +
    "  0x0038: 502408000000 |         mrmovl 8(%esp),%edx\t# edx = Count\n" +
    "  0x003e: 30f000000000 |         irmovl 0, %eax\t\t# sum = 0\n" +
    "  0x0044: 6222         |         andl   %edx,%edx\n" +
    "  0x0046: 7368000000   |         je     End\n" +
    "                       | \n" +
    "  0x004b: 506100000000 | Loop:\tmrmovl (%ecx),%esi      # get *Start\n" +
    "  0x0051: 6060         |         addl %esi,%eax          # add to sum\n" +
    "  0x0053: 30f304000000 |         irmovl 4,%ebx\n" +
    "  0x0059: 6031         |         addl %ebx,%ecx          # Start++\n" +
    "  0x005b: 30f3ffffffff |         irmovl -1,%ebx\n" +
    "  0x0061: 6032         |         addl %ebx,%edx          # Count--\n" +
    "  0x0063: 744b000000   |         jne    Loop            # Stop when 0\n" +
    "  0x0068: 90           | End:\tret\n" +
    "  0x0069:              | \t.pos 0x100\n" +
    "  0x0100:              | Stack:\t# The stack goes here\n" +
    "                       | \n";

let prog1ys : string = "\n" +
    "                       | # prog1: Pad with 3 nop's\n" +
    "  0x0000: 30f20a000000 |   irmovl 10,%edx\n" +
    "  0x0006: 30f003000000 |   irmovl  3,%eax\n" +
    "  0x000c: 10           |   nop\n" +
    "  0x000d: 10           |   nop\n" +
    "  0x000e: 10           |   nop\n" +
    "  0x000f: 6020         |   addl %edx,%eax\n" +
    "  0x0011: 00           |   halt\n" +
    "                       |   \n";


test("prog test", () => {
    let sim = new KernelController('seq').getSim() as Sim;
    sim.memory.loadProgram(prog);

    sim.continue();

    expect(sim.registers.read(registers_enum.eax)).toBe(0xabcd);
    expect(sim.registers.read(registers_enum.ecx)).toBe(0x1c);
    expect(sim.registers.read(registers_enum.edx)).toBe(0x0);
    expect(sim.registers.read(registers_enum.ebx)).toBe(0xffffffff);
    expect(sim.registers.read(registers_enum.esp)).toBe(0x000000f8);
    expect(sim.registers.read(registers_enum.ebp)).toBe(0x00000000);
    expect(sim.registers.read(registers_enum.esi)).toBe(0x0000a000);
    expect(sim.registers.read(registers_enum.edi)).toBe(0x00000000);
});

test("prog1ys test", () => {
    let sim = new KernelController('seq').getSim() as Sim;
    sim.memory.loadProgram(prog1ys);

    sim.continue();

    expect(sim.registers.read(registers_enum.eax)).toBe(0xd);
    expect(sim.registers.read(registers_enum.ecx)).toBe(0);
    expect(sim.registers.read(registers_enum.edx)).toBe(0xa);
    expect(sim.registers.read(registers_enum.ebx)).toBe(0);
    expect(sim.registers.read(registers_enum.esp)).toBe(0);
    expect(sim.registers.read(registers_enum.ebp)).toBe(0);
    expect(sim.registers.read(registers_enum.esi)).toBe(0);
    expect(sim.registers.read(registers_enum.edi)).toBe(0);

    expect(sim.context.pc).toBe(0x11);
});