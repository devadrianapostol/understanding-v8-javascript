# Overview

V8 was launched in 2008, since them evolved in all their pieces. Adding new compilers, like Turbofan and amazing improvements on the Garbage Collector. We are going to review the basic of the engine piece by piece. 

### Parsing
Is the initial step, when the browser receives a bunch of text that we call Javascript, but for him is just a understandable text. In this section we are going to analise all this first step in this long process.

### Compilers

After the parsing. The process continue interpreting in different internal steps called compilers. V8 is composed by 3 different compilers, the faster one (Full-gen) that generates non-optimised and the slow ones that generate optimized code, TurboFan and Crankshaft. Also we will talk about the new Interpreter that wants to replace the current compilers to machine code.

### Garbage Collector

Garbage collector is the automatic memory management for V8 and attempts to reclaim garbage, or memory occupied by objects that are no longer in use by the program. V8 implements a generational garbage collector where objects may move within the young generation, from the young to the old generation, and within the old generation.

### Native Web

The target to use native apps on the web has evolved along the time, we are going to review some the first steps like Google Native Client, asm.js and the last try to bring native to web, WebAssembly.

### Tooling

A collection of tools and CLI used to profile and tracing V8, Node.js and Google Chrome.

