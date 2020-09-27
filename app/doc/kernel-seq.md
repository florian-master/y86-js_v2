# Sequential kernel

Sequential kernel represents a simple computer working with y86 instruction set and 32bits. It has its memory, registers and Arithmetic & Logic Unit.

## Arithmetic & Logic Unit

ALU class contains the calculation flags (`ZF`, `SF`, and `OF`). It can perform all calculation of the kernel.
This is a modular module. **It was made to be reused in other kernels if needed.**

### Flags

ALU contains kernels flags in an array. The order of the flags in the array should be predetermined by the `CC` enum.

### Dealing with numbers

ALU of this kernel works with 32 bits signed integers. That's a tricky move in typescript and it need to use a Uint32 array to cast default number of javascript. 
For testing if a number is positive or not you can test if the sign bit is set to 1 or not. For convenience, the data respect the big endian convention in the code.

### Main function

There is basicaly three things ALU can do:

1. Make a computation. The computation `A OP B`, with the function `compute_alu()`
2. Set the flags to the correct position with `compute_cc()`.
3. Says if wether or not the CPU should take the jump with `compute_bch()`.

The first two functions need an alufunction to work. The alufunction are pre fixed by the `alufct` enum (in *aluEnum.ts*). That means that alu behavior is predetermined by the programmer.
That also means the iCode determined by the user should strictly follow that enum. If an instruction need to do an addition it should use the `A_ADD` ifun (`0` at the moment).

Regarding `compute_bch()`, this is not an ALU circuit in the original description. But since the CC and BCH are in execution stage it is simpler to do it in ALU class.
Like alufunction, jumps have predefined ifun, set by `JMP_enum`.

## Context

This represents all the buses of the CPU with their value. It does not say where the buses are connected (this is the HCL and stage job).

## Memory

The memory works with 8 bytes words. Since it contains the programme code, it has a `load_program()` function to load a *\*.yo* into the beginning of the memory.

## Registers

This represents the registers of the CPU. It is an Uint32 array to deal with alu value who are also Uint32.
The place of the register in the array are defined by `registers_enum`, they are important because they are also used by the instruction.

Since javacript is not the best language to deal with enum, a side array for registers's names is used.

## Stages

All stages have a single function to work with. It facilitate the clarity of the code but the first thought was to separate the HCL context and the Sim context, to preserve the latter.
The HCL have a restraint context. But this doesn't allow HCL modularity so it was deprecated but separated stages stay.

All stages use HCL functions. Those defined the behaviour of the stages and how they put a certain value on buses, using registers or memory controllers.
Users cannot add a new function in HCL if they are not defined in stages. HCL doesn't defined the notion of stage, so it's the developpers job to create new ones and to implement them in stage.

## Sim

Main kernel classes. It calls all stage by step or with a continue mode.
For the `continue()` function it is possible to pass breakpoints in parameters. The execution will stop if one of the breakpoints is encounter.
