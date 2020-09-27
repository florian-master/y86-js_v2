# Web Server

The server part is composed of two files, the [server](../server.js) itself, and the [cli](../cli.js) file, which handles GET requests.

## [Server](../server.js)

It serves files in the **dist/** directory and listen on the GET route **/cli**

To launch it, use:

```bash
# We increased the allowed header size in order to handle GET request using heavy files.
node --max-http-header-size 80000 ./server.js
```

## [CLI](../cli.js)

Module used by the server to run a program using user's arguments.

Supported arguments are:

* `ys`: The source code, *encoded in base64*
* `kernelName` (optional): The name of the kernel to use
* `hcl` (optional): The hcl code, *encoded in base64*
* `instructionSet` (optional): The instruction set *json* representation, *encoded in base64*
* `breakpoints` (optional): Where the simulation should stop. If one of these breakpoints is reached, the simulation is stoped and the dump created. A breakpoint can be a line number or a label. Each breakpoint is separated by a comma. *Ex :* 12, End. The program will stop if it reachs halt, the line 12 or the label End.
* `start` (optional): Where the simulation should start. It accepts the same kind of arguments as breakpoints, that is line or label. Only one entry point is accepted.

## [Utility script](../cli.py)

An utility script has been created in order to simplify the creation of requests.
