module.exports = {
    nameFromType: function (type) {
        var rt = 0;
        Object.entries(defines.types).forEach(x => {
            if (JSON.stringify(x[1]) == JSON.stringify(type)) {
                rt = x[0]
            }
        })
        if (rt == 0) {
            Object.entries(defines.special).forEach(x => {
                if (JSON.stringify(x[1]) == JSON.stringify(type)) {
                    rt = x[0]
                }
            })
        }
        return rt
    },
    typeToAsm: function (x) {
        if (x.special) {
            // TODO: special asm parsing
        } else {
            if (x.pointer) {
                return `.4byte`
            } else {
                return `.${x.size / 8 == 1 ? "" : x.size / 8}byte`
            }
        }
    },
    sizeToSuffix: function (x) {
        console.log(x)
        var t = this.typeToBits(x)
        if(t == 32) return 'l'
        if(t == 16) return 'w'
        if(t == 8) return 'b'
        throwE("FAIL")
    },
    formatRegister: function (register, type, low = true) {
        if(type.templatePtr != undefined) { // format register for a format / struct
            return `%e${register}x`
        } else {
        if (type.pointer || type.size == 32) return `%e${register}x`
        if (type.size == 16) return `%${register}x`
        if (type.size == 8) return low ? `%${register}l` : `%${register}h`
        throwE("Unknown type [" + JSON.stringify(type) + "]")
        }
    },
    formatLocal: function(_name, scopeName = inscope.name) {
        return `_loc_${scopeName}_${_name}`
    },
    typeToBits: function(x) {
        if(x.pointer) return 32
        return parseInt(x.size)
    },
    guessType: function(x) {
        if(parseInt(x) == x) return defines.types.u32;
        var g = actions.getVariableOrParamIfExists(x);
        return g
    },
    getConditionalMoveName: function(x) {
        var out = {

        }
    },
    handleParams(_name, params) {
        var finalParams = [];
        params.forEach(x => {
            if (x != ",") {
                var fp = {
                    name: x,
                    type: popTypeStack()
                }

                var localName = this.formatLocal(x, _name)
                actions.createVariable(localName, fp.type, 0, true);
                outputCode.text.push(
                    `pop %edx`,
                    `mov ${this.formatRegister('d', fp.type.special? defines.types.p32 : fp.type)}, ${localName}`
                )
                finalParams.push(fp)
            }
        })
        return finalParams
    },
    formatInitializer: function(nameOfType) {
        return nameOfType + "__INITIALIZER__"
    },
    formatMethod: function(method_name, struct_name) {
        return struct_name + "__METHOD_" + method_name + "__"
    }
}

