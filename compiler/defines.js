
// Type definitions, etc
// dblRef is only to be used by temp variables, because it forces the compilter to load the contents
var types = {
    "p8": {
        size: 8,
        float: false,
        pointer: true,  
        special: false,
        dblRef: false,
    },
    "p16": {
        size: 16,
        float: false,
        pointer: true,
        special: false,
        dblRef: false,
    },
    "p32": {
        size: 32,
        float: false,
        pointer: true,
        special: false,
        dblRef: false,
    },
    "dp32": {
        size: 64,
        float: false,
        pointer: true,
        special: false,
        dblRef: false,
    },
    "u8": {
        size: 8,
        float: false,
        pointer: false,
        special: false,
        dblRef: false,
    },
    "u16": {
        size: 16, 
        float: false,
        pointer: false,
        special: false,
        dblRef: false,
    },
    "u32": {
        size: 32,
        float: false,
        pointer: false,
        special: false,
        dblRef: false,
    },
    "t8": {
        size: 8,
        float: false,
        pointer: false,
        special: false,
        dblRef: true,
    },
    "t16": {
        size: 16,
        float: false,
        pointer: false,
        special: false,
        dblRef: true,
    },
    "t32": {
        size: 32,
        float: false,
        pointer: false,
        special: false,
        dblRef: true,
    },
    "function": {
        size: 32,
        float: false,
        pointer: true,
        special: true, 
        dblRef: false
    },
    "initializer": {
        size: 32,
        float: false,
        pointer: true,
        special: true, 
        dblRef: false
    },
    "method": {
        size: 32,
        float: false,
        pointer: true,
        special: true, 
        dblRef: false
    },
    "___format_template___": {
        size: 0,
        float: false,
        pointer: false,
        special: true,
        dblRef: false,
        templatePtr: null
    },
    "f32": {
        size: 32,
        float: true,
        pointer: false,
        special: false, 
        dblRef: false
    },
}

globalThis.userVariables = {           // Object : {variable name: type}
    __return_8__: types.i8,
    __return_16__: types.i16,
    __return_32__: types.i32,
    __return_flt__: types.f32,
    "this": types.u32,
    "argv": types.u32,
    "argc": types.u32
}

globalThis.userFunctions = {           // Object : {function name: {func name, parameters[{param name , type},...]}, return type}
    "put_string": {
        name: 'put_string',
        parameters: [{ name: "buffer", type: types.p8 }],
        returnType: types.u32
    },
    "put_int": {
        name: 'put_int',
        parameters: [{ name: "number", type: types.u32 }],
        returnType: types.u32
    },
    "puts": {
        name: 'puts',
        parameters: [{ name: "string", type: types.p8 }],
        returnType: types.u32
    },
    "printf_mini": {
        name: 'printf_mini',
        parameters: [],
        returnType: types.u32
    },
    "put_float": {
        name: 'put_float',
        parameters: [{ name: "number", type: types.f32 }],
        returnType: types.u32
    },
    "put_floatln": {
        name: 'put_floatln',
        parameters: [{ name: "number", type: types.f32 }],
        returnType: types.u32
    },
    "fopen": {
        name: 'fopen',
        parameters: [],
        returnType: types.u32
    },
    "fwrite": {
        name: 'fopen',
        parameters: [],
        returnType: types.u32
    },
    "fread": {
        name: 'fopen',
        parameters: [],
        returnType: types.u32
    },
    "fclose": {
        name: 'fclose',
        parameters: [],
        returnType: types.u32
    },
    "mpow": {
        name: 'mpow',
        parameters: [],
        returnType: types.f32
    },
    "scanf_mini": {
        name: 'scanf_mini',
        parameters: [],
        returnType: types.u32
    },
    "malloc": {
        name: "malloc",
        parameters: [],
        returnType: types.p32
    },
    "free": {
        name: "free",
        parameters: [],
        returnType: types.u32
    },
    "strlen_rapid" : {
        name: "strlen_rapid",
        parameters: [{name: "string", type: types.p8 }],
        returnType: types.u32
    },
    "arrcmp": {
        name: "arrcmp",
        parameters: [],
        returnType: types.u32
    }
};
globalThis.assemblyMacros = [          // Array  : All macros declared in assembly
    "O_CREAT_RW",
    "O_ACCMODE",
    "O_RDONLY",
    "O_WRONLY",
    "O_RDWR",
    "O_CREAT",
    "O_EXCL",
    "O_NOCTTY",
    "O_TRUNC",
    "O_APPEND",
    "O_NONBLOCK",
    "O_NDELAY",
    "O_SYNC",
    "O_FSYNC",
    "O_ASYNC",
]
globalThis.functionMacros = {          // Todo, maybe delete actually
    memfill: function (rep, size, value) {
        outputCode.push(`.fill ${rep}, ${size}, ${value}`)
        typeStack.push(defines.type.p32);
    }
}

globalThis.debugPrint = function () {
    console.log("\033[92m[DEBUG]\033[0m", ("\033[96m" + (debugPrint.caller.name || "*unkown caller*") + "\033[0m").padEnd(32), ...arguments);
}
// important functions
globalThis.objCopy = function (x) {
    return JSON.parse(JSON.stringify(x))
}
globalThis.throwE = function (x) {
    console.log(`[ERROR] @ line ${globalInd}: `, ...arguments)
    console.trace()
    console.log("\n\n================== THIS WAS NOT A JS ERROR, THIS WAS THROWE ==================\n\n")
    process.exit(1)
}
globalThis.throwW = (x) => console.log(`[WARNING] @ line ${globalInd}: `, ...arguments);

globalThis.popTypeStack = function () {
    //console.log("POPPPPPP")
    if (typeStack.length == 0) {
        throwE("[COMPILER] Missing expected type")
    }
    return typeStack.pop()
}

//taken from: https://stackoverflow.com/questions/65538406/convert-javascript-number-to-float-single-precision-ieee-754-and-receive-integ
globalThis.doubleToInt = function (double) {
    const buffer = new ArrayBuffer(4);
    const float32Arr = new Float32Array(buffer);
    const uint32Array = new Uint32Array(buffer);

    float32Arr[0] = double;
    return uint32Array[0];
}
globalThis.methodExists = function (n) {
    return Object.values(formatMethods).map(x => Object.keys(x)).flat().includes(n)
}

globalThis.objectIncludes = function(obj,inc)
{
    return Object.keys(obj).includes(inc)
}

var mathOps = "+-*/".split("")

var condSet = {
    "==": "sete",
    ":>": "setg",
    "<:": "setl",
    ">=": "setge",
    "<=": "setle",
    "!=": "setne"
}
var compares= [...Object.keys(condSet),...Object.keys(condSet).map(x => "@" + x)]

module.exports = {
    types, mathOps, compares, condSet
}