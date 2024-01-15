/* TODO: 
- [NEW] Add floats
- [NEW] Add arrays
- [NEW] Add comments
- [NEW] Add class methods
- [NEW] Add polymorphism
- [NEW] Add pointers
- [NEW] Improve string handling QOL
- [NEW] Support nested formats
- [NEW] Add declaring buffer just by giving length

- [HIGH] fix /Users/squijano/Documents/progLan2/examples/tests/flow/factorial.x
- [HIGH] Temporarily made math require "#" beforehand, fix this. Originally, math will not work on something like "bob.length * jon" as it will see "length * jon"
- [HIGH] FOR SOME REASON THERE IS A CIRCULAR ARRAY, AT SOME POINT, THE PRICE FMT IS BEING MODIFIED? (nest.x)
- [HIGH] Add local variables by making setter and getter functions for accessing user variables that does it automatically

- [LOW] MAKE REQUEST BRACKET STACK AN ARR, SO EVEN MORE NESTING? (most likely not needed)
- [LOW] Fix temp labels creating more than needed, use same system for HAM where each line the counter resets
- [LOW] For IF statements, instead of checking if the value is 1, make sure greater than zero. This makes it so that you can have for example if(bob) where bob is any nonzero number
- [LOW] Possible error, make sure that u8 and u16 are being passed correctly to stack when calling function. Must be fully cast to u32
- [LOW] Maybe change it so that instead having to realloc "this" for each method and init, just have one "this" var dedicated to each format?
- [LOW] Should I be closing inscope upon "}"? Look at elif for function not setting inscope to null
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
globalThis.formats = {};
globalThis.formatMethods = {};
globalThis.userVariables = {};
globalThis.oldThisType = [];
globalThis.requestBracketStack = 0; // used for anything that needs a bracket on the next line
globalThis.bracketStack = [];
globalThis.typeStack = [];
globalThis.inscope = 0;
globalThis.freedData = []; // any data that has been deleted
globalThis.mostRecentIfStatement = [] // for elif
globalThis.objCopy = function (x) {
    return JSON.parse(JSON.stringify(x))
}

globalThis.globalInd = 0

globalThis.throwE = function (x) {
    console.log(`[ERROR] @ line ${globalInd}: `, ...arguments)
    console.trace()
    console.log("\n\n================== THIS WAS NOT A JS ERROR, THIS WAS THROWE ==================\n\n")
    process.exit(1)
}

globalThis.throwW = function (x) {
    console.log(`[WARNING] @ line ${globalInd}: `, ...arguments)
}
globalThis.popTypeStack = function () {
    if (typeStack.length == 0) {
        throwE("[COMPILER] Missing expected type")
    }
    return typeStack.pop()
}

globalThis.methodExists = function (n) {
    return Object.values(formatMethods).map(x => Object.keys(x)).flat().includes(n)
}

globalThis.parser = require("./splitter.js"); // parser
globalThis.defines = require("./defines.js"); // variables like types
globalThis.asm = require("./asmHelpers.js");
globalThis.actions = require("./actions.js"); // important functions that translate into assembly
globalThis.mathEngine = require("./mathEngine.js");

globalThis.userFunctions = {
    "put_string": {
        name: 'put_string',
        parameters: [],
        returnType: defines.types.u32
    },
    "put_int": {
        name: 'put_int',
        parameters: [],
        returnType: defines.types.u32
    },
    "puts": {
        name: 'puts',
        parameters: [],
        returnType: defines.types.u32
    },
    "printf_mini": {
        name: 'printf_mini',
        parameters: [],
        returnType: defines.types.u32
    }
};

globalThis.userInits = {}

userVariables = {
    __return_8__: defines.types.i8,
    __return_16__: defines.types.i16,
    __return_32__: defines.types.i32,
    "this": defines.types.u32,
}

start()

function start() {
    const INPUTFILE = "/Users/squijano/Documents/progLan2/examples/tests/flow/factorial.x"
    inputCode = String(fs.readFileSync(INPUTFILE));
    //split by semi col and newline, and filter out empty
    inputCode = inputCode.replace(/\n/g, ";").split(";").filter(x => x);
    compileMultiple(inputCode)
}

// Compiles a single line
function compileLine(line) {
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
        if (word == ":") { //used for naming parameters
            wordNum--
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
        if (parseInt(line[wordNum]) == line[wordNum]) // word = number
        {
            typeStack.push(defines.types.u32)
            if (offsetWord(-1) == "-" && (parseInt(offsetWord(-2)) != offsetWord(-2)) && offsetWord(-2) != "]") { //negative  and theres not another number beforehand
                line[wordNum] = "-" + line[wordNum]
                line.splice(wordNum - 1, 1)
            }
        }
        else if (offsetWord(1) == "[") { // setting and loading arrays
            if (word == "<") { //setting
                var base = offsetWord(-1);
                if(localsIncludes(base)) base = asm.formatLocal(base)
                var baseType = userVariables[base];
                var index = offsetWord(2);
                var source = offsetWord(5);
                var sourceType = popTypeStack();


                if (parseInt(index) == index) { // index is constant
                    outputCode.text.push(
                        `# -- array load begin --`,
                        `mov ${base}, %eax`,
                        `mov ${actions.formatIfConstantOrLiteral(source)}, %ebx`,
                        `mov %ebx, ${index * (baseType.size / 8)}(%eax)`,
                        `# --- array load end ---`
                    )
                } else { // index is not constant
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
                if(localsIncludes(base)) base = asm.formatLocal(base)
                var baseType = userVariables[base];
                var index = offsetWord(2)
                var lbl = actions.requestTempLabel(baseType)
                if (parseInt(index) == index) {
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
                //throwE(line)
            }

        }
        else if (Object.keys(defines.types).includes(word)) // word = existing type
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
                    console.log("SPECIAL CAST", word, area)
                    if (word == "function") { // if function
                        actions.createFunction(offsetWord(-1), area)
                        continue;
                    } else if (word == "initializer") // if constructor
                    {
                        actions.createInitializer(offsetWord(-1), area)

                    } else if (word == "method") {
                        actions.createMethod(offsetWord(-2,), offsetWord(-1), area, popTypeStack())
                    } else { // if format
                        console.log("---------> ", word, area)
                        var lbl = actions.reserveFormat(word, area)

                        if (lbl == -1) // initializer
                        {
                            line[wordNum] = formatReturn(defines.types.u32);

                            line.splice(wordNum + 1, area.length + 2)
                            typeStack.push(defines.types[word])

                            //wordNum -= 1
                            //throwE("}}}}} NOW AT", line, wordNum)
                        } else {
                            line[wordNum] = lbl
                            line.splice(wordNum + 1, area.length + 2)
                            console.log("====================>", word, defines.types[word])
                            typeStack.push(defines.types[word])
                        }
                    }
                }
            } else { // type specification, aka unexplicit casting
                // todo: special types
                line.splice(wordNum, 1)
                //console.log("~!~~~!~!@!@!~@~~@!~@!~@~", word, defines.types)
                typeStack.push(type) // push type
                //console.log("o", line)
            }
        }
        else if (localsIncludes(word))  // word = local variable
        {

            line[wordNum] = asm.formatLocal(word)
            //throwW(line)
            typeStack.push(userVariables[asm.formatLocal(word)])
            word = line[wordNum]
        }
        else if (Object.keys(userVariables).includes(word)) // word = global variable
        {
            typeStack.push(userVariables[word])
        }
        else if (word == "(" && (localsIncludes(offsetWord(-1))
            || Object.keys(userFunctions).includes(offsetWord(-1))
            || Object.keys(userVariables).includes(offsetWord(-1))
            || (offsetWord(-2) == "." && methodExists(offsetWord(-1)))
        )) { // function call
            console.log("----------------", offsetWord(-1))
            var fn = offsetWord(-1)

            var params = captureUntil(line, wordNum, ")")
            if (offsetWord(-2) == ".") {
                var className = offsetWord(-3)
                //throwE("calling method", methodExists(fn))

                oldThisType.push(objCopy(userVariables["this"]))
                userVariables["this"] = userVariables[className] // re-type "this"

                var label = actions.requestTempLabel(defines.types.u32)

                var methodInfo = formatMethods[userVariables[className].fmt_name][fn]
                var formatInfo = formats[userVariables[className].fmt_name]

                // var totSize = 0;
                // formatInfo.forEach(x => { totSize += asm.typeToBits(x.type) })
                // outputCode.text.push( // allocate for "this"
                //     `pushl this`,
                //     `pushl \$${totSize / 8}`,
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
                console.log("}}}}} NOW AT", line, wordNum)
            }
        }
        else if (word == ".") {
            // todo: nested properties like bob.parent.child
            var ret = actions.getFormatProperty(offsetWord(-1), offsetWord(1))
            line[wordNum - 1] = ret
            line.splice(wordNum, 2)
        }
        else if (word == "<-" || word == "=") { // load something into variable // HERE NOV 23 DELETE IF BROKEN
            var ident = brackStackOffsetFromEnd(1)
            if (ident.type == "format") { // if in format definition
                var pname = offsetWord(-1)
                var ptype = popTypeStack();
                console.log(`   - format:${ident.data.name} property[${pname}] type{${ptype.size}:${ptype.pointer}}`)
                //console.log(defines.types.Price.templatePtr)
                ident.data.properties.push({ name: pname, type: ptype })
                break;
            }
            if (offsetWord(-2) == '.') { // if setting format
                var ptr = actions.getFormatProperty(offsetWord(-3), offsetWord(-1), true);
                outputCode.text.push("######")
                actions.twoStepLoadIntoAddr(bracketStack.length == 0 ? outputCode.init : outputCode.text, ptr, offsetWord(1), popTypeStack())
                outputCode.text.push("######")
                break;
            }
            // todo: if brackets, do array, etc

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

                // if (parseInt(offsetWord(-2)) == offsetWord(-2)) {
                //     // TODO IF ARRAY
                // }

                actions.createVariable(offsetWord(-1), type, nextWord)
            }
            break;
        }
        else if (word == "return") {
            //throwE("bob", inscope)
            actions.twoStepLoadAuto(outputCode.text, formatReturn(inscope.returnType), offsetWord(1), popTypeStack(), inscope.returnType)
            outputCode.text.push("swap_stack", "ret") // HERE IF BROKEN REMOVE
        }
        else if (word == "{") {
            if (requestBracketStack == 0) {
                console.log("--Treating array initiation--")
                var area = captureUntil(line, wordNum, "}").filter(x => x != ",");
                var areaObj = [];
                area.forEach(x => {
                    areaObj.push({ value: x, type: popTypeStack() });
                })
                //console.log("--Gathered: ", areaObj, "--")
                line[wordNum] = actions.allocateArrayWithContents(areaObj, bracketStack.length == 0)
                line.splice(wordNum + 1, area.length * 2) // replace with label and remove 2xlength for commas
                //throwE(line, bracketStack)
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
                bracketStack.push(objCopy(requestBracketStack))

                oldThisType.push(objCopy(userVariables["this"]))
                userVariables["this"] = defines.types[data.name] // re-type "this"
                inscope = userInits[data.name]
                // NOTE, MODELNUMBER NOT BEING TAKEN AS LOCAL!!! SEE ASM
                var label = actions.requestTempLabel(defines.types.u32)
                var totSize = 0;

                formats[data.name].forEach(x => { totSize += asm.typeToBits(x.type) })

                outputCode.text.push( // allocate for "this"
                    `pushl this`,
                    `pushl \$${totSize / 8}`,
                    `swap_stack`,
                    `call __allocate__`,
                    `swap_stack`,
                    `mov %eax, this`
                )
                //throwE(outputCode.text)
            } else if (requestBracketStack.type == "method") {
                // TODO consolidate this into function so that we dont have repeated code for the initializer
                bracketStack.push(objCopy(requestBracketStack))
                inscope = formatMethods[data.struct_name][data.name]
                inscope.name = data.struct_name
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
                outputCode.text.push("swap_stack", "ret")
            }
            else if (data.type == "format") {
                var _name = data.data.name
                var properties = data.data.properties

                console.log("CLOSING FORMAT DEFINITION", properties)
                formats[_name] = properties;
                formatMethods[_name] = {};
                var fmt = defines.types.___format_template___;
                fmt.templatePtr = formats[_name];
                fmt.fmt_name = _name
                defines.types[_name] = fmt; // push fmt as new type
                console.log("***********************>", _name, defines.types[_name])
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
                outputCode.text.push(
                    "mov this, %edx",
                    "mov %edx, __return_32__",
                    "popl this",
                    "swap_stack",
                    "ret")
                userVariables["This"] = oldThisType.pop()
            }
            else if (data.type == "method") {
                outputCode.text.push("swap_stack", "ret")
            }
        }
        else if (word == "format") {
            console.log("CREATING FORMATTER", offsetWord(-1))
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
        // else if (defines.mathOps.includes(word)) { // math
        //     if (!defines.mathOps.includes(offsetWord(-2))) { // make we are the first use
        //         requestMathFlag = true;
        //         continue;
        //     }
        // }
        else if (word == "#") { // delete after fixing mather
            requestMathFlag = true;
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


            if (tleft != tright) {
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
            while ((addr < line.length) && (toggle ? defines.mathOps.includes(line[addr]) : true)) {
                build.push(line[addr]);
                toggle = !toggle;
                addr += 1;
            }
            var ret = mathEngine(build)
            line[wordNum] = ret
            line.splice(wordNum + 1, build.length - 1)
            //throwE(userFunctions)
            requestMathFlag = false;
            wordNum++
            //throwE(line)
        }

    }
    console.log("2) MODIFIED:", line.join(" "));
}

function previewNextLine() {
    return parser.split(inputCode[globalInd + 1])
}
function compileMultiple(lines) {
    inputCode.forEach((x, ind) => {
        globalInd = ind
        x = parser.split(x)
        console.log("1) COMPILING:", x.join(" "))
        compileLine(x)
    }
    )
    actions.done_generateTempLabels();
    fs.writeFileSync(__dirname + "/compiled/out.s", parser.parseFinalCode())
}

function brackStackOffsetFromEnd(off = 1) {
    if (bracketStack.length < off) return { type: "NONE", data: {} };
    return bracketStack[bracketStack.length - off];
}

function formatReturn(type) {
    if (type.templatePtr == undefined)
        return `__return_${asm.typeToBits(type)}__`
    return `__return_32__`
}



function localsIncludes(word) {
    //console.log("######$$$$$$%%%%!~~~~~~", Object.keys(userVariables).includes(asm.formatLocal(word)), inscope)
    return ((inscope != 0) && Object.keys(userVariables).includes(asm.formatLocal(word)))
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