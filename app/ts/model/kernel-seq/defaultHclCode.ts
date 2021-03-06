/***************************************************************/
/* This file contains default hcl code.                        */
/* It is used ONLY to make unit tests and for CLI requests.    */ 
/* The webapp will use others files to retrieve default codes. */
/***************************************************************/

export const defaultSourceCode = `
#/* $begin seq-all-hcl */
#/* $begin seq-plus-all-hcl */
####################################################################
#  HCL Description of Control for Single Cycle Y86 Processor SEQ   #
#  Copyright (C) Randal E. Bryant, David R. O'Hallaron, 2002       #
####################################################################

##### Symbolic representation of Y86 Instruction Codes #############
intsig NOP 			'instructionSet.get("nop").icode'
intsig HALT			'instructionSet.get("halt").icode'
intsig RRMOVL		'instructionSet.get("rrmovl").icode'
intsig IRMOVL		'instructionSet.get("irmovl").icode'
intsig RMMOVL		'instructionSet.get("rmmovl").icode'
intsig MRMOVL		'instructionSet.get("mrmovl").icode'
intsig OPL			'instructionSet.get("addl").icode'
intsig IOPL			'instructionSet.get("iaddl").icode'
intsig JXX			'instructionSet.get("jmp").icode'
intsig CALL			'instructionSet.get("call").icode'
intsig RET			'instructionSet.get("ret").icode'
intsig PUSHL		'instructionSet.get("pushl").icode'
intsig POPL			'instructionSet.get("popl").icode'
intsig JMEM			'instructionSet.get("jmem").icode'
intsig JREG			'instructionSet.get("jreg").icode'
intsig LEAVE		'instructionSet.get("leave").icode'

##### Symbolic representation of Y86 Registers referenced explicitly #####
intsig RESP     	'registers.esp'    	# Stack Pointer
intsig REBP     	'registers.ebp'    	# Frame Pointer
intsig RNONE    	'registers.none'   	# Special value indicating "no register"

##### ALU Functions referenced explicitly                            #####
intsig ALUADD		'alufct.A_ADD'		# ALU should add its arguments

##### Signals that can be referenced by control logic ####################

##### Fetch stage inputs		#####
intsig pc 			'ctx.pc'				# Program counter
##### Fetch stage computations		#####
intsig icode		'ctx.icode'			# Instruction control code
intsig ifun			'ctx.ifun'			# Instruction function
intsig rA			'ctx.ra'			# rA field from instruction
intsig rB			'ctx.rb'			# rB field from instruction
intsig valC			'ctx.valC'			# Constant from instruction
intsig valP			'ctx.valP'			# Address of following instruction

##### Decode stage computations		#####
intsig valA			'ctx.valA'			# Value from register A port
intsig valB			'ctx.valB'			# Value from register B port

##### Execute stage computations	#####
intsig valE			'ctx.valE'			# Value computed by ALU
boolsig Bch			'ctx.bcond'			# Branch test

##### Memory stage computations		#####
intsig valM			'ctx.valM'			# Value read from memory


####################################################################
#    Control Signal Definitions.                                   #
####################################################################

################ Fetch Stage     ###################################

# Does fetched instruction require a regid byte?
bool need_regids =
    icode in { RRMOVL, OPL, IOPL, PUSHL, POPL, IRMOVL, RMMOVL, MRMOVL };

# Does fetched instruction require a constant word?
bool need_valC =
    icode in { IRMOVL, RMMOVL, MRMOVL, JXX, CALL, IOPL };

bool instr_valid = icode in 
    { NOP, HALT, RRMOVL, IRMOVL, RMMOVL, MRMOVL,
            OPL, IOPL, JXX, CALL, RET, PUSHL, POPL } ;

################ Decode Stage    ###################################

## What register should be used as the A source?
int srcA = [
    icode in { RRMOVL, RMMOVL, OPL, PUSHL } : rA;
    icode in { POPL, RET } : RESP;
    1 : RNONE; # Don't need register
];

## What register should be used as the B source?
int srcB = [
    icode in { OPL, IOPL, RMMOVL, MRMOVL } : rB;
    icode in { PUSHL, POPL, CALL, RET } : RESP;
    1 : RNONE;  # Don't need register
];

## What register should be used as the E destination?
int dstE = [
    icode in { RRMOVL, IRMOVL, OPL, IOPL } : rB;
    icode in { PUSHL, POPL, CALL, RET } : RESP;
    1 : RNONE;  # Don't need register
];

## What register should be used as the M destination?
int dstM = [
    icode in { MRMOVL, POPL } : rA;
    1 : RNONE;  # Don't need register
];

################ Execute Stage   ###################################

## Select input A to ALU
int aluA = [
    icode in { RRMOVL, OPL } : valA;
    icode in { IRMOVL, RMMOVL, MRMOVL, IOPL } : valC;
    icode in { CALL, PUSHL } : -4;
    icode in { RET, POPL } : 4;
    # Other instructions don't need ALU
];

## Select input B to ALU
int aluB = [
    icode in { RMMOVL, MRMOVL, OPL, IOPL, CALL, PUSHL, RET, POPL } : valB;
    icode in { RRMOVL, IRMOVL } : 0;
    # Other instructions don't need ALU
];

## Set the ALU function
int alufun = [
    icode in { OPL, IOPL } : ifun;
    1 : ALUADD;
];

## Should the condition codes be updated?
bool set_cc = icode in { OPL, IOPL };

bool is_bch = icode in { JXX };

################ Memory Stage    ###################################

## Set read control signal
bool mem_read = icode in { MRMOVL, POPL, RET };

## Set write control signal
bool mem_write = icode in { RMMOVL, PUSHL, CALL };

## Select memory address
int mem_addr = [
    icode in { RMMOVL, PUSHL, CALL, MRMOVL } : valE;
    icode in { POPL, RET } : valA;
    # Other instructions don't need address
];

## Select memory input data
int mem_data = [
    # Value from register
    icode in { RMMOVL, PUSHL } : valA;
    # Return PC
    icode == CALL : valP;
    # Default: Don't write anything
];

################ Program Counter Update ############################

## What address should instruction be fetched at

int new_pc = [
    # Call.  Use instruction constant
    icode == CALL : valC;
    # Taken branch.  Use instruction constant
    icode == JXX && Bch : valC;
    # Completion of RET instruction.  Use value from stack
    icode == RET : valM;
    # Default: Use incremented PC
    1 : valP;
];
#/* $end seq-plus-all-hcl */
#/* $end seq-all-hcl */        
    `