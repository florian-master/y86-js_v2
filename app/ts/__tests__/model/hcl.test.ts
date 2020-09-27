import { InstructionSet, Instruction } from "../../model/instructionSet";
import { HCL } from '../../model/hcl'

test("hcl test", () => {
    let instructionSet = new InstructionSet()
    instructionSet.clear()

    let hcl = new HCL(instructionSet)

    // Does this simple example compile ?
    hcl.setHclCode(`new function() {

        this.func = () => {
           // Checks if some identifiers are undefined
           try { if(ctx.icode === undefined) { throw '' } } catch(e) { throw "HCL : ctx.icode is not accessible in function 'func'" }
           try { if(instructionSet.get("instr").icode === undefined) { throw '' } } catch(e) { throw "HCL : instructionSet.get('instr').icode is not accessible in function 'func'" }
           // End of checks
        
           return ((1) === (ctx.icode)) || ((1) === (instructionSet.get("instr").icode));
        }
        
        }`)

    // Check of instructionSet must fail
    expect(() => { 
        hcl.call("func")
    }).toThrow()

    instructionSet.addInstruction(new Instruction("instr", 12, 0, []))

    // Check of ctx.icode must fail
    expect(() => { 
        hcl.call("func")
    }).toThrow()

    hcl.setCtx({
        icode: 1
    })

    // The function 'test' must exist and return true
    expect(hcl.call("func")).toBe(true)

    // Empty code shall throw
    expect(() => {
        hcl.setHclCode(``)
    }).toThrow()

    // The nofunc does not exist
    expect(() => {
        hcl.call("nofunc")
    }).toThrow()
})