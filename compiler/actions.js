// Important functions

var genLabelCounter = 0;


module.exports = {
    maxLabels: {
        "8": 0,
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
    globalLabels: {
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
    requestPersistentLabel: function (type) {
        var bits = asm.typeToBits(type)
        var ret = `__GLOB${bits}_${this.globalLabels[String(bits)]}__`
        var modified = objCopy(type);
        modified.dblRef = true;
        userVariables[ret] = modified;
        this.globalLabels[String(bits)]++;
        //console.log(ret)
        return ret
    },
    done_generateTempLabels: function () {
        debugPrint("Generating temporary labels", this.maxLabels)
        for (var i = 0; i < this.maxLabels["0"]; i++)
            outputCode.data.push(`__TEMP0_${i}__: .4byte 0 # for format deref`)
        for (var i = 0; i < this.maxLabels["8"]; i++)
            outputCode.data.push(`__TEMP8_${i}__: .byte 0 `)
        for (var i = 0; i < this.maxLabels["16"]; i++)
            outputCode.data.push(`__TEMP16_${i}__: .2byte 0 `)
        for (var i = 0; i < this.maxLabels["32"]; i++)
            outputCode.data.push(`__TEMP32_${i}__: .4byte 0 `)

        for (var i = 0; i < this.globalLabels["0"]; i++)
            outputCode.data.push(`__GLOB0_${i}__: .4byte 0 # for format deref`)
        for (var i = 0; i < this.globalLabels["8"]; i++)
            outputCode.data.push(`__GLOB8_${i}__: .byte 0 `)
        for (var i = 0; i < this.globalLabels["16"]; i++)
            outputCode.data.push(`__GLOB16_${i}__: .2byte 0 `)
        for (var i = 0; i < this.globalLabels["32"]; i++)
            outputCode.data.push(`__GLOB32_${i}__: .4byte 0 `)
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
        if (objectIncludes(userVariables,asm.formatLocal(x)))
            return userVariables[asm.formatLocal(x)];
        if (objectIncludes(userVariables,x))
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
    loadStackVariable: function (_name, type, value) {
        //this.loadVariable(_name, type, value);
        var reg = asm.formatRegister("d", userVariables[_name])
        outputCode.text.push(
            `mov ${this.formatIfConstantOrLiteral(value)}, ${reg}`,
            `mov %edx, ${this.getStackOffset(_name)}(%esp)`
        )
    },
    loadVariableSmart: function (_name, type, value) {
        if (objectIncludes(variablesOnStack,_name)) {
            this.loadStackVariable(_name, type, value)
        }
        else {
            this.loadVariable(_name, type, value)
        }
    },
    createStackVariable: function (_name, type, value, calledByDyna = false) {
        // outputCode.data.push(`${_name}: ${asm.typeToAsm(type)} 0`)
        // userVariables[_name] = objCopy(type)
        //throwE(_name)
        this.createVariable(_name, type, value, false, true)

        var reg = asm.formatRegister("a", type)
        outputCode.text.push(
            `mov ${this.formatIfConstantOrLiteral(value)}, ${reg}`,
            `pushl %eax`
        )
        this.allocateExistingStackVarNoPush(_name)

        debugPrint("Changing current stack offset. Now is:", currentStackOffset, _name)
        if (lastArrInfo.isList && !calledByDyna) {
            outputCode.text.push(
                `mov ${asm.formatListSizeVar(_name)}, ${reg}`,
                `pushl %eax`
            )
            this.allocateExistingStackVarNoPush(asm.formatListSizeVar(_name))
            debugPrint("~~~~~~~~~~ Changing current stack offset. Now is:", currentStackOffset)
        }
    },
    allocateExistingStackVarNoPush: function (_name) {
        variablesOnStack[_name] = currentStackOffset
        currentStackOffset += 4
    },
    readStackVariable: function (_name) {
        var reg = asm.formatRegister("d", userVariables[_name])
        outputCode.text.push(
            `# -- loading "${_name}" from stack --`,
            `mov ${this.getStackOffset(_name)}(%esp), %edx`,
            `mov ${reg}, ${_name}`
        )
    },
    clearStackVariables: function (onlyAsm = false) {
        if (currentStackOffset != 0) {
            outputCode.text.push(`add \$${currentStackOffset}, %esp`)
        }
        if (!onlyAsm) {
            currentStackOffset = 0;
        }
    },
    clearAllLocalData: function()
    {
        var ob = [];
        Object.entries(localDynaMem).forEach(x => {
            var key = x[0]
            var val = x[1]
            if(!val.persistent)
            {
                debugPrint("FREEING TRANSIENT", key);
                //ob.push(`free_rapid ${key}, ${val.sizeBytes}`)
                ob.push(`free_rapid ${this.getStackOffset(key)}(%esp), ${val.sizeBytes}`)
            }
        })
        if(ob.length != 0)
        {
            outputCode.text.push(
                `push %ebp`,
                ...ob,
                `pop %ebp`
            )
        }
        localDynaMem = {};
        this.clearStackVariables();
    },
    getStackOffset: function (_name) {
        debugPrint("Offset for", _name, variablesOnStack[_name], "stack set to:", currentStackOffset, "->", currentStackOffset - 4 - variablesOnStack[_name])
        if (_name == "counter") {
            //throwE(variablesOnStack, currentStackOffset) // should be offsetting 20. 8 bytes off. Something is wrong
        }
        return currentStackOffset - 4 - variablesOnStack[_name]
    },
    createVariable: function (_name, type, value, asParam = false, dummy = false) {
        //throwE(_name, value, type)
        debugPrint(_name, value)
        // if specials: if(!Object.keys(defines.special).includes(type)) 

        if (objectIncludes(userVariables,_name) || localsIncludes(_name)) {
            throwE("Variable already defined", _name)
        }
        if (type.special && asParam) {

            outputCode.data.push(`${_name}: .4byte 0`)
            userVariables[_name] = objCopy(type)
        }
        else if (type.special) {
            // TODO: special
            outputCode.data.push(`${_name}: .4byte 0`)
            // debugPrint("BOBBBBBBBB", value, _name, type.templatePtr.type.templatePtr)
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
                out += value // 123 abc HERE THIS IS NOT RESETING VAR IN FN?
            } else {
                out += '0'

                if (!dummy) {
                    if (!type.dblRef && parseFloat(value) != value) {
                        this.twoStepLoadPtr("auto", _name, value, type) //HERE IF BROKEN DELETE TYPE ON HERE AND 104
                    } else {
                        this.twoStepLoadConst("auto", _name, value, type)
                    }
                }
            }
            if (type.size == 64) {

                userVariables[_name] = objCopy(defines.types.p32);
                if (lastArrInfo.isList) {
                    this.createVariable(asm.formatListSizeVar(_name), defines.types.u32, lastArrInfo.size)
                }

                userListInitLengths[_name] = lastArrInfo.size;
            }
            if (dummy) {
                outputCode.data.push(`${_name}: ${asm.typeToAsm(type)} 0`)
            } else {
                outputCode.data.push(out)
            }
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
        value = String(value)
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
    createFunctionNew: function (_name, params) {

        debugPrint("FUNC P:", params)

        outputCode.text.push(`${_name}:`, `swap_stack`)

        var finalParams = asm.handleParamsNew(_name, params)
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
    createFunctionOld: function (_name, params) { // no stack variables
        debugPrint("FUNC P:", params)
        var finalParams = [];

        outputCode.text.push(`${_name}:`, `swap_stack`)

        var tempout = []
        params.forEach(x => {
            if (x != ",") {
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
            //     x = doubleToInt(x);
            // }
            outputCode.text.push(`pushl ${this.formatIfConstantOrLiteral(x)}`)
        })

        if (initializer && objectIncludes(userInits,_name)) {
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

        if (!initializer && (objectIncludes(userFunctions,_name))) {

            return userFunctions[_name].returnType
        }

        throwW(`Implicit declaration of function ${_name} (or calling from pointer). Unknown return type, using [u32]`)
        return defines.types.u32
    },
    createInitializer: function (_name, params) {
        outputCode.text.push(asm.formatInitializer(_name) + ":", `swap_stack`)
        var finalParams = asm.handleParamsNew(_name, params)
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
        var finalParams = asm.handleParamsNew(struct_name, params)
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
        //debugPrint()
        //throwW("WIP METHODS", Object.values(formatMethods).map(x => Object.keys(x)).flat())

    },
    mallocToStack(sizeBytes) {
        // no freeing required, in stack
        outputCode.text.push(
            `pushl \$${sizeBytes}`,
            `swap_stack`,
            `call __allocate__`,
            `swap_stack`,
            `push %eax`
        )
    },
    mallocDynaMemHelper(sizeBytes, persistent = '0')
    {
        if(persistent == '0')
        {
            persistent = usePersistanceByDef;
        }
        var label = this.untypedLabel(); // del
        this.createStackVariable(label, defines.types.u32, 0, true); // del
        localDynaMem[label] = {sizeBytes, persistent};
        localDynaMemInLine.push(localDynaMem[label]);
        return label 
    },
    mallocSize(sizeBytes, persistent = '0') {

        var label = this.mallocDynaMemHelper(sizeBytes, persistent);

        //var label = this.requestPersistentLabel(defines.types.u32) // todo: use stack instead
        outputCode.text.push(
            `# ------ begin malloc ------`,
            `pushl \$${sizeBytes}`,
            `swap_stack`,
            `call __allocate__`,
            `mov %eax, ${label}`,
            `swap_stack`,
            `mov %eax, (%esp)`, // del
            `# ------ end malloc --------`,
        )
        
        debugPrint(`allocated ${sizeBytes} bytes under label ${label}`)
        return label
    },
    dynamicallyAllocate(sizeBytes, data = []) {
        var label = this.mallocSize(sizeBytes)
        var offset = 0;
        outputCode.text.push(`# ------- begin dynamic alloc and load -------`)
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
        outputCode.text.push(`# ------- end dynamic alloc and load ---------`)
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
                var totSize = asm.calcSizeOfFormat(fmt);
                var label = this.mallocSize(totSize / 8)
                var offset = 0;
                formats[fmt].forEach(x => {
                    //debugPrint("*************USINGGGGGGGG *****", x)
                    var reg = asm.formatRegister('d', x.type)
                    outputCode.text.push(`add \$${offset / 8}, %eax`)
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
        //debugPrint("   - PASSED", passed)
        //debugPrint(`   - USING ${fmt}`)//, formats[fmt] returns array of objects {name,type}

    },
    getFormatPropertyNew(name, restOfLine = [], returnAddr = false) {
        if (localsIncludes(name)) {
            name = asm.formatLocal(name);
        }
        if (this.isOnStack(name)) {
            this.readStackVariable(name)
        }
        var restIndex = -1;
        //throwE(restOfLine)
        if (restOfLine[0] == ".") {

            restIndex = 0;
            var flipFlop = false;
            // bob . bob . bob
            while ((!flipFlop && restOfLine[restIndex] == ".") || flipFlop) {
                flipFlop = !flipFlop;
                restIndex++;
            }
            restOfLine = restOfLine.slice(0, restIndex).filter(x => x != ".");
            var propertyChain = [];
            var host = userVariables[name]

            //throwE(name, restOfLine, userVariables[name])
            // get each chains offset and type
            restOfLine.forEach(x => {
                var out = searchFormatForProperty(host, x)
                propertyChain.push(out)
                host = out.value ? out.value.type : 0
            })
            var lastItem = propertyChain[propertyChain.length - 1]
            var lbl = returnAddr ? this.requestTempLabel(defines.types.u32) : this.requestTempLabel(lastItem.value.type)

            outputCode.text.push(
                `# --- beginning property ${returnAddr ? "address" : "value"} read ---`,
                `mov ${name}, %edx`
            )
            if (propertyChain.length == 1) {
                outputCode.text.push(
                    `add \$${propertyChain[0].sum}, %edx` //
                )
                if (returnAddr) {
                    outputCode.text.push(
                        `mov %edx, ${lbl}`,
                    )
                } else {
                    outputCode.text.push(
                        `mov (%edx), %eax`,
                        `mov %eax, ${lbl}`,
                    )
                }
                return { lbl, restOfLine }
            }
            propertyChain.slice(0, propertyChain.length - 1).forEach(x => {
                outputCode.text.push(
                    `add \$${x.sum}, %edx`,
                    `mov (%edx), %eax`,
                    `mov %eax, %edx`
                )
            })

            if (returnAddr) {
                outputCode.text.push(
                    `add \$${lastItem.sum}, %edx`,
                    `mov %edx, ${lbl}` // 
                )
            } else {
                outputCode.text.push(
                    `add \$${lastItem.sum}, %edx`,
                    `mov (%edx), %eax`,
                    `mov %eax, ${lbl}`
                )
            }

            outputCode.text.push(`# --- end property ${returnAddr ? "address" : "value"} read ---`,)
            return { lbl, restOfLine }
        } else {
            return {lbl:name, restOfLine}
        }
    },
    getFormatProperty(name, property, returnAddr = false, restOfLine = []) {
        if (objectIncludes(userVariables,asm.formatLocal(name))) {
            name = asm.formatLocal(name);
        }



        // todo, phase this code out. Make it all use the propertyChain list

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

        // note, use (%edx + sum) instead
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

        throwE("PHASE OUT")
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
            typeStack.push(defines.types.t32);
            return lbl
        } else {
            // todo: check if array is clamped to size
            contents = contents.map(x => {
                return { value: x.value, type: defines.types.u32 }
            })
            typeStack.push(defines.types.dp32);
            lastArrInfo = { size: contents.length, isList };
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
        if (objectIncludes(variablesOnStack,oldSize)) {
            this.readStackVariable(oldSize)
        }
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
            `incl ${oldSize}`
        )
        if (this.isOnStack(oldSize)) {
            this.loadStackVariable(oldSize, 0, oldSize)
        }
        outputCode.text.push(
            `# --- array load end ---`
        )
    },
    isOnStack: function (_name) {
        return objectIncludes(variablesOnStack,_name)
    }
}

function localsIncludes(word) {
    //debugPrint("######$$$$$$%%%%!~~~~~~", Object.keys(userVariables).includes(asm.formatLocal(word)), inscope)
    return ((inscope != 0) && objectIncludes(userVariables,asm.formatLocal(word)))
}

function searchFormatForProperty(fmt, property) {
    var index = -1;
    var sum = 0;
    //debugPrint("@@@@@@ scanning @@@@@@", fmt)
    fmt.templatePtr.every((x, i) => {
        //debugPrint(i)
        if (x.name == property) {
            index = i;
            return false
        } else {
            sum += asm.typeToBits(x.type) / 8
            return true
        }
    })
    return { sum, value: fmt.templatePtr[index] }
}