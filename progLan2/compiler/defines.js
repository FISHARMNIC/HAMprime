// Type definitions, etc
// dblRef is only to be used by temp variables, because it forces the compilter to load the contents
var types = {
    "p8": {
        size: 8,
        pointer: true,  
        special: false,
        dblRef: false,
    },
    "p16": {
        size: 16,
        pointer: true,
        special: false,
        dblRef: false,
    },
    "p32": {
        size: 32,
        pointer: true,
        special: false,
        dblRef: false,
    },
    "dp32": {
        size: 64,
        pointer: true,
        special: false,
        dblRef: false,
    },
    "u8": {
        size: 8,
        pointer: false,
        special: false,
        dblRef: false,
    },
    "u16": {
        size: 16, 
        pointer: false,
        special: false,
        dblRef: false,
    },
    "u32": {
        size: 32,
        pointer: false,
        special: false,
        dblRef: false,
    },
    "t8": {
        size: 8,
        pointer: false,
        special: false,
        dblRef: true,
    },
    "t16": {
        size: 16,
        pointer: false,
        special: false,
        dblRef: true,
    },
    "t32": {
        size: 32,
        pointer: false,
        special: false,
        dblRef: true,
    },
    "function": {
        size: 32,
        pointer: true,
        special: true, 
        dblRef: false
    },
    "initializer": {
        size: 32,
        pointer: true,
        special: true, 
        dblRef: false
    },
    "method": {
        size: 32,
        pointer: true,
        special: true, 
        dblRef: false
    },
    "___format_template___": {
        size: 0,
        pointer: false,
        special: true,
        dblRef: false,
        templatePtr: null
    }
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
var compares= Object.keys(condSet)

module.exports = {
    types, mathOps, compares, condSet
}