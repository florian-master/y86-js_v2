# Compilers

There are two compilers, [yas](../ts/model/yas/yas.ts) and [hcl2js](../ts/model/hcl2js/hcl2js.ts).
They both implement the interface [ICompiler](../ts/model/interfaces/ICompiler.ts).

## yas

This compiler aims to convert **.ys** files to object code (**.yo**).
It relies on the nodes the [parser](../grammars/yas.jison) creates and then proceeds to a two-steps evaluation.
In fact, some information can be retrieved only later in time (label values for example).
Therefore, the first step (see `evaluate()`) consists in extracting data from nodes into data structures.
The second one (see methods `postEvaluate()`) uses these recently filled structures to generate object code (see nodes' methods `render()`).

The compiler also creates an object [ProgramData](../ts/model/yas/programData.ts) which contains useful information to convert a line or a label into a memory address.
This object is stored in the field **data** of [CompilationResult](../ts/model/interfaces/ICompiler.ts).

In order to generate the js parser file, you can use the command:

```bash
jison grammars/yas.jison -o ts/model/yas/yasParser.js
```

## hcl2js

Its job is to convert **.hcl** files into **js code** which can be used by the simulator.
Contrary to **yas**, the document can be evaluated in one step.
It's in part why all the computations are done in the [parser](../grammars/hcl2js.jison).
The other reason is that we were not familliar with the jison tools at the begining.
A rework (moving the computations from the parser to the compiler itself) would be appreciated.

In order to generate the js parser file, you can use the command:

```bash
jison grammars/hcl2js.jison -o ts/model/yas/hcl2jsParser.js
```

## Tests

A few tests have been realized for both compilers, but nothing really 'strict'.
Adding few automated tests would be nice and would ensure the reliability of our yas and hcl2js implementations.
See [here](./known_problems.md) for more information.
