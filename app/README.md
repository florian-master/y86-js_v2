# y86 simulator

This projects aims to improve the y86 web simulator used at *Université de Bordeaux*. Some of the main features are :

* Edit ys, HCL and instruction set
* Run code step by step
* See the CPU stages, registers and memory
* CLI mode (through GET request)
* Supports different kernels (only seq is implemented at the moment)

## Installation

You can install a part of the dependencies using 

```bash
npm install
```

You'll also need [TypeScript](https://www.typescriptlang.org/index.html) and [Jison](https://zaa.ch/jison/docs/) to generate hcl2js and yas parsers.

Note that if you do not edit the hcl2js or yas grammar, the parser will not have to be generated again and then you will not have to use **jison**.

```bash
# TypeScript
npm install typescript -g

# Jison -- if you need to rebuild hcl2js or yas parsers
npm install jison -g
```

### Build parsers

The parsers are described in **grammars/**. To build the parsers, use :

```bash
# hcl2js parser
jison grammars/hcl2js.jison -o ts/model/hcl2js/hcl2jsParser.js
# yas parser
jison grammars/yas.jison -o ts/model/yas/yasParser.js
```

## Run application

There two modes : development and release.

### Dev mode

The CLI mode does not work when running dev server.
To launch it :

```bash
npm run serve
```

### Release mode

Here the CLI mode is available. To launch it, use :

```bash
npm run release
```

The server is launched with an extended request header max size, in order to handle large GET request.

## Run with docker

```bash
docker build . -t webSimY86         # Build the image
docker run -d -p 80:8080 webSimY86  # Start the container and listen on port 80
```

## Tests

To run unit tests, launch :

```bash
npm test
```

## Contributing

If you want to contribute, you can find some ressources in `doc/`.

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
