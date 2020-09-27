import {alufct} from "./aluEnum";

/**
 * Enum for jmp flags.
 */
export enum JMP_enum {
    J_YES,
    J_LE,
    J_L,
    J_E,
    J_NE,
    J_GE,
    J_G
}

/**
 * Enum for place flag's places in alu flags array.
 */
enum CC {
    NONE = 0,
    ZF = 1,
    SF = 2,
    OF = 3,
}

class Alu {
    /**
     * Boolean array wich contain all the flags.
     * Currently it contain three flags :
     *   - ZF : Zero flag - when the result is zero
     *   - OF : Overflow flag - when computation overflow
     *   - SF : Sign flag - When the sign bit is at one.
     */
    flags : boolean[] = [];

    /**
     * Init Alu by setting all flags to 0.
     */
    constructor() {
        for (let key in CC){
            this.flags.push(false);
        }
    }

    /**
     * Make a single computation with aluA and aluB parameters according to OP given by alu_fun.
     * @param aluA Left member to compute
     * @param aluB Right member to compute
     * @param alu_fun The operator of computation. It must be an alufct enum type.
     */
    compute_alu(aluA : number, aluB : number, alu_fun : alufct){
        if (aluA > 0xFFFFFFFF || aluB > 0xFFFFFFFF){
            throw new Error("Error in compute_alu : Values are more than 32bits long.")
        }

        // cast into 32bit int
        let val = new Uint32Array(2);
        val[0] = aluA;
        val[1] = aluB;
        let result = new  Uint32Array(1);


        if (alu_fun == alufct.A_ADD) {
            result[0] = val[0] + val[1];
            return result[0];
        }
        else if (alu_fun == alufct.A_AND) {
            result[0] = val[0] & val[1];
            return result[0];
        }
        else if (alu_fun == alufct.A_SUB) {
            result[0] = val[0] - val[1];
            return result[0];
        }
        else if (alu_fun == alufct.A_XOR) {
            result[0] = val[0] ^ val[1];
            return result[0];
        }
        else if (alu_fun == alufct.A_NONE) {
            throw new Error("A_NONE constant setted.")
        }
        throw new Error("Error, alu function (ifun) not founded.")
    }

    /**
     * Set the flag to the correct value according the calculation asked in parameters.
     * Necessary function according to HCL because of its "set_cc" function.
     * @param aluA Left operand
     * @param aluB Right operand
     * @param alu_fun Operand Indexed by ::alufct.
     */
    compute_cc(aluA : number, aluB : number, alu_fun : alufct) {

        // get value and cast into uint32
        let val = new Uint32Array(1);
        val[0] = this.compute_alu(aluA, aluB, alu_fun);

        // sign bits
        let sgnA, sgnB, sgnV, signBit = 0x80000000;
        sgnA = !!(aluA & signBit);
        sgnB = !!(aluB & signBit);
        sgnV = !!(val[0] & signBit);

        // set Zero flag
        this.flags[CC.ZF] = val[0] == 0;
        // set Sign flag
        this.flags[CC.SF] = val[0] > 0x7FFFFFFF;
        // set Overflow flag
        if (alu_fun == alufct.A_ADD)
            this.flags[CC.OF] = (sgnA && sgnB && !sgnV) || (!sgnA && !sgnB && sgnV);
        else if (alu_fun == alufct.A_SUB) {
            this.flags[CC.OF] = (sgnA != sgnB) && (sgnB == sgnV);
        }
        else {
            this.flags[CC.OF] = false;
        }
    }

    /**
     * Return if the execution stage allow the conditional branchement with a jmp.
     * By default, this function is called by execution stage when hcl function is_bch returned
     * a true value, when user defined that the instruction should make a jump.
     * @param ifun The ifun of the jmp function.
     */
    compute_bch(ifun: number) {
        if (ifun == JMP_enum.J_YES) return true;
        if (ifun == JMP_enum.J_LE) return this._boolean_xor(this.flags[CC.SF], this.flags[CC.OF]) || this.flags[CC.ZF];
        if (ifun == JMP_enum.J_L) return this._boolean_xor(this.flags[CC.SF], this.flags[CC.OF]);
        if (ifun == JMP_enum.J_E) return this.flags[CC.ZF];
        if (ifun == JMP_enum.J_NE) return !this.flags[CC.ZF];
        if (ifun == JMP_enum.J_GE) return this._boolean_xor(this._boolean_xor(this.flags[CC.SF], this.flags[CC.OF]), true);
        if (ifun == JMP_enum.J_G) return this._boolean_xor(this._boolean_xor(this.flags[CC.SF], this.flags[CC.OF]), true) && this._boolean_xor(this.flags[CC.ZF], true);
        return false;
    }

    /**
     * Since Typescript seems to not allow xor with boolean, we need this little function.
     * It just returns the result of boolA ^ boolB.
     * @param boolA
     * @param boolB
     * @private
     */
    _boolean_xor(boolA :boolean, boolB :boolean){
        return (boolA && !boolB) || (!boolA && boolB);
    }

    /**
     * Return zero flag.
     */
    getZF() {
        return this.flags[CC.ZF];
    }

    /**
     * Return sign flag.
     */
    getSF() {
        return this.flags[CC.SF];
    }

    /**
     * Return overflow flag.
     */
    getOF() {
        return this.flags[CC.OF];
    }
}


export { Alu };