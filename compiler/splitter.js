// Parser

var symbols = "!@#$%^&*()+{}|:<>?,./;'[]\-=' "

// list of all exceptions that trigger no splitting
var types = require("./defines.js")

var noExes = [
    "<-",
    "->",
    "/*",
    "//",
    "*/",
    "#f",
];
noExes.push(...Object.keys(types.types),...types.compares) // laod all types into exceptions

var quoteMarks = [
    `"`,
    `'`,
    `\``
]

// computes the sum of the outputs of a function expecting an offset
// ex. returns char + nextChar + secNextChar
function cascade(amount, fn, start = "") {
    sum = start;
    for (var i = 0; i < amount; i++) {
        sum += fn(i)
    }
    return sum;
}

function split(line) {
    var len = line.length;
    var build = "";
    var outBuffer = [];
    var inquotes = "";

    var mode = line[0] == parseInt(line[0]); // mode 1 if numbers 0 if letters

    for (var charNum = 0; charNum < len; charNum++) {
        var prevChar = line[charNum - 1];
        var char = line[charNum];
        var nextChar = line[charNum + 1];
        var secNextChar = line[charNum + 2];
        var charOffset = x => String(line[charNum + x]);

        // false if there is an exception (dont split)

        if(inquotes != "" && !quoteMarks.includes(char)) {
            build += char;
            continue;
        }

        var noExe = noExes.every(x => {
            // if length = 2, then sum up the current and the next
            // if length = 3, current + next + second next
            if (cascade(x.length, charOffset) == x) {
                if (build != "")
                    outBuffer.push(build) // push current
                outBuffer.push(x) // push sequence
                build = "" // clear current
                charNum += x.length - 1; //offset by length of sequence
                return false;
            }
            return true
        })
        if (!noExe) continue; // there was a resevered sequence, dont split and skip

        if (symbols.includes(char)) { // splitting character
            if (build != "")
                outBuffer.push(build); // push current
            if(char != " ")
                outBuffer.push(char);
            build = ""; // clear buffer
        } else if(quoteMarks.includes(char)) { // enter special non-splitting mode in quotes
            if(inquotes == char) { // are exiting quotes
                outBuffer.push(build + char);
                build = ""
                inquotes = "";
            } else if(inquotes == "") { // are entering quotes
                build += char;
                inquotes = char;
            }
        } else if ((char == parseInt(char)) != mode) { // if we are going from numbers to letters or vice versa
            if(build != "") 
                outBuffer.push(build);
            mode = !mode;
            build = char;
        } else {
            build += char; // build current char
        }
    }
    if(build != "") outBuffer.push(build); // use end of string as splitter to 

    if(inquotes != "") {
        parser_error("[PARSER ERROR] Missing end-quote: " + line)
        process.exit(1)
    }
    return outBuffer;
}

function parseFinalCode()
{
    //console.log(outputCode)
    var out = 
`
.1byte = .byte

# crucial libs
.include "${__dirname}/assembly_libs/init.s"
.include "${__dirname}/assembly_libs/io.s"
.include "${__dirname}/assembly_libs/memory.s"
.include "${__dirname}/assembly_libs/cmp.s"

# additional libs
`
    + includedAssemblyFiles.map(x=> `.include "${x}"`).join("\n") + 
`

.data
__fpu_temp__: .4byte 0
######## user data section ########
`
    + outputCode.data.join("\n") + 
`
###################################
.text

.global main
.global user_init

user_init:
#### compiler initation section ###
push $16
swap_stack
call __allocate__
swap_stack
`
    + outputCode.init.join("\n") + 
`
###################################
ret

main:
    jmp PL__read_args__
    PL__read_args_fin__:
    call init_stacks
    //swap_stack
    call entry
    ret
`

var index = out.split("\n").length
out += outputCode.text.join("\n") + "\n"
    return {out,index}
}

function addReserved(x)
{
    noExes.push(x)
}

module.exports = {split, addReserved, parseFinalCode, symbols, noExes}