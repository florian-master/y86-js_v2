/**
 * Enum wich contains all the registers plus the special register "none".
 * Should be identical with yas compiler
 */
enum registers_enum {
    eax,
    ecx,
    edx,
    ebx,
    esp,
    ebp,
    esi,
    edi,
    none = 0xf,
}

/**
 * Class who contains all the registers of the CPU.
 * Based on the registers enumerate, it create automatically all the registers and init them with an empty word.
 * Registers works with Word type. They have no treatment on data. They just store word.
 */
class Registers {
    /**
     * Array for all registers. Size based on the size of "registers" enumerate.
     */
    content: Uint32Array = new Uint32Array(Object.keys(registers_enum).length);
    registersNames: Array<string> = [];

    /**
     * Set all registers to the default value 0.
     */
    constructor() {
        for (let key in registers_enum) {
            this.content[key] = 0;
        }
        this.setRegistersNames();
    }

    /**
     * Reset all registers with an empty value.
     */
    reset(){
        for (let key in registers_enum) {
            this.content[key] = 0;
        }
    }


    /**
     * Write Word in register @param register.
     * @param register
     * @param value
     */
    write(register: registers_enum, value: number) {
        this.content[register] = value;
    }

    /**
     * Return value contains in one register.
     * @param register
     */
    read(register: registers_enum) {
        return this.content[register];
    }

    /**
     * Set all the registers name in an array of string
     */
    setRegistersNames() {
        let i: number = 0;
        for (let enumMember in registers_enum) {
            let isValueProperty = parseInt(enumMember, 10) >= 0;
            if (isValueProperty) {
                this.registersNames[i] = registers_enum[enumMember];
                i++;
            }
        }
    }

    /**
     * Return the string name of the register pointed by @p index.
     * @param index Index of the register, according to the registers_enum.
     */
    getRegisterName(index : number) {
        return this.registersNames[index];
    }
}


export {Registers, registers_enum};