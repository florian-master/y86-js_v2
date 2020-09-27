# Controllers

They serve as a link between the different elements of the model (kernels, compilers, instruction set, etc.) and the User Interface. They aim to simplify the way we use the model.
They're used by the view (in the webapp) and the node server, in order to run simulation through GET request.

Here's a list of the different controllers and what they achieve:

## [Kernel controller](../ts/controllers/kernelController.ts)

This controller is the referent of any other controllers. It says which kernels are available to use, which one is currently active, and give the appropriate toolchain (set of object used by the kernel). Therefore, if you want to create a new kernel and change the toolchain of an existing one, you should take a look at the kernel controller.

```javascript
let kernelController = new KernelController('seq');  // Creates a new controller and use the kernel 'seq'
let yasSeq = kernelController.getSim(); // Returns the sequential simulator 

kernelController.useKernel('pipelined'); // We change the kernel to 'pipelined'
let yasPipe = kernelController.getSim(); // Now returns the pipelined simulator
```

## [HclController](../ts/controllers/hclController.ts) and [YasController](../ts/controllers/yasController.ts)

They both serve as a shortcut to compile code (ys or hcl) and inject the compilation output in the simulator (only if there are no errors when compiling). If you don't want the result to be injected, you can directly call the compiler itself, using the **KernelController**.

```javascript
let yasController = new YasController(kernelController) // It will use the given kernel controller to get the right yas implementation to use
let result = yasController.assemble(ys) // Compiles the code, and if everything's good, injects it into the simulator's memory

// If you don't want to inject the code at the end, use the following instead:
let result = kernelController.getYas().assemble(ys)
```

## [SimulatorController](../ts/controllers/simulatorController.ts)

The simulator controller offers a superset of functions over the simulator itself. It mainly aims to format data. It can also provide a dump of the simulator (status code, state of the memory, registers, etc.).
