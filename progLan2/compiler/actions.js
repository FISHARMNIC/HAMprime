// Important functions

var genLabelCounter = 0;


module.exports = {
    maxLabels: {
        "8": 0,
        "16": 0,
        "32": 0
    },
    currentLabels: {
        "0": 0,
        "8": 0,
        "16": 0,
        "32": 0
    },
    objectCompare: function (a, b) {
        return JSON.stringify(a) == JSON.stringify(b)
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
        for (var i = 0; i < this.currentLabels["0"]; i++)
            outputCode.data.push(`__TEMP0_${i}__: .4byte 0 # for format deref`)
        for (var i = 0; i < this.currentLabels["8"]; i++)
            outputCode.data.push(`__TEMP8_${i}__: .byte 0 `)
        for (var i = 0; i < this.currentLabels["16"]; i++)
            outputCode.data.push(`__TEMP16_${i}__: .2byte 0 `)
        for (var i = 0; i < this.currentLabels["32"]; i++)
            outputCode.data.push(`__TEMP32_${i}__: .4byte 0 `)
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
        return parseFloat(x) == x ? '$' + x : x
    },
    getVariableOrParamIfExists: function (x) {
        // IF BROKEN HERE SWAP THESE TWO UPSIDEDOWN
        if (Object.keys(userVariables).includes(asm.formatLocal(x)))
            return userVariables[asm.formatLocal(x)];
        if (Object.keys(userVariables).includes(x))
            return userVariables[x];
        return null
    },
    formatIfConstantOrLiteral: function (x) { // add dollar sign
        // var exists = this.getVariableOrParamIfExists(x)
        // || (exists != null && exists.special == true) 
        return (parseFloat(x) == x || String(x).includes("_compLITERAL")) ? "$" + x : x
    },
    castSimple: function (type, data) {
        var temp = this.requestTempLabel(type)
        this.twoStepLoadConst("auto", temp, data)
        typeStack.push(type)
        return temp
    },
    loadVariable: function (_name, type, value) {
        if (!this.objectCompare(userVariables[_name], type) && type.bits != undefined) {
            throwE(`Type confliction. Variable ${_name} does not have type ${type}`)
            // finish, dont let conversion from different int type. Only float<->u32
            userVariables[_name] = type
        }
        this.twoStepLoadAuto(outputCode.text, _name, value, type, userVariables[_name])
    },
    createVariable: function (_name, type, value, asParam = false) {
        //throwE("CREATING", _name, type)
        // if specials: if(!Object.keys(defines.special).includes(type)) 

        if (Object.keys(userVariables).includes(_name) || localsIncludes(_name)) {
            throwE("Variable already defined", _name)
        }
        if (type.special && asParam) {

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
            if (parseFloat(value) == value && inscope == 0) // constant number
            {
                out += value
            } else {
                out += '0'

                if (type.dblRef) {
                    this.twoStepLoadPtr("auto", _name, value, type) //HERE IF BROKEN DELETE TYPE ON HERE AND 104
                } else {
                    this.twoStepLoadConst("auto", _name, value, type)
                }
            }
            if (type.size == 64) {

                userVariables[_name] = objCopy(defines.types.p32);
                if(lastArrInfo.isList) 
                {
                    this.createVariable(asm.formatListSizeVar(_name), defines.types.u32, lastArrInfo.size)
                }

                userListInitLengths[_name] = lastArrInfo.size;
            }
            outputCode.data.push(out)
            //throwE(outputCode.data)
        }

    },
    twoStepLoadPtr: function (outbuffer, _name, value, type = null, dest_type = null) {
        if (type == null) type = userVariables[_name]; // assume type
        if (dest_type == null) dest_type = type;

        var register = asm.formatRegister('d', type)
        var dregister = asm.formatRegister('d', dest_type)

        //throwE(type)
        if (outbuffer == "auto") {
            if (bracketStack.length == 0 && type.size != 64) { // outside a function
                outbuffer = outputCode.init
            } else {
                outbuffer = outputCode.text
            }
        }

        //outbuffer.push("push %edx")

        if (asm.typeToBits(dest_type) > asm.typeToBits(type)) {
            outbuffer.push(`xor %edx,%edx`)
        }

        if (type.size == 64 && value[0] == "$") {
            value = value.slice(1) // remove $ 
        }

        outbuffer.push(
            `mov ${value}, ${register}`,
            `mov ${dregister}, ${_name}`,
        )

        //throwE(outbuffer)
        // todo: if special type and moving pointer, free old space
    },
    twoStepLoadIntoAddr: function (outbuffer, _name, value, type) {
        var reg = asm.formatRegister('a', type)
        outbuffer.push(
            `mov ${_name}, %edx`,
            `mov ${value.includes("_compLITERAL") || (parseFloat(value) == value) ? "$" + value : value}, ${reg}`,
            `mov ${reg}, (%edx)`,
        )
    },
    twoStepLoadConst: function (outbuffer, _name, value, type = null, dest_type = null) {
        value = '$' + value
        this.twoStepLoadPtr(outbuffer, _name, value, type, dest_type)
    },
    twoStepLoadAuto: function (outbuffer, _name, value, type = null, dest_type = null) {
        if (value == parseFloat(value)) {
            this.twoStepLoadConst(outbuffer, _name, value, type, dest_type);
        } else {
            this.twoStepLoadPtr(outbuffer, _name, value, type, dest_type);
        }
    },
    createFunction: function (_name, params) {
        console.log("FUNC P:", params)
        var finalParams = [];

        outputCode.text.push(`${_name}:`, `swap_stack`)

        var tempout = []
        params.forEach(x => {
            if (x != ",") {
                //throwE(popTypeStack())
                var fp = {
                    name: x,
                    type: popTypeStack()
                }

                var localName = asm.formatLocal(x, _name)
                this.createVariable(localName, fp.type, 0, true);
                tempout.push(
                    `pop %edx; mov ${asm.formatRegister('d', fp.type.special ? defines.types.p32 : fp.type)}, ${localName}`
                )
                finalParams.push(fp)
            }
        })

        outputCode.text.push(...tempout.reverse());
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
    callFunction: function (_name, params, initializer = false, isMethod = null) {
        //throwE(userVariables)
        params.filter(x => x != ",").forEach((x, ind) => {
            //throwE(params, ind)
            // if(userFunctions[_name] != undefined && userFunctions[_name].parameters[ind] != undefined && userFunctions[_name].parameters[ind].type.float && (parseFloat(x) == x))
            // {
            //     x = jsF64ToF32IntegerBitsStr(x);
            // }
            outputCode.text.push(`pushl ${this.formatIfConstantOrLiteral(x)}`)
        })

        if (initializer && Object.keys(userInits).includes(_name)) {
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

        if (isMethod != null) {
            return isMethod.returnType
        }

        if (!initializer && (Object.keys(userFunctions).includes(_name))) {

            return userFunctions[_name].returnType
        }

        throwW(`Implicit declaration of function ${_name} (or calling from pointer). Unknown return type, using [u32]`)
        return defines.types.u32
    },
    createInitializer: function (_name, params) {
        outputCode.text.push(asm.formatInitializer(_name) + ":", `swap_stack`)
        var finalParams = asm.handleParams(_name, params.reverse())
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
    createMethod: function (struct_name, method_name, params, returnType) {
        outputCode.text.push(asm.formatMethod(method_name, struct_name) + ":", `swap_stack`)
        var finalParams = asm.handleParams(struct_name, params)
        formatMethods[struct_name][method_name] = {
            params, returnType
        }
        requestBracketStack = {
            type: "method",
            data: {
                name: method_name,
                struct_name
            }
        }
        //defines[struct_name].methods.push()
        //console.log()
        //throwW("WIP METHODS", Object.values(formatMethods).map(x => Object.keys(x)).flat())

    },
    dynamicallyAllocate(sizeBytes, data = []) {
        var label = this.requestTempLabel(defines.types.u32)
        outputCode.text.push(
            `# ------ begin dynamic alloc ------`,
            `pushl \$${sizeBytes}`,
            `swap_stack`,
            `call __allocate__`,
            `mov %eax, ${label}`,
            `swap_stack`,
        )
        var offset = 0;
        if (data.length != 0) {
            data.forEach(x => {
                var reg = asm.formatRegister('d', x.type)
                if (x.value == parseFloat(x.value)) { //constant
                    outputCode.text.push(
                        `mov${asm.sizeToSuffix(x.type)} $${x.value}, (%eax)`
                    )
                } else {
                    var use = x.value
                    if (use.includes("_compLITERAL")) // make this use substring
                        use = "$" + use
                    outputCode.text.push(
                        `mov ${use}, ${reg}`,
                        `mov ${reg}, (%eax)`
                    )
                }
                outputCode.text.push(`add $4, %eax`)
                offset += parseFloat(asm.typeToBits(x.type))
            })
        }
        outputCode.text.push(`# ------- end dynamic alloc -------`)
        return label
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
                // todo: rewrite to use "dynamicallyAllocate()"
                var label = this.requestTempLabel(defines.types.u32)
                var totSize = 0;
                formats[fmt].forEach(x => { totSize += asm.typeToBits(x.type) })
                outputCode.text.push( // allocate size and load pointer
                    `# ------ begin format alloc ------`,
                    `pushl \$${totSize / 8}`,
                    `swap_stack`,
                    `call __allocate__`,
                    `mov %eax, ${label}`,
                    `swap_stack`,
                )
                var offset = 0;
                formats[fmt].forEach(x => {
                    console.log("*************USINGGGGGGGG *****", x)
                    var reg = asm.formatRegister('d', x.type)
                    outputCode.text.push(`add $${offset / 8}, %eax`)
                    if (parseFloat(passed[x.name]) == passed[x.name]) { //constant
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
                    offset += parseFloat(asm.typeToBits(x.type))
                })
                outputCode.text.push(`# ------ end format alloc ------`,)
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
        if (Object.keys(userVariables).includes(asm.formatLocal(name)))
            name = asm.formatLocal(name);
        var fmt = userVariables[name].templatePtr
        var sum = 0;
        var index = 0;
        //throwE(userVariables[name], name) 
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

        //outputCode.text.push("push %edx")

        if (returnAddr) {
            lbl = this.requestTempLabel(defines.types.u32)
            outputCode.text.push(
                `# ------ get format property ------`,
                `mov ${name}, %edx`,
                `add \$${sum}, %edx`,
                `mov %edx, ${lbl}`,
                `# ------ end get format prop ------`,

            )
        } else {
            lbl = this.requestTempLabel(fmt[index].type)
            outputCode.text.push(
                `# ------ get format property ------`,
                `mov ${name}, %edx`,
                `add \$${sum}, %edx`,
                `mov (%edx), ${reg}`,
                `mov ${reg}, ${lbl}`,
                `# ------ end get format prop ------`,
            )
            typeStack.push(fmt[index].type)
        }

        return (lbl)
    },
    indexArr(base, size, ind, keepAddr = false) {
        var lbl = this.requestTempLabel(defines.types.u32)
        outputCode.push(
            `push %eax; push %ebx`,
            `mov ${size}, %eax`,
            `mov ${ind}, %ebx`,
            `mul %ebx`,
        )

        if (returnAddr) {
            outputCode.push(
                `mov ${ind}, %eax`,
                `add %ebx, %eax`,
                `mov %eax, ${lbl}`,
                `pop %ebx; pop %eax`
            )
        } else {
            outputCode.push(
                `mov ${ind}, %eax`,
                `add %ebx, %eax`,
                `mov (%eax), ${lbl}`,
                `pop %ebx; pop %eax`
            )
        }
    },
    allocateArrayWithContents(contents, static = true, isList = false) {
        if (static) {
            var lbl = this.untypedLabel();
            outputCode.data.push(`${lbl}:`)

            contents.forEach(x => {
                outputCode.data.push(`.4byte ${x.value}`)
            })
            typeStack.push(defines.types.p32);
            return lbl
        } else {
            // todo: check if array is clamped to size
            contents = contents.map(x => {
                return { value: x.value, type: defines.types.u32 }
            })
            typeStack.push(defines.types.dp32);
            lastArrInfo = {size: contents.length, isList};
            /* above returns a new pointer to allocated data. If we set our own var to this pointer,
            *  we get a double pointer. Special type dp32 tells compiler to deference the pointer
            *  when creating a new variable
            */
            return this.dynamicallyAllocate(4 * contents.length, contents);
            // call malloc etc.
        }
    },
    derefPointer(address, type) {
        var lbl = this.requestTempLabel(type)
        var outputReg = asm.formatRegister("d", type)
        outputCode.text.push(
            `mov ${address}, %edx`,
            `mov (%edx), ${outputReg}`,
            `mov ${outputReg}, ${lbl}`
        )
        return lbl
    },
    listNewItem(list_name, list_type, new_item) {
        var oldSize = asm.formatListSizeVar(list_name);
        if (userListInitLengths[list_name] == 0) {
            outputCode.text.push(
                `pushl \$4`,
                `swap_stack`,
                `call __allocate__`,
                `mov %eax, ${list_name}`,
                `swap_stack`,
            )
            userListInitLengths = -1 // overwrite
        } else {
            outputCode.text.push(
                `# -- array append begin --`,
                `push ${list_name}`,
                `push ${oldSize}`,
                `swap_stack`,
                `call realloc_rapid`,
                `swap_stack`,
                `mov __return_32__, %eax`,
                `mov %eax, ${list_name}`,
                `# --- array append end ---`
            )
        }
        outputCode.text.push(
            `# -- array load begin --`,
            `mov ${list_name}, %eax`,
            `mov ${actions.formatIfConstantOrLiteral(new_item)}, %ebx`,
            `mov ${oldSize}, %ecx`,
            `mov %ebx, (%eax, %ecx, 4)`,
            `incl ${oldSize}`,
            `# --- array load end ---`
        )
    }
}

function localsIncludes(word) {
    //console.log("######$$$$$$%%%%!~~~~~~", Object.keys(userVariables).includes(asm.formatLocal(word)), inscope)
    return ((inscope != 0) && Object.keys(userVariables).includes(asm.formatLocal(word)))
}