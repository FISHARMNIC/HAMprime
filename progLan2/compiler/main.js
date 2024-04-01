/* TODO: 
- [NEW] add command line args
- [NEW] Improve string handling QOL
- [NEW] Add declaring buffer just by giving length
- [NEW] Add proglan file inclusion
- [NEW] Add function that copies a format, to create a new instance with same values
- [NEW] Add float casting and vice versa
- [NEW] Add untyped params
- [NEW] Add variable freeing (for formats, arrays, and lists)
- [NEW] Add multi-dim arrays. Setting is done with commas: 2dArr <[# x+1,# y+1]- other2dArr[# x-1,# y-1];
- [NEW] Add direct parameter from register or return in register, like bob function<eax p1> -> ebx
- [NEW] Add forward declaration
- [NEW] (Check if fully working) Special local variables can be declared, which places them on the stack. When the compiler sees them, it automatically loads (%esp + x) into the label for that variable
    - Lists do not work
- [NEW] Add static properties
- [NEW] Make all dynam. allocated things freed at the end of the function. If you add a keyword "keep" then it is not freed

- [HIGH] Make calling the function "malloc" also result in transience/persistence. Maybe make some sort of function keyword that specifies whether the result needs to be garbage collected?
- [HIGH] Make it so loading an init. into "this" (ex. this.price <- Price<domestic_price>) will not have transience no matter what. And at the end, a free actually has to free this data too
- [HIGH] "variablesOnStack" is never cleared. Should I? Check if compiler prioritizes stack vars
- [HIGH] Math not working on minus sign. See factorial.x: MATH ON [ '_loc_factorial_number' ] should include - 1
- [HIGH] Make sure initializers and methods use asm.handleParamsNew
- [HIGH] Lists cannot be passed as params
- [HIGH] Make all parameters stack vars
- [HIGH] Local variables don't exist! They are created like normal variables
- [HIGH] Allow top level (static allocation) of lists (not arrays)
- [HIGH] change math engine to use just a regular label like templabel
- [HIGH] Fix argv
- [HIGH] Floats cant be compared, since they are stored as IEEE
- [HIGH] fix /Users/squijano/Documents/progLan2/examples/tests/flow/factorial.x
- [HIGH] Temporarily made math require "#" beforehand, fix this. Originally, math will not work on something like "bob.length * jon" as it will see "length * jon"
- [HIGH] Add local variables by making setter and getter functions for accessing user variable types that does it automatically
- [HIGH] Lists dont work for stackVars

- [LOW] MAKE REQUEST BRACKET STACK AN ARR, SO EVEN MORE NESTING? (most likely not needed)
- [LOW] Fix temp labels creating more than needed, use same system for HAM where each line the counter resets
- [LOW] For IF statements, instead of checking if the value is 1, make sure greater than zero. This makes it so that you can have for example if(bob) where bob is any nonzero number
- [LOW] Possible error, make sure that u8 and u16 are being passed correctly to stack when calling function. Must be fully cast to u32
- [LOW] Maybe change it so that instead having to realloc "this" for each method and init, just have one "this" var dedicated to each format?
- [LOW] Should I be closing inscope upon "}"? Look at elif for function not setting inscope to null
- [LOW] Switch class intiators to be called with paren. instead: Car(1,2,3) vs Car<1,2,3>
- [LOW] Make switch to 64bit
*/

const fs = require("fs");

globalThis.inputCode; // array with split code
globalThis.outputCode = { // object with out data
    data: [],
    init: [],
    text: [],
    autoPush: function () {
        if (bracketStack.length == 0)
            this.init.push(...arguments)
        else
            this.text.push(...arguments)
    }
}

globalThis.includedAssemblyFiles = []; // Array  : [dir,...]                         : assembly files included by uses
globalThis.formats = {};               // Object : {format names: properties,...}   : 
globalThis.userInits = {}              // Object : {format init: properties,...}    : 
globalThis.formatMethods = {};         // Object : {format method: properties,...}  : 
globalThis.oldThisType = [];           // ??
globalThis.requestBracketStack = 0;    // Var                                       : Used for anything that needs a bracket on the next line
globalThis.bracketStack = [];          // Stack  : [{info},...]                     : All data about currently nested brackets
globalThis.typeStack = [];             // Stack  : [type,...]                       : Recent types compiler looked over
globalThis.lastArrInfo = 0;            // Var                                       : ?? Size of allocated lists
globalThis.inscope = 0;                // Var                                       : Current function information
globalThis.currentStackOffset = 0;     // Var                                       : Stack offset for stack allocated variables
globalThis.freedData = [];             // -- Unused -- (to delete)
globalThis.mostRecentIfStatement = []  // Stack?                                    : For elifs 
globalThis.globalInd = 0               // Var                                       : Current line that the compiler is looking at 
globalThis.userMacros = {}             // ??
globalThis.userListInitLengths = {}    // Object                                    : Declaration lengths of lists. Set to -1 if they were set to 0, and have already been allocated
globalThis.variablesOnStack = {}       // Object : {name: offset, ...}              : All variables currently in stack (reset after end of scope)
globalThis.localDynaMem = {};          // Object : {label: {sizeBytes, persistent}  : All labels that were dyn. alloc  (reset after end of scope)
globalThis.localDynaMemInLine = []     // Array  : [localDynaMem entry]             : All data allocated dynamically (reset after each line)
globalThis.usePersistanceByDef = true; // Var    :                                  : This controls whether dyn. alloc. vars. are freed at the end of the function. 
globalThis.ownerShipObj = {};          // Object : {startingLine: caller function}  : This holds the function that added the code at a certain line in asm. For debugging segfaults

globalThis.parser = require("./splitter.js"); // parser
globalThis.defines = require("./defines.js"); // variables like types
globalThis.asm = require("./asmHelpers.js");
globalThis.actions = require("./actions.js"); // important functions that translate into assembly
globalThis.mathEngine = require("./mathEngine.js");
globalThis.floatEngine = require("./floatEngine.js");
globalThis.optimiser = require("./optimise.js");

// add ownership. Any function that that data to a file
//throwE(outputCode.data.__proto__)
outputCode.text.push = function(name)
{

    //oso[text length] = current exec offset
    var outGoing = {line: globalInd, caller: (new Error()).stack} //caller: arguments.callee.caller.name || "*unkown caller*"}
    if(ownerShipObj[this.length] == undefined)
    {
        ownerShipObj[this.length] = [outGoing]
    } else {
        ownerShipObj[this.length].push(outGoing)
    }

    Array.prototype.push.call(this, ...arguments)
}

// program entry
start()
function start() {
    //const INPUTFILE = "/Users/squijano/Documents/progLan2/examples/tests/pointers/deref.x"
    const INPUTFILE = "/Users/squijano/Documents/progLan2/examples/tests/formats/nest2.x"
    //const INPUTFILE = "/Users/squijano/Documents/progLan2/examples/tests/formats/nest.x"

    //const INPUTFILE = "/Users/squijano/Documents/progLan2/examples/tests/stackVars/stackVars.x"
    //const INPUTFILE = "/Users/squijano/Documents/progLan2/examples/plans/recursiveSum.x"
    //const INPUTFILE = "/Users/squijano/Documents/progLan2/examples/plans/keep.x"
    //const INPUTFILE = "/Users/squijano/Documents/progLan2/examples/tests/functions/function.x"

    inputCode = String(fs.readFileSync(INPUTFILE));
    //split by semi col and newline, and filter out empty
    inputCode = inputCode.replace(/\n/g, ";").split(";").filter(x => x);

    compileMultiple(inputCode)
    //console.log(inputCode)
        
    actions.done_generateTempLabels();
    var out = parser.parseFinalCode();
    ownerShipObj["offset"] = out.index; // text section offset (must add to each key)
    ownerShipObj["file"] = INPUTFILE;

    fs.writeFileSync(__dirname + "/compiled/out.s", out.out)
    fs.writeFileSync(__dirname + "/compiled/debugInfo.json", JSON.stringify(ownerShipObj))
    console.log("******************** COMPILATION SUCCESSFULL ********************")
    console.log("-- assembly in    '/compiled/out.s'")
    console.log("-- assemble using 'gcc out.s -o out -g -no-pie -m32 -fno-asynchronous-unwind-tables'")

    
    //console.log(ownerShipObj)
}

// Compiles a single line
function compileLine(line) {
    localDynaMemInLine = [];
    var requestMathFlag = false;

    if (line[0] == "while") {
        var lbl = actions.untypedLabel()
        var exit = actions.untypedLabel()
        requestBracketStack = {
            type: "while",
            data: {
                name: lbl, // jump to beginning
                properties: {
                    exit // exit 
                }
            }
        }
        outputCode.text.push(`${lbl}:`)
    }

    var wordNum = line.length - 1
    if (line.includes("//")) {
        wordNum = line.indexOf("//") - 1
    }

    for (; wordNum >= 0; wordNum--) {
        var word = line[wordNum];
        var offsetWord = x => wordNum + x >= 0 ? line[wordNum + x] : null;
        var replaceCurrentWith = x => { line[wordNum] = x; };
        //console.log("------", offsetWord(-1))

        if (word == "DEFINED") {
            userMacros[offsetWord(1)] = offsetWord(-1)
        }
        else if (word == "INCLUDED_ASM") {
            includedAssemblyFiles.push(line.slice(0, line.length - 1).join(""))
            break;
        }
        else if (word == "required") {
            includedAssemblyFiles.push(__dirname + "/libs/" + line.slice(0, line.length - 1).join("") + ".s")
        }
        else if (word == "defualtPersistace")
        {
            if(offsetWord(1) == "true" || offsetWord(1) == "1")
            {
                usePersistanceByDef = true;
            } else {
                usePersistanceByDef = false;
            }
        }
        else if (word == "f") { //float
            var splice_extra = 0;
            if (offsetWord(-2) == ".") {
                if (offsetWord(-4) == "-") {
                    if (!(offsetWord(-5) == "f" || offsetWord(-5) == "]") && parseFloat(offsetWord(-5)) != offsetWord(-5)) {
                        line[wordNum - 3] = "-" + line[wordNum - 3]
                        //line.splice(wordNum - 4, 1)
                        splice_extra = 1
                    }
                }
                line[wordNum - 3 - splice_extra] = doubleToInt(parseFloat(offsetWord(-3) + offsetWord(-2) + offsetWord(-1)))
                line.splice(wordNum - 2 - splice_extra, 3 + splice_extra);
                wordNum -= 3 + splice_extra;
                typeStack.push(defines.types.f32)
                //throwE(line, wordNum)
                continue;
            }
            typeStack.push(defines.types.f32)
        }
        if (word == ":") { //used for naming parameters
            wordNum--;
            continue;
        }
        if (word[0] == '"' && word[word.length - 1] == '"') // string definition
        {
            // get a new label for the string
            var label = actions.stringLiteral(word.substring(1, word.length - 1));
            userVariables[label] = defines.types.p8
            replaceCurrentWith(label);
            typeStack.push(defines.types.p8);
        }
        if (parseFloat(line[wordNum]) == line[wordNum]) // word = number
        {
            // if(typeStack.length < 1 || !typeStack[typeStack.length - 1].float) // not a float
            typeStack.push(defines.types.u32)
            if (offsetWord(-1) == "-") { //negative  and theres not another number beforehand
                if (!(offsetWord(-2) == "f" || offsetWord(-2) == "]") && parseFloat(offsetWord(-2)) != offsetWord(-2)) {
                    line[wordNum] = "-" + line[wordNum]
                    line.splice(wordNum - 1, 1)
                }
            }
        }
        else if (offsetWord(1) == "[") { // setting and loading arrays
            if (word == "<") { //setting
                var base = offsetWord(-1);
                if (localsIncludes(base)) base = asm.formatLocal(base)
                if (Object.keys(variablesOnStack).includes(base)) { // stack var
                    actions.readStackVariable(base)
                }
                var baseType = userVariables[base];
                var index = offsetWord(2);
                var source = offsetWord(5);
                var sourceType = popTypeStack();

                if (index == "new") {
                    actions.listNewItem(base, baseType, source)
                }
                else if (parseFloat(index) == index) { // index is constant
                    outputCode.text.push(
                        `# -- array load begin --`,
                        `mov ${base}, %eax`,
                        `mov ${actions.formatIfConstantOrLiteral(source)}, %ebx`,
                        `mov %ebx, ${index * (baseType.size / 8)}(%eax)`,
                        `# --- array load end ---`
                    )
                }
                else { // index is not constant
                    outputCode.text.push(
                        `# -- array load begin --`,
                        `mov ${index}, %eax`,
                        `mov ${actions.formatIfConstantOrLiteral(source)}, %ecx`,
                        `mov $${baseType.size / 8}, %ebx`,
                        `mul %ebx`,
                        `mov ${base}, %ebx`,
                        `mov %ecx, (%ebx, %eax, 1)`,
                        `# --- array load end ---`
                    )
                }
            } else if (offsetWord(3) == "]") { // reading
                var base = line[wordNum];
                if (localsIncludes(base)) base = asm.formatLocal(base)
                var baseType = userVariables[base];
                var index = offsetWord(2)
                var lbl = actions.requestTempLabel(baseType)
                if (parseFloat(index) == index) { // const
                    outputCode.text.push(
                        `# -- array read begin --`,
                        `mov ${base}, %eax`,
                        `mov ${index * (baseType.size / 8)}(%eax), %ebx`,
                        `mov ${asm.formatRegister("b", baseType)}, ${lbl}`,
                        `# --- array read end ---`
                    )
                } else {
                    outputCode.text.push(
                        `# -- array read begin --`,
                        `mov ${index}, %eax`,
                        `mov $${baseType.size / 8}, %ebx`,
                        `mul %ebx`,
                        `mov ${base}, %ebx`,
                        `mov (%ebx, %eax, 1), %eax`,
                        `mov ${asm.formatRegister("a", baseType)}, ${lbl}`,
                        `# --- array read end ---`
                    )
                }
                line[wordNum] = lbl
                line.splice(wordNum + 1, 3);
                typeStack.push(defines.types.f32) // HERE FEB 10 DELETE IF BROKEN
                //throwE(line)
            }

        }
        else if (word == "$") // address
        {
            var lbl = actions.requestTempLabel(defines.types.u32)
            outputCode.text.push(
                `lea ${offsetWord(1)}, %edx`,
                `mov %edx, ${lbl}`
            )
            line[wordNum] = lbl;
            line.splice(wordNum + 1, 1)
            //throwE(line)

        }
        else if (Object.keys(defines.types).includes(word)) // word = type/method/function/init ALSO FOR POINTERS
        {
            var type = defines.types[word];
            var lbl;
            if (offsetWord(1) == "<") { // cast
                if (!type.special) { // simple type
                    lbl = actions.castSimple(type, offsetWord(2))
                    line[wordNum + 3] = lbl
                    line.splice(wordNum, 3)
                    typeStack.push(userVariables[lbl])
                } else { // special type 
                    var area = captureUntil(line, wordNum + 1, ">")
                    //debugPrint("SPECIAL CAST", word, area)
                    //throwE(defines.types)
                    if (word == "function") { // if function
                        actions.createFunctionNew(offsetWord(-1), area)
                        continue;
                    } else if (word == "initializer") // if constructor
                    {
                        actions.createInitializer(offsetWord(-1), area)

                    } else if (word == "method") {
                        actions.createMethod(offsetWord(-2,), offsetWord(-1), area, popTypeStack())
                    } else { // if format
                        //console.log("---------> ", word, area)
                        var lbl = actions.reserveFormat(word, area)

                        if (lbl == -1) // IF IS INIT.
                        {
                            line[wordNum] = formatReturn(defines.types.u32);

                            line.splice(wordNum + 1, area.length + 2)
                            typeStack.push(defines.types[word])

                            var totSize = 0;
                            formats[word].forEach(x => { totSize += asm.typeToBits(x.type) })
                            var lbl = actions.mallocDynaMemHelper(totSize / 8);
                            outputCode.text.push(
                                `mov ${line[wordNum]}, %eax`,
                                `mov %eax, 0(%esp)`
                            )



                            //wordNum -= 1
                            //throwE("}}}}} NOW AT", line, wordNum)
                        } else {
                            line[wordNum] = lbl
                            line.splice(wordNum + 1, area.length + 2)
                            //console.log("====================>", word, defines.types[word])
                            typeStack.push(defines.types[word])
                        }
                    }
                }
            } else { // type specification, aka unexplicit casting
                if (offsetWord(-1) == "@") // pointer call 
                {
                    var lbl = actions.derefPointer(offsetWord(1), type)
                    line[wordNum - 1] = lbl
                    line.splice(wordNum, 2)
                    //throwE(line)
                } else {
                    // todo: special types
                    line.splice(wordNum, 1)
                    //console.log("~!~~~!~!@!@!~@~~@!~@!~@~", word, defines.types)
                    typeStack.push(type) // push type
                    //console.log("o", line)
                }
            }
        }
        else if (assemblyMacros.includes(word)) // is an existing replacement macro taken from assembly
        {
            line[wordNum] = "$" + word
        }
        else if (Object.keys(userMacros).includes(word)) // is an existing replacement macro 
        {
            line[wordNum] = userMacros[word]
        }
        else if (localsIncludes(word))  // word = local variable
        {
            if (Object.keys(variablesOnStack).includes(asm.formatLocal(word))) { // stack var
                actions.readStackVariable(asm.formatLocal(word))
            }
            line[wordNum] = asm.formatLocal(word)
            typeStack.push(userVariables[asm.formatLocal(word)])
            word = line[wordNum]
        }
        else if (Object.keys(userVariables).includes(word)) // word = global variable
        {
            // throwE(Object.keys(variablesOnStack).includes(word))
            if (Object.keys(variablesOnStack).includes(word)) { // stack var
                actions.readStackVariable(word)
            }
            typeStack.push(userVariables[word])
        }
        else if (word == "(" && (localsIncludes(offsetWord(-1))
            || Object.keys(userFunctions).includes(offsetWord(-1))
            || Object.keys(userVariables).includes(offsetWord(-1))
            || (offsetWord(-2) == "." && methodExists(offsetWord(-1)))
        )) { // function call
            //console.log("----------------", offsetWord(-1))
            var fn = offsetWord(-1)

            var params = captureUntil(line, wordNum, ")")
            if (offsetWord(-2) == ".") { // method
                var className = offsetWord(-3)
                //throwE("calling method", methodExists(fn))

                oldThisType.push(objCopy(userVariables["this"]))
                userVariables["this"] = objCopy(userVariables[className]) // re-type "this"

                var label = actions.requestTempLabel(defines.types.u32)

                var methodInfo = formatMethods[userVariables[className].fmt_name][fn]
                var formatInfo = formats[userVariables[className].fmt_name]

                // var totSize = 0;
                // formatInfo.forEach(x => { totSize += asm.typeToBits(x.type) })
                // outputCode.text.push( // allocate for "this"
                //     `poushl this`,
                //     `poushl \$${totSize / 8}`,
                //     `swap_stack`,
                //     `call __allocate__`,
                //     `swap_stack`,
                //     `mov %eax, this`
                // )
                outputCode.text.push(
                    `mov ${className}, %eax`,
                    `mov %eax, this`
                )

                var lbl = actions.callFunction(asm.formatMethod(fn, methodInfo.name), params, false, methodInfo)
                line[wordNum - 3] = formatReturn(methodInfo.returnType);
                line.splice(wordNum - 2, params.length + 4)
                typeStack.push(methodInfo.returnType)
                wordNum -= 3

                // outputCode.text.push(`popl this`)
                //throwE(line)
            } else {
                var lbl = actions.callFunction(fn, params)
                line[wordNum - 1] = formatReturn(userFunctions[fn].returnType);
                line.splice(wordNum, params.length + 2)
                typeStack.push(userFunctions[fn].returnType)
                wordNum -= 1
                //console.log("}}}}} NOW AT", line, wordNum)
            }
        }
        else if (word == ".") {
            // todo: nested properties like bob.parent.child
            // DELETE IF BROKEN March 12 2023
            if (Object.keys(userVariables).includes(offsetWord(-1)) || localsIncludes(offsetWord(-1))) // for chaining
            {
                var ret = actions.getFormatPropertyNew(offsetWord(-1), line.slice(wordNum), false)
                var lbl = ret.lbl
                var restOfLine = ret.restOfLine
                // TODO March 12 2023: make this function chain the result by passing not just the last one
                line[wordNum - 1] = ret.lbl
                line.splice(wordNum, restOfLine.length * 2)
                //throwE(line)
            }
        }
        else if (word == "<-") { // load something into variable
            var ident = brackStackOffsetFromEnd(1)
            if (ident.type == "format") { // if in format definition
                var pname = offsetWord(-1)
                var ptype = popTypeStack();
                //console.log(`   - format:${ident.data.name} property[${pname}] type{${ptype.size}:${ptype.pointer}}`)
                //console.log(defines.types.Price.templatePtr)
                ident.data.properties.push({ name: pname, type: ptype })
                break;
            }
            if (offsetWord(-2) == '.') { // if setting format

                var ret = actions.getFormatPropertyNew(line[0], line.slice(1), true)
                //throwE(ret)
                var ptr = ret.lbl
                //var ptr = actions.getFormatProperty(offsetWord(-3), offsetWord(-1), true);
                outputCode.text.push("######")
                actions.twoStepLoadIntoAddr(bracketStack.length == 0 ? outputCode.init : outputCode.text, ptr, offsetWord(1), popTypeStack())
                outputCode.text.push("######")
                break;
            }

            if (Object.keys(variablesOnStack).includes(formatIfLocal(offsetWord(-1)))) {
                //throwE()
                actions.loadStackVariable(formatIfLocal(offsetWord(-1)), popTypeStack(), offsetWord(1))
                break;
            }



            // todo: rewrite this ifelse below to use formatIfLocal
            if (Object.keys(userVariables).includes(offsetWord(-1))) // already defined variables
            {
                actions.loadVariable(offsetWord(-1), popTypeStack(), offsetWord(1))
            } else if (localsIncludes(offsetWord(-1))) // alredy defined local
            {
                var dest = asm.formatLocal(offsetWord(-1));
                actions.loadVariable(dest, popTypeStack(), offsetWord(1))
            }
            else { // new variables
                var type = popTypeStack()
                var nextWord = offsetWord(1);
                // if (parseFloat(offsetWord(-2)) == offsetWord(-2)) {
                //     // TODO IF ARRAY
                // }

                if (offsetWord(-2) == "_stack_") {
                    //throwE(line)
                    actions.createStackVariable(offsetWord(-1), type, nextWord)
                } else {
                    //throwE(line)
                    actions.createVariable(offsetWord(-1), type, nextWord)
                }
            }
            break;
        }
        else if (word == "return") {
            actions.twoStepLoadAuto(outputCode.text, formatReturn(inscope.returnType), offsetWord(1), popTypeStack(), inscope.returnType)
            actions.clearStackVariables(true)
            outputCode.text.push("swap_stack", "ret") // HERE IF BROKEN REMOVE
        }
        else if (word == "{") {
            if (requestBracketStack == 0) { // array init 
                //console.log("--Treating array initiation--")
                var area = captureUntil(line, wordNum, "}").filter(x => x != ",");

                var isList = offsetWord(-1) == "inf"; // is a list as opposed to an array

                var areaObj = [];
                area.forEach(x => {
                    areaObj.push({ value: x, type: popTypeStack() });
                })
                //console.log("--Gathered: ", areaObj, "--")
                if (areaObj.length == 0) {
                    line[wordNum] = "$0"
                    typeStack.push(defines.types.dp32)
                    lastArrInfo = { size: 0, isList };
                }
                else {
                    line[wordNum] = actions.allocateArrayWithContents(areaObj, bracketStack.length == 0, isList)
                }
                line.splice(wordNum + 1, area.length * 2) // replace with label and remove 2xlength for commas
                //throwW(line, isList)
                if (isList) {
                    line.splice(wordNum - 1, 1);
                    wordNum--;
                }
                //throwE(line)
                //throwE(line)
            }
            var data = requestBracketStack.data
            if (requestBracketStack.type == "function") {
                bracketStack.push(objCopy(requestBracketStack))
                inscope = userFunctions[data.name]
            } else if (requestBracketStack.type == "format") {
                bracketStack.push(objCopy(requestBracketStack))
            } else if (requestBracketStack.type == "if") {
                bracketStack.push(objCopy(requestBracketStack))
            } else if (requestBracketStack.type == "while") {
                bracketStack.push(objCopy(requestBracketStack))
            } else if (requestBracketStack.type == "initializer") {
                // already in dec
                bracketStack.push(objCopy(requestBracketStack))

                oldThisType.push(objCopy(userVariables["this"]))
                userVariables["this"] = defines.types[data.name] // re-type "this"
                inscope = userInits[data.name] // enter scope of init.

                //console.log("=+=======+= STACK RESET initializer")
                //currentStackOffset = 0
                // NOTE, MODELNUMBER NOT BEING TAKEN AS LOCAL!!! SEE ASM
                //var label = actions.requestTempLabel(defines.types.u32)

                var totSize = 0;
                formats[data.name].forEach(x => { totSize += asm.typeToBits(x.type) })

                actions.mallocSize(totSize / 8, true); // allocate for "this". "true" tells it to not free

                outputCode.text.push("push %eax");
                actions.allocateExistingStackVarNoPush("this")

                //throwE(outputCode.text)
            } else if (requestBracketStack.type == "method") {
                // TODO consolidate this into function so that we dont have repeated code for the initializer
                bracketStack.push(objCopy(requestBracketStack))
                inscope = formatMethods[data.struct_name][data.name]
                //console.log("=+=======+= STACK RESET method")
                //currentStackOffset = 0;
                inscope.name = data.struct_name
                outputCode.text.push(
                    `pushl this`
                )
                actions.allocateExistingStackVarNoPush("this")
            }
            requestBracketStack = 0;
        }
        else if (word == "}") {
            if (line.slice(0, wordNum).includes("{")) {
                continue
            }
            if (bracketStack.length == 0) {
                throwE("Unopened bracket")
            }
            //throwE(line, bracketStack)
            var data = bracketStack.pop();
            if (data.type == "function") {
                var fnInfo = userFunctions[data.data.name]

                actions.clearAllLocalData();

                outputCode.text.push(
                    "swap_stack",
                    "ret")
                inscope = 0;
            }
            else if (data.type == "format") {
                var _name = data.data.name
                var properties = data.data.properties

                debugPrint("CLOSING FORMAT DEFINITION", properties.map(x => x.type.templatePtr))
                formats[_name] = objCopy(properties);
                formatMethods[_name] = {};
                var fmt = objCopy(defines.types.___format_template___);
                fmt.templatePtr = formats[_name];
                fmt.fmt_name = _name
                defines.types[_name] = fmt; // push fmt as new type
                debugPrint(_name, defines.types[_name])
            }
            else if (data.type == "if") {
                var properties = data.data.properties
                outputCode.text.push(
                    `jmp ${data.data.name}`, // final termination
                    `${properties.localExit}:`
                )
                var preview = previewNextLine()
                if (!(preview[0] == "else" || preview[0] == "elif")) // fully escape block since we are done with all elif/else
                {
                    outputCode.text.push(
                        `${data.data.name}:`
                    )
                    mostRecentIfStatement.pop()
                }
            }
            else if (data.type == "while") {
                outputCode.text.push(
                    `jmp ${data.data.name}`,
                    `${data.data.properties.exit}:` // exit loop
                )
            }
            else if (data.type == "initializer") {

                actions.readStackVariable("this")
                outputCode.text.push(
                    `mov this, %eax`,
                    `mov %eax, __return_32__`
                )

                actions.clearAllLocalData();

                outputCode.text.push(
                    "swap_stack",
                    "ret")
                userVariables["This"] = oldThisType.pop()
                inscope = 0;
            }
            else if (data.type == "method") {
                actions.clearAllLocalData();
                outputCode.text.push("swap_stack", "ret")
                inscope = 0;
            }
        }
        else if (word == "format") {
            debugPrint("CREATING FORMATTER", offsetWord(-1))
            var _name = offsetWord(-1)
            requestBracketStack = {
                type: "format",
                data: {
                    name: _name,
                    properties: []
                }
            }
            break;
        }
        else if (word == "if") {
            var localExit = actions.untypedLabel() // jump out of this if, but not out of whole block
            outputCode.text.push(
                `cmpb $1, ${offsetWord(2)}`, // checks if value = 1
                `jne ${localExit}`
            )
            requestBracketStack = {
                type: "if",
                data: {
                    name: actions.untypedLabel(), // final termination
                    properties: {
                        localExit
                    }
                }
            }
            mostRecentIfStatement.push(objCopy(requestBracketStack))
        }
        else if (word == "elif") {
            var localExit = actions.untypedLabel()// jump out of this if, but not out of whole block
            outputCode.text.push(
                `cmpb $1, ${offsetWord(2)}`, // checks if value = 1
                `jne ${localExit}`
            )
            requestBracketStack = mostRecentIfStatement.pop() // copy final termination
            mostRecentIfStatement.push(objCopy(requestBracketStack))
            requestBracketStack.data.properties.localExit = localExit // new local exit
        }
        else if (word == "else") {
            var localExit = actions.untypedLabel()
            requestBracketStack = mostRecentIfStatement.pop()
            mostRecentIfStatement.push(objCopy(requestBracketStack))
            requestBracketStack.data.properties.localExit = localExit
        }
        else if (word == "while") {
            outputCode.text.push(
                `cmpb $1, ${offsetWord(2)}`,
                `jne ${requestBracketStack.data.properties.exit}` // jump out if not equal
            )
        }
        else if (word == "#") { // delete after fixing mather
            requestMathFlag = true;
            requestMathType = "int";
        }
        else if (word == "#f") { // delete after fixing mather
            requestMathFlag = true;
            requestMathType = "float";
        }
        else if (word == "INTERNALputstringTEST") {
            var offset = line.indexOf("NEXT")
            outputCode.text.push(
                `pushl ${offsetWord(1)}`,
                `pushl \$${line[offset + 1]}`,
                `swap_stack`,
                `call put_string`,
                `swap_stack`
            )
        }
        if (defines.compares.includes(offsetWord(1))) // comparison statement
        {

            var tleft = popTypeStack()
            var tright = popTypeStack()

            //throwE(left,right, word, line)

            var left = actions.formatIfConstantOrLiteral(word)
            var right = actions.formatIfConstantOrLiteral(offsetWord(2))

            if (!actions.objectCompare(tleft, tright)) {
                throwW(`[COMPILER] comparing unequal types: `, tleft, " and ", tright)
            }

            if (tleft.pointer == true || right.pointer == true) {
                // todo compare contents of pointer
            }
            else if (tleft.templatePtr != undefined || tright.templatePtr != undefined) {
                // todo compare structures
            }
            else {
                var fmtl = asm.formatRegister("a", tleft)
                var fmtr = asm.formatRegister("b", tright)
                var lbl = actions.requestTempLabel(defines.types.u8)
                outputCode.text.push(
                    `mov $0, %cl`,
                    `xor %eax, %eax; xor %ebx, %ebx`,
                    `mov ${left}, ${fmtl}`,
                    `mov ${right}, ${fmtr}`,
                    `cmp ${fmtr}, ${fmtl}`,
                    `${defines.condSet[offsetWord(1)]} %cl`,
                    `mov %cl, ${lbl}`
                )
                line[wordNum] = lbl
                line.splice(wordNum + 1, 2)
            }
        }

        // --------
        if (requestMathFlag) {
            line.splice(wordNum, 1); // deleter after fixing math 
            //throwE(line, wordNum)
            //console.log("~|||||~~|~|~|~|~|~|~||~|~|~|~|~~~~~LINE", line, wordNum, asm.formatLocal(word), userVariables)
            //console.log()
            var addr = wordNum;
            var build = [line[addr++]];
            var toggle = true;
            outputCode.text.push("# --- math begin ---")
            while ((addr < line.length) && (toggle ? defines.mathOps.includes(line[addr]) : true)) {
                build.push(line[addr]);
                toggle = !toggle;
                addr += 1;
            }
            var ret = requestMathType == "float" ? floatEngine(build) : mathEngine(build)
            line[wordNum] = ret
            line.splice(wordNum + 1, build.length - 1)
            //throwE(userFunctions)
            requestMathFlag = false;
            wordNum++
            outputCode.text.push("# --- math end ---")
            //throwE(line)
        }

        // else if (defines.mathOps.includes(word)) { // math
        //     if (!defines.mathOps.includes(offsetWord(-2))) { // make we are the first use
        //         requestMathFlag = true;
        //         continue;
        //     }
        // }
    }
    //console.log(" 2) MODIFIED:", line.join(" "));
}

function previewNextLine() {
    return parser.split(inputCode[globalInd + 1])
}

function compileMultiple(lines) {
    inputCode.forEach((x, ind) => {
        if(x == "") return
        globalInd = ind
        x = parser.split(x)
        console.log("1) COMPILING:", x.join(" "))

        var forceP = false
        if (x.includes("persistent")) {
            forceP = true;
            x.splice(x.indexOf("persistent"), 1);
        } else if (x.includes("transient")) {
            forceP = true;
            x.splice(x.indexOf("transient"), 1);
        }
        
        compileLine(x)

        if(forceP) {
        localDynaMemInLine.forEach(n => {
            n.persistent = !usePersistanceByDef;
        })
        debugPrint("SETTING PERSISTENTS", localDynaMem)
    }

        Object.entries(actions.currentLabels).forEach(x => {
            var key = x[0]
            var val = x[1]
            if (val > actions.maxLabels[key]) {
                actions.maxLabels[key] = val
            }
            actions.currentLabels[key] = 0;
        })
    }
    )
    //optimiser(outputCode.text);
    //console.log(outputCode.text)
}

function brackStackOffsetFromEnd(off = 1) {
    if (bracketStack.length < off) return { type: "NONE", data: {} };
    return bracketStack[bracketStack.length - off];
}

function formatReturn(type) {
    if (type.float)
        return `__return_flt__`
    if (type.templatePtr == undefined)
        return `__return_${asm.typeToBits(type)}__`
    return `__return_32__`
}



function localsIncludes(word) {
    //console.log("######$$$$$$%%%%!~~~~~~", Object.keys(userVariables).includes(asm.formatLocal(word)), inscope)
    return ((inscope != 0) && Object.keys(userVariables).includes(asm.formatLocal(word)))
}

function formatIfLocal(word) {
    if (localsIncludes(word))
        return asm.formatLocal(word);
    return word
}

function captureUntil(arr, offset, char) {
    var build = []
    offset++;
    while (arr[offset] != char) {
        if (offset > arr.length)
            throwE(`[COMPILER] Unable to find character ${char} in line ${arr.join(" ")}`)
        build.push(arr[offset++])
    }
    return build
}