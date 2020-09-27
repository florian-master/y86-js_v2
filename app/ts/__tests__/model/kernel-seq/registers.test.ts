import {Registers, registers_enum} from "../../../model/kernel-seq/registers";
import {Memory} from "../../../model/kernel-seq/memory";

test("Registers tests", function() {

    let eax_test_value = 0xFFFFFFF8;
    let test_value = 10;
    let empty_word = 0;

    // test init function in constructor
    let reg_test = new Registers();

    for (let reg in reg_test.content ) {
        // @ts-ignore
        expect(reg == 0);
    }


    // test write function
    reg_test.write(1, test_value);
    expect(reg_test.content[1]).toBe(test_value);
    reg_test.write(1, empty_word);
    expect(reg_test.content[1]).toBe(empty_word);

    reg_test.write(registers_enum.eax, eax_test_value);
    expect(reg_test.content[registers_enum.eax]).toBe(eax_test_value);
    expect(reg_test.content[registers_enum.ebx]).toBe(empty_word);


    // test init function after write
    reg_test.reset();
    for (let reg in reg_test.content ) {
        expect(reg_test.content[reg]).toStrictEqual(empty_word);
    }

    // test read
    reg_test.write(registers_enum.eax, eax_test_value);
    expect(reg_test.read(registers_enum.eax)).toBe(eax_test_value);
    expect(reg_test.read(4)).toStrictEqual(empty_word);

    // Test if the process doesn't create or erase some registers
    expect(reg_test.content.length).toBe(Object.keys(registers_enum).length);

});