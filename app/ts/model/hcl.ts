import { HclException } from "./exceptions/simulatorException"
import * as registersModule from "./kernel-seq/registers"
import * as aluModule from "./kernel-seq/aluEnum"
import { Instruction } from "./instructionSet"
import { IInstructionSet } from "./interfaces/IInstructionSet"

//
// Alias for enum usable in HCL code
//
let registers = registersModule.registers_enum
let alufct = aluModule.alufct
let instructionSet : Map<string, Instruction>
let ctx : any

export { HCL }

class HCL {
   private _hclHandler : any 
   private _instructionSet : IInstructionSet
   private _ctx : any

   constructor(_instructionSet : IInstructionSet) {
      this._instructionSet = _instructionSet
      this._ctx = {}

      this._resetGlobalContext()
   }

   /**
    * Calls a function from the current handler.
    * If the function does not exist, an HclException is thrown.
    * @param name 
    */
   call(name : string) : any {
      if(!(this._hclHandler[name] instanceof Function)) {
         throw new HclException(name + " function does not exist")
      } else {
         this._resetGlobalContext()
         return this._hclHandler[name]()
      }
   }

   /**
    * Sets the hcl code handler. Its an object owning the functions.
    * This handler must have a field 'ctx : Object'. If not, an exception is thrown.
    * @param handler 
    */
   setHclCode(code : string) {
      this._resetGlobalContext()
      let handler = eval(code)
      if(!(handler instanceof Object)) {
         throw new HclException("The given handler is not an object (type : " + typeof handler + ")")
      }
      this._hclHandler = handler
   }

   /**
    * Sets the context the hcl code can use.
    * If no context is specified, the hcl code will be able to call global variables
    * only.
    * @param newCtx 
    */
   setCtx(newCtx : any) {
      this._ctx = newCtx
   }

   /**
    * Puts the context of this instance of HCL in global
    */
   private _resetGlobalContext() : void {
      registers = registersModule.registers_enum
      alufct = aluModule.alufct
      instructionSet = this._instructionSet.getHandle()
      ctx = this._ctx
   }
}
