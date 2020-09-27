var KernelController = require('./src/controllers/kernelController')
var HclController = require('./src/controllers/hclController')
var YasController = require('./src/controllers/yasController')
var SimulatorController = require('./src/controllers/simulatorController')
var InstructionSet = require('./src/model/instructionSet')

let fs = require('fs')

const DEFAULT_FILES_PATH = './src/assets/per-kernel-defaults/'
const DEFAULT_HCL_NAME = 'hcl.txt'
const DEFAULT_INSTRUCTION_SET_NAME = 'instructionSet.json'

///
/// Example of query :
/// Starts at label 'Init' and set a breakpoint at the line 5
/// http://localhost:8080/cli?start=Init&breakpoints=5&ys=Ci5wb3MgMApJbml0OgogICAgaXJtb3ZsIFN0YWNrLCAlZWJwCiAgICBpcm1vdmwgU3RhY2ssICVlc3AKICAgIAoucG9zIDB4MTAwClN0YWNrOgogICAg
///

exports.runSimulation = (query) => {
    let result = {
        errors: [],
        dump: '',
    }

    let kernelController = new KernelController.KernelController()

    let hclController = new HclController.HclController(kernelController)
    let yasController = new YasController.YasController(kernelController)
    let simulatorController = new SimulatorController.SimulatorController(kernelController)

    let args = extractArgs(query, result.errors)

    kernelController.useKernel(args.kernelName)
    
    if(args.hcl === undefined) {
        args.hcl = loadDefaultFile(kernelController.getCurrentKernelName(), DEFAULT_HCL_NAME)
    }
    const hclCompilationResult = hclController.assemble(args.hcl)
    result.errors = result.errors.concat(compilationErrorsToCLIErrors('hcl', hclCompilationResult.errors))

    if(args.instructions === undefined) {
        const instructionsAsJson = loadDefaultFile(kernelController.getCurrentKernelName(), DEFAULT_INSTRUCTION_SET_NAME)
        args.instructions = JSON.parse(instructionsAsJson)
    }

    let instructionSet = kernelController.getInstructionSet()
    instructionSet.clear()
    args.instructions.forEach((instr) => {
        let args = []

        if(instr.typeArg1 != -1) {
            args.push(instr.typeArg1)
        }
        if(instr.typeArg2 != -1) {
            args.push(instr.typeArg2)
        }

        instructionSet.addInstruction(new InstructionSet.Instruction(
            instr.name,
            instr.icode,
            instr.ifun,
            args,
            kernelController.getWordSize(),
        ))
    })
    
    const yasCompilationResult = yasController.assemble(args.ys)
    result.errors = result.errors.concat(compilationErrorsToCLIErrors('yas', yasCompilationResult.errors))

    let breakpointsPC = []
    
    args.breakpoints.forEach((breakpoint) => {
        try {
            if(typeof(breakpoint) === 'string') {
                breakpointsPC.push(yasCompilationResult.data.labelToPC(breakpoint))
            } else if(typeof(breakpoint) === 'number') {
                breakpointsPC.push(yasCompilationResult.data.lineToPC(breakpoint))
            } else {
                result.errors.push('The given breakpoint type (' + typeof(breakpoint) + ') is not supported')
            }
        } catch(err) {
            result.errors.push('Breakpoint : ' + err)
        }
    })
    
    let simulator = kernelController.getSim()

    try {
        if(typeof(args.startPC) === 'string') {
            simulator.setNewPC(yasCompilationResult.data.labelToPC(args.startPC))
        } else if(typeof(args.startPC) === 'number') {
            simulator.setNewPC(yasCompilationResult.data.lineToPC(args.startPC))
        }
    } catch(err) {
        result.errors.push('StartPC : ' + err)
    }

    if(result.errors.length != 0) {
        return result
    }

    simulator.continue(breakpointsPC, simulatorController.MAX_STEPS)
    result.dump = simulatorController.getDump()

    return result
}

function extractArgs(query, errors) {
    let args = {
        kernelName: "seq",
        hcl: undefined,
        ys: "",
        instructions: undefined,
        breakpoints: [],
        startPC: undefined,
    }

    if(query.kernelName !== undefined) {
        args.kernelName = query.kernelName
    }

    if(query.hcl !== undefined) {
        args.hcl = base64ToString(query.hcl)
    }

    if(query.ys !== undefined) {
        args.ys = base64ToString(query.ys)
    } else {
        errors.push("Can not run a simulation without any ys file")
    }

    if(query.instructionSet !== undefined) {
        args.instructions = JSON.parse(base64ToString(query.instructionSet))
        checkInstructions(args.instructions, errors)
    } 

    if(query.breakpoints !== undefined) {
        query.breakpoints.split(',').forEach((breakpointAsString) => {
            let line = Number(breakpointAsString)

            if(Number.isNaN(line)) { // Seems to be a label
                if(breakpointAsString.length != 0) {
                    args.breakpoints.push(breakpointAsString)
                }
            } else { 
                args.breakpoints.push(line)
            }
        })
    } 

    if(query.start !== undefined) {
        let line = Number(query.start)

        if(Number.isNaN(line)) { // Seems to be a label
            if(query.start.length != 0) {
                args.startPC = query.start
            }
        } else { 
            args.startPC = line
        }
    }

    return args
}

function compilationErrorsToCLIErrors(header, compilationErrors) {
    return compilationErrors.map(compilationError => {
        return header +  ' | Line ' + compilationError.line + ' : ' + compilationError.message
    })
}

function base64ToString(input) {
    return Buffer.from(input, 'base64').toString('ascii')
}

function checkInstructions(instructions, errors) {
    instructions.forEach((instruction) => {
        ['name', 'icode', 'ifun', 'typeArg1', 'typeArg2'].forEach((field) => {
            if(!instruction.hasOwnProperty(field)) {
                errors.push('An instruction is missing the field ' + field)
            }
        })

        if(typeof(instruction.name) !== 'string') {
            errors.push("An instruction name must be a string")
        } 

        ['icode', 'ifun', 'typeArg1', 'typeArg2'].forEach((field) => {
            if(typeof(instruction[field]) !== 'number') {
                errors.push("An instruction " + field + " must be a number")
            }
        })
    })
}



function loadDefaultFile(kernelName, fileName) {
    const path = DEFAULT_FILES_PATH + kernelName + '/' + fileName

    try {
        return fs.readFileSync(path, 'utf8')
    } catch (err) {
        throw new Error('Failed to read default file "' + fileName + '". Reason : ' + err.message)
    }
}