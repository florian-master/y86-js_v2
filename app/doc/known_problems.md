# Known problems

## Compilers tests

Compilers are currently not strictly tested.
They have been used with many files and unit tests have been done, but we can not guarantee the grammar efficiency at 100%.
Therefore, more extensive tests would be welcomed.
An idea would be to use the original yas and compare the output.

## CLI tests

As for compilers tests, we ran out of time and were not able to set up automated tests for the CLI mode. Even if our quick hand-crafted tests were positives, add automated unit tests would be nice.

## Steps limit

In order to prevent infinite loop, an arbitrary MAX_STEPS constant has been declared (see [SimulatorController](../ts/controllers/simulatorController.ts)). This constant is used as the default value for the `continue()` method. Neither the CLI or the view provide a way to change it this argument. Therefore, every programs running more than MAX_STEPS instructions will be stopped. An option to change this parameter would be nice.
