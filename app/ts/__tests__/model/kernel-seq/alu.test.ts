import {Alu, JMP_enum} from "../../../model/kernel-seq/alu";
import {alufct} from "../../../model/kernel-seq/aluEnum";
import {CC} from "../../../model/kernel-seq/cc";

/**
 * Test the alu constructor.
 * For the moment it just check all the flags are set to false (0) during initialization.
 */
test("Alu test", () => {
    // test constructor
    let alu_test = new Alu();
    for (let flag in alu_test.flags) {
        expect(alu_test.flags[flag]).toBe(false);
    }

    expect(alu_test.flags.length).toBe(Object.keys(CC).length);
});

/**
 * Macro for compute_alu tests.
 * @param alu
 * @param val1
 * @param val2
 * @param alufct
 * @param expected_result
 */
function compute_test(alu:Alu, val1:number, val2:number, alufct:alufct, expected_result:number) {

    let value = alu.compute_alu(val1, val2, alufct);
    expect(value).toBe(expected_result);
}

/**
 * Test the compute_alu function with the ADD operation.
 */
test("Alu(compute_alu - ADD) test", () => {
    let alu = new Alu();

    // Two zero
    compute_test(alu, 0, 0, alufct.A_ADD, 0);
    // One positive
    compute_test(alu, 10, 0, alufct.A_ADD, 10);
    compute_test(alu, 0, 10, alufct.A_ADD, 10);
    compute_test(alu, -100, 10, alufct.A_ADD, 0xFFFFFFA6);
    compute_test(alu, 5, -10, alufct.A_ADD, 0XFFFFFFFB);
    // Two positive
    compute_test(alu, 14, 18, alufct.A_ADD, 32);
    // One negative
    compute_test(alu, -10, 0, alufct.A_ADD, 0xFFFFFFF6);
    compute_test(alu, 0, -10, alufct.A_ADD, 0xFFFFFFF6);
    // Two negative
    compute_test(alu, -15, -12, alufct.A_ADD, 0xFFFFFFE5);
    // result positive
    compute_test(alu, -100, 1100, alufct.A_ADD, 1000);
    compute_test(alu, 100, -10, alufct.A_ADD, 90);
    compute_test(alu, 100, 10, alufct.A_ADD, 110);
    // result negative
    compute_test(alu, 100, -1100, alufct.A_ADD, 0xFFFFFC18);
    compute_test(alu, -100, 10, alufct.A_ADD, 0xFFFFFFA6);
    compute_test(alu, -100, -10, alufct.A_ADD, 0xFFFFFF92);
    // result = 0
    compute_test(alu, 100, -100, alufct.A_ADD, 0);
    // Overflow
    compute_test(alu, 0x80000000, -1, alufct.A_ADD, 0x7FFFFFFF);
    compute_test(alu, 0x7FFFFFFF, 1, alufct.A_ADD, 0x80000000);
});

/**
 * Test the compute_alu function with the SUB operation.
 */
test("Alu(compute_alu - SUB) test", () => {
    let alu = new Alu();

    // Two zero
    compute_test(alu, 0, 0, alufct.A_SUB, 0);
    // One positive
    compute_test(alu, 10, 0, alufct.A_SUB, 10);
    compute_test(alu, 0, 10, alufct.A_SUB, 0xFFFFFFF6);
    compute_test(alu, -100, 10, alufct.A_SUB, 0xFFFFFF92);
    compute_test(alu, 5, -10, alufct.A_SUB, 15);
    // Two positive
    compute_test(alu, 14, 18, alufct.A_SUB, 0xFFFFFFFC);
    // One negative
    compute_test(alu, -10, 0, alufct.A_SUB, 0xFFFFFFF6);
    compute_test(alu, 0, -10, alufct.A_SUB, 10);
    // Two negative
    compute_test(alu, -15, -12, alufct.A_SUB, 0xFFFFFFFD);
    // result negative
    compute_test(alu, -100, 1100, alufct.A_SUB, 0xFFFFFB50);
    // result positive
    compute_test(alu, 100, 10, alufct.A_SUB, 90);
    compute_test(alu, 100, -1100, alufct.A_SUB, 1200);
    compute_test(alu, -100, -10, alufct.A_SUB, 0xFFFFFFA6);
    // result = 0
    compute_test(alu, -100, -100, alufct.A_SUB, 0);
    compute_test(alu, 100, 100, alufct.A_SUB, 0);
    // Overflow
    compute_test(alu, 0x80000000, 1, alufct.A_SUB, 0x7FFFFFFF);
    compute_test(alu, 0x7FFFFFFF, -1, alufct.A_SUB, 0x80000000);
});

/**
 * Test the compute_alu function with the AND operation.
 */
test("Alu(compute_alu - AND) test", () => {
    let alu = new Alu();

    // Two zero
    compute_test(alu, 0, 0, alufct.A_AND, 0);
    // One positive
    compute_test(alu, 10, 0, alufct.A_AND, 0);
    compute_test(alu, 0, 10, alufct.A_AND, 0);
    compute_test(alu, 0xFFFFFF9C, 0xa, alufct.A_AND, 0x8);
    compute_test(alu, 0x5, 0xFFFFFFF6, alufct.A_AND, 0x4);
    // Two positive
    compute_test(alu, 0xE, 0x12, alufct.A_AND, 0x2);
    // One negative
    compute_test(alu, -10, 0, alufct.A_AND, 0);
    compute_test(alu, 0, -10, alufct.A_AND, 0);
    // Two negative
    compute_test(alu, 0xFFFFFF15, 0xFFFFFF12, alufct.A_AND, 0xFFFFFF10);
    // result negative
    compute_test(alu, 0xFFFFFF78, 0xF0000000, alufct.A_AND, 0xF0000000);
    // result positive
    compute_test(alu, 0x100, 0x110, alufct.A_AND, 0x100);
    compute_test(alu, 0x156400, 0xFFFF1100, alufct.A_AND, 0x150000);
});

/**
 * Test the compute_alu function with the XOR operation.
 */
test("Alu(compute_alu - XOR) test", () => {
    let alu = new Alu();

    // Two zero
    compute_test(alu, 0, 0, alufct.A_XOR, 0);
    // One positive
    compute_test(alu, 0x10, 0, alufct.A_XOR, 0x10);
    compute_test(alu, 0, 0x10, alufct.A_XOR, 0x10);
    compute_test(alu, 0xFFFFFF9C, 0xa, alufct.A_XOR, 0xFFFFFF96);
    compute_test(alu, 0x5, 0xFFFFFFF6, alufct.A_XOR, 0xFFFFFFF3);
    // Two positive
    compute_test(alu, 0xE, 0x12, alufct.A_XOR, 0x1C);
    // One negative
    compute_test(alu, 0xFFFFFFFA, 0, alufct.A_XOR, 0xFFFFFFFA);
    compute_test(alu, 0, 0xFFFFFFFA, alufct.A_XOR, 0xFFFFFFFA);
    // Two negative
    compute_test(alu, 0xFFFFFF15, 0xFFFFFF12, alufct.A_XOR, 0x7);
    // result negative
    compute_test(alu, 0xFFFFFF78, 0xF0000000, alufct.A_XOR, 0xFFFFF78);
    // result positive
    compute_test(alu, 0x100, 0x110, alufct.A_XOR, 0x010);
    compute_test(alu, 0x156400, 0xFFFF1100, alufct.A_XOR, 0xFFEA7500);
});


/**
 * Macro for checking the flags after val1 and val2 operation alufct.
 * It currently check ZF, SF and OF.
 * @param val1
 * @param val2
 * @param alufct
 * @param expected_ZF
 * @param expected_SF
 * @param expected_OF
 */
function flags_test(val1:number, val2:number, alufct : alufct,
                    expected_ZF : boolean, expected_SF : boolean, expected_OF : boolean) {

    let alu = new Alu();
    alu.compute_cc(val1, val2, alufct);

    expect(alu.flags[CC.ZF]).toBe(expected_ZF);
    expect(alu.flags[CC.SF]).toBe(expected_SF);
    expect(alu.flags[CC.OF]).toBe(expected_OF);
}

/**
 * Test the compute_cc function with the ADD operation.
 */
test("Alu(compute_cc - ADD) test", () => {

    // double zero
    flags_test(0,0, alufct.A_ADD, true, false, false);
    // one positive
    flags_test(10,0, alufct.A_ADD, false, false, false);
    flags_test(0,0x7FFFFFFF, alufct.A_ADD, false, false, false);
    // one negative
    flags_test(-10,0, alufct.A_ADD, false, true, false);
    flags_test(0,-12, alufct.A_ADD, false, true, false);
    // result = 0
    flags_test(12,-12, alufct.A_ADD, true, false, false);
    flags_test(-12,12, alufct.A_ADD, true, false, false);
    // result positive
    flags_test(50,30, alufct.A_ADD, false, false, false);
    flags_test(12,-11, alufct.A_ADD, false, false, false);
    flags_test(-11,12, alufct.A_ADD, false, false, false);
    // result negative
    flags_test(-50,30, alufct.A_ADD, false, true, false);
    flags_test(10,-11, alufct.A_ADD, false, true, false);
    flags_test(-10,-11, alufct.A_ADD, false, true, false);
    // overflow test
    flags_test(0x7FFFFFFF,1, alufct.A_ADD, false, true, true);
    flags_test(0x80000000,-1, alufct.A_ADD, false, false, true);
});

/**
 * Test the compute_cc function with the SUB operation.
 */
test("Alu(compute_cc - SUB) test", () => {

    // double zero
    flags_test(0,0, alufct.A_SUB, true, false, false);
    // one positive
    flags_test(10,0, alufct.A_SUB, false, false, false);
    flags_test(0,0x7FFFFFFF, alufct.A_SUB, false, true, false);
    // one negative
    flags_test(-10,0, alufct.A_SUB, false, true, false);
    flags_test(0,-12, alufct.A_SUB, false, false, false);
    // result = 0
    flags_test(12,12, alufct.A_SUB, true, false, false);
    flags_test(-12,-12, alufct.A_SUB, true, false, false);
    // result positive
    flags_test(50,30, alufct.A_SUB, false, false, false);
    flags_test(12,-11, alufct.A_SUB, false, false, false);
    flags_test(-11,-12, alufct.A_SUB, false, false, false);
    // result negative
    flags_test(-50,30, alufct.A_SUB, false, true, false);
    flags_test(10,-11, alufct.A_SUB, false, false, false);
    // overflow test
    flags_test(0x7FFFFFFF,-1, alufct.A_SUB, false, true, true);
    flags_test(0x80000000,1, alufct.A_SUB, false, false, true);
});

/**
 * Test the compute_cc function with the AND operation.
 */
test("Alu(compute_cc - AND) test", () => {

    // double zero
    flags_test(0,0, alufct.A_AND, true, false, false);
    // one positive
    flags_test(10,0, alufct.A_AND, true, false, false);
    flags_test(0,0x7FFFFFFF, alufct.A_AND, true, false, false);
    // one negative
    flags_test(-10,0, alufct.A_AND, true, false, false);
    flags_test(0,-12, alufct.A_AND, true, false, false);
    // result = 0
    flags_test(0X8,0X7, alufct.A_AND, true, false, false);
    flags_test(-0X8,0X7, alufct.A_AND, true, false, false);
    // result positive
    flags_test(50,30, alufct.A_AND, false, false, false);
    flags_test(12,-11, alufct.A_AND, false, false, false);
    flags_test(12,12, alufct.A_AND, false, false, false);
    // result negative
    flags_test(-10,-11, alufct.A_AND, false, true, false);
    flags_test(-11,-11, alufct.A_AND, false, true, false);
    // overflow test
    // no overflow are possible while using '&' operator.
});

/**
 * Test the compute_cc function with the XOR operation.
 */
test("Alu(compute_cc - XOR) test", () => {

    // double zero
    flags_test(0,0, alufct.A_XOR, true, false, false);
    // one positive
    flags_test(10,0, alufct.A_XOR, false, false, false);
    flags_test(0,0x7FFFFFFF, alufct.A_XOR, false, false, false);
    // one negative
    flags_test(-10,0, alufct.A_XOR, false, true, false);
    flags_test(0,-12, alufct.A_XOR, false, true, false);
    // result = 0
    flags_test(0X8,0X8, alufct.A_XOR, true, false, false);
    flags_test(-0X8,-0X8, alufct.A_XOR, true, false, false);
    // result positive
    flags_test(50,30, alufct.A_XOR, false, false, false);
    flags_test(-10,-11, alufct.A_XOR, false, false, false);
    // result negative
    flags_test(12,-11, alufct.A_XOR, false, true, false);
    // overflow test
    // no overflow are possible while using '&' operator.
});

/**
 * Test alu's function with the NONE operation.
 */
test("Alu - NONE test", () => {
    try {
        flags_test(0,0, alufct.A_NONE, true, false, false);
        expect(true).toBe(false);
    }
    catch (e) {
    }

    try {
        flags_test(30,354, alufct.A_NONE, true, false, false);
        expect(true).toBe(false);
    }
    catch (e) {
    }

    try {
        flags_test(-10,30, alufct.A_NONE, true, false, false);
        expect(true).toBe(false);
    }
    catch (e) {
    }


    expect(true).toBe(true);
});


test("Alu - conditional jump test", () => {
    let alu = new Alu();

    // test on positive result
    alu.compute_cc(10,10,alufct.A_ADD);
    expect(alu.compute_bch(JMP_enum.J_YES)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_LE)).toBeFalsy();
    expect(alu.compute_bch(JMP_enum.J_L)).toBeFalsy();
    expect(alu.compute_bch(JMP_enum.J_E)).toBeFalsy();
    expect(alu.compute_bch(JMP_enum.J_NE)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_GE)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_G)).toBeTruthy();

    // test on negative result
    alu.compute_cc(0,-10,alufct.A_ADD);
    expect(alu.compute_bch(JMP_enum.J_YES)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_LE)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_L)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_E)).toBeFalsy();
    expect(alu.compute_bch(JMP_enum.J_NE)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_GE)).toBeFalsy();
    expect(alu.compute_bch(JMP_enum.J_G)).toBeFalsy();

    // test on zero result
    alu.compute_cc(0,0,alufct.A_ADD);
    expect(alu.compute_bch(JMP_enum.J_YES)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_LE)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_L)).toBeFalsy();
    expect(alu.compute_bch(JMP_enum.J_E)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_NE)).toBeFalsy();
    expect(alu.compute_bch(JMP_enum.J_GE)).toBeTruthy();
    expect(alu.compute_bch(JMP_enum.J_G)).toBeFalsy();
});