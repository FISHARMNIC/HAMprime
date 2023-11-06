// Important functions

var genLabelCounter = 0;


module.exports = {
    maxLabels: {
        "8": 0,
        "16": 0,
        "32": 0
    },
    currentLabels: {
        "8": 0,
        "16": 0,
        "32": 0
    },
    requestTempLabel: function (type) {
        var bits = asm.typeToBits(type)
        var ret = `__TEMP${bits}_${this.currentLabels[String(bits)]}__`
        var modified = objCopy(type);
        modified.dblRef = true;
        userVariables[ret] = modified;
        this.currentLabels[String(bits)]++;
        return ret
    },
    done_generateTempLabels: function () {
        // finish up later, too lazy now, supposed to use max
        for (var i = 0; i < this.currentLabels["8"]; i++)
            outputCode.data.push(`__TEMP8_${i}__: .byte`)
        for (var i = 0; i < this.currentLabels["16"]; i++)
            outputCode.data.push(`__TEMP16_${i}__: .2byte`)
        for (var i = 0; i < this.currentLabels["32"]; i++)
            outputCode.data.push(`__TEMP32_${i}__: .4byte`)
    },
    literalLabel: function () {
        return `_compLITERAL${genLabelCounter++}`;
    },
    untypedLabel: function () { // create general label
        return `LABEL${genLabelCounter++}`;
    },
    stringLiteral: function (word) { // create an un-named string literal
        var lbl = this.literalLabel();
        outputCode.data.push( // create string
            `${lbl}: .asciz "${word}"`
        )
        return lbl
    },
    fromatIfConstant: function (x) {
        return parseInt(x) == x ? '$' + x : x
    },
    getVariableOrParamIfExists: function (x) {
        // IF BROKEN HERE SWAP THESE TWO UPSIDEDOWN
        if(Object.keys(userVariables).includes(asm.formatLocal(x)))
            return userVariables[asm.formatLocal(x)];
        if(Object.keys(userVariables).includes(x))
            return userVariables[x];
        return null
    },
    formatIfConstantOrLiteral: function (x) { // add dollar sign
        // var exists = this.getVariableOrParamIfExists(x)
        // || (exists != null && exists.special == true) 
        return parseInt(x) == x || x.includes("_compLITERAL") ? "$" + x : x
    },
    castSimple: function (type, data) {
        var temp = this.requestTempLabel(type)
        this.twoStepLoadConst("auto", temp, data)
        typeStack.push(type)
        return temp
    },
    loadVariable: function (_name, type, value) {
        this.twoStepLoadAuto(outputCode.text, _name, value, type, userVariables[_name])
    },
    createVariable: function (_name, type, value, asParam = false) {
        //console.log("CREATING", _name, type, outputCode.data)
        // if specials: if(!Object.keys(defines.special).includes(type)) 
        if(type.special && asParam) {
            outputCode.data.push(`${_name}: .4byte 0`)
            userVariables[_name] = objCopy(type)
        }
        else if (type.special) {
            // TODO: special
            outputCode.data.push(`${_name}: .4byte 0`)
           // console.log("BOBBBBBBBB", value, _name, type.templatePtr.type.templatePtr)
            var obuff = bracketStack.length == 0 ? outputCode.init : outputCode.text;
            obuff.push(
                `mov ${value}, %edx`,
                `mov %edx, ${_name}`,
            )
            userVariables[_name] = objCopy(type)
        } else {
            var out = `${_name}: ${asm.typeToAsm(type)} `
            userVariables[_name] = objCopy(type); // assign type to variable
                if (parseInt(value) == value) // constant number
                {
                    out += value
                } else {
                    out += '0'
                    if (type.dblRef) {
                        this.twoStepLoadPtr("auto", _name, value)
                    } else {
                        this.twoStepLoadConst("auto", _name, value)
                    }
                }
            outputCode.data.push(out)
        }

    },
    twoStepLoadPtr: function (outbuffer, _name, value, type = null, dest_type = null) {
        if (type == null) type = userVariables[_name]; // assume type
        if (dest_type == null) dest_type = type;

        var register = asm.formatRegister('d', type)
        var dregister = asm.formatRegister('d', dest_type)

        if (outbuffer == "auto") {
            if (bracketStack.length == 0) { // outside a function
                outbuffer = outputCode.init
            } else {
                outbuffer = outputCode.text
            }
        }
        if (asm.typeToBits(dest_type) > asm.typeToBits(type)) {
            outbuffer.push(`xor %edx,%edx`)
        }
        outbuffer.push(
            `mov ${value}, ${register}`,
            `mov ${dregister}, ${_name}`
        )
        // todo: if special type and moving pointer, free old space
    },
    twoStepLoadIntoAddr: function (outbuffer, _name, value, type) {
        var reg = asm.formatRegister('a', type)
        outbuffer.push(
            `mov ${_name}, %edx`,
            `mov ${value.includes("_compLITERAL") || (parseInt(value) == value)? "$" + value : value}, ${reg}`,
            `mov ${reg}, (%edx)`
        )
    },
    twoStepLoadConst: function (outbuffer, _name, value, type = null, dest_type = null) {
        value = '$' + value
        this.twoStepLoadPtr(outbuffer, _name, value, type, dest_type)
    },
    twoStepLoadAuto: function (outbuffer, _name, value, type = null, dest_type = null) {
        if (value == parseInt(value)) {
            this.twoStepLoadConst(outbuffer, _name, value, type, dest_type);
        } else {
            this.twoStepLoadPtr(outbuffer, _name, value, type, dest_type);
        }
    },
    createFunction: function (_name, params) {
        console.log("FUNC P:", params)
        var finalParams = [];

        outputCode.text.push(`${_name}:`, `swap_stack`)
        params.forEach(x => {
            if (x != ",") {
                //throwE(popTypeStack())
                var fp = {
                    name: x,
                    type: popTypeStack()
                }

                var localName = asm.formatLocal(x, _name)
                this.createVariable(localName, fp.type, 0, true);
                outputCode.text.push(
                    `pop %edx`,
                    `mov ${asm.formatRegister('d', fp.type.special? defines.types.p32 : fp.type)}, ${localName}`
                )
                finalParams.push(fp)
            }
        })
        //throwE(typeStack)
        var returnType = popTypeStack()
        userFunctions[_name] = {
            name: _name,
            parameters: finalParams,
            returnType
        }
        requestBracketStack = {
            type: "function",
            data: {
                name: _name
            }
        }
    },
    callFunction: function(_name, params, initializer = false) {
        params.forEach(x => {
            if(x != ",") {
                outputCode.text.push(`pushl ${this.formatIfConstantOrLiteral(x)}`)
            }
        })

        if(initializer && Object.keys(userInits).includes(_name))
        {
            outputCode.text.push(
                `swap_stack`,
                `call ${asm.formatInitializer(_name)}`,
                `swap_stack`,
            )
            return userInits[_name].returnType
        }

        outputCode.text.push(
            `swap_stack`,
            `call ${_name}`,
            `swap_stack`,
        )

        if(!initializer && Object.keys(userFunctions).includes(_name))
        {
            return userFunctions[_name].returnType
        }

        throwW(`Implicit declaration of function ${_name} (or calling from pointer). Unknown return type, using [u32]`)
        return defines.types.u32
    },
    createInitializer: function(_name, params) {
        var finalParams = [];
        outputCode.text.push(asm.formatInitializer(_name) + ":", `swap_stack`) 
        params.forEach(x => {
            if (x != ",") {
                var fp = {
                    name: x,
                    type: popTypeStack()
                }

                var localName = asm.formatLocal(x, _name)
                this.createVariable(localName, fp.type, 0, true);
                outputCode.text.push(
                    `pop %edx`,
                    `mov ${asm.formatRegister('d', fp.type.special? defines.types.p32 : fp.type)}, ${localName}`
                )
                finalParams.push(fp)
            }
        })
        var returnType = defines.types[_name]
        userInits[_name] = {
            name: _name,
            parameters: finalParams,
            returnType
        }
        requestBracketStack = {
            type: "initializer",
            data: {
                name: _name
            }
        }
    },
    reserveFormat(fmt, args) {
        var passed = {}
        if (args.includes(":")) {
            args.forEach((x, i) => {
                if (x == ":") {
                    passed[args[i - 1]] = args[i + 1];
                }
            })

        
            if (bracketStack.length == 0) { // static allocation at beginning of program
                var label = this.untypedLabel();
                outputCode.data.push(`${label}: # allocation for "${fmt}"`)
                formats[fmt].forEach(x => {
                    outputCode.data.push(`${asm.typeToAsm(x.type)} # .${x.name}`)
                })
                // todo: move data into sturcture
                throwE("TOP LEVEL FORMATS NOT IMPLEMENTED")
            } else { //must be dynamically allocated in runtime
                var label = this.requestTempLabel(defines.types.u32)
                var totSize = 0;
                formats[fmt].forEach(x => { totSize += asm.typeToBits(x.type) })
                outputCode.text.push( // allocate size and load pointer
                    `pushl \$${totSize / 8}`,
                    `swap_stack`,
                    `call __allocate__`,
                    `mov %eax, ${label}`,
                    `swap_stack`,
                )
                var offset = 0;
                formats[fmt].forEach(x => {
                    console.log("USINGGGGGG", x)
                    var reg = asm.formatRegister('d', x.type)
                    outputCode.text.push(`add $${offset / 8}, %eax`)
                    if (parseInt(passed[x.name]) == passed[x.name]) { //constant
                        outputCode.text.push(
                            `mov${asm.sizeToSuffix(x.type)} $${passed[x.name]}, (%eax)`
                        )
                    } else {
                        var use = passed[x.name]
                        if (use.includes("_compLITERAL")) // make this use substring
                            use = "$" + use
                        outputCode.text.push(
                            `mov ${use}, ${reg}`,
                            `mov ${reg}, (%eax)`
                        )
                    }
                    offset += parseInt(asm.typeToBits(x.type))
                })
                return label
            }
        } else { // ============================================ Initializers ============================================
            var resT = this.callFunction(fmt, args, true)
            return -1
            //throwE(res) // todo: un-labeled passing. ex. car<"bob",123> (not no use of ":")
        }
        //console.log("   - PASSED", passed)
        //console.log(`   - USING ${fmt}`)//, formats[fmt] returns array of objects {name,type}

    },
    getFormatProperty(name, property, returnAddr = false) {
        if(Object.keys(userVariables).includes(asm.formatLocal(name))) 
            name = asm.formatLocal(name);
        var fmt = userVariables[name].templatePtr
        var sum = 0;
        var index = 0;
        fmt.every((x, i) => {
            if (x.name == property) {
                index = i;
                return false
            } else {
                sum += asm.typeToBits(x.type) / 8
            }
        })
        var lbl;
        var reg = asm.formatRegister("a", fmt[index].type)
        if (returnAddr) {
            lbl = this.requestTempLabel(defines.types.u32)
            outputCode.text.push(
                `mov ${name}, %edx`,
                `add \$${sum}, %edx`,
                `mov %edx, ${lbl}`,
            )
        } else {
            lbl = this.requestTempLabel(fmt[index].type)
            outputCode.text.push(
                `mov ${name}, %edx`,
                `add \$${sum}, %edx`,
                `mov (%edx), ${reg}`,
                `mov ${reg}, ${lbl}`
            )
            typeStack.push(fmt[index].type)
        }

        return (lbl)
    }
}