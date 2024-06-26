const { exec } = require("child_process");
const fs = require("fs");

var execFileLikeTrue;
var execFile;
var pathStr = `gdb -ex run -ex 'quit' --args ${__dirname + '/compiled/out'}`
// USE -ex where 
function getTrueLine(execFileLikeTrue, execFile, line)
{
    var trueLine = 0;
    var fmtLine = 0;
    while(fmtLine < line)
    {
        if(execFileLikeTrue[trueLine] == "")
        {
            trueLine++;
        }
        trueLine++;
        fmtLine++;
    }
    return trueLine;
}

function output(e, out, ste) {
    if (e) {
        console.log(`error: ${e.message}`);
        return;
    }
    if (ste) {
        console.log(`stderr: ${ste}`);
        return;
    }
    out = out.toString();
    var index = out.indexOf("at out.s:")
    if(index == -1)
    {
        if(out.includes("SIGSEGV"))
        {
            console.log("\033[31mLIBC segfault, unable to trace back to HAM. Checking c-functions like scanf or printf\033[0m")
            exec(`gdb -ex run -ex where -ex 'quit' --args ${__dirname + '/compiled/out'}`, (a,b,c) => {
                b = b.substring(b.indexOf("SIGSEGV")).split('\n')
                console.log(b.filter(x => (/#\d/g).test(x) && !(/(lib32\/libc)|(\?\?)/g).test(x)).join("\n"))
            })
        } else {
            console.log("no segfault")
        }
        return
    }

    var data = JSON.parse(fs.readFileSync(__dirname + "/compiled/debugInfo.json"))
    var fsout = String(fs.readFileSync(data.file));
    
    execFileLikeTrue = fsout.split("\n")
    execFile = fsout.replace(/\n/g, ";").split(";").filter(x => x);

    var noOffset = parseInt(out.slice(index).split("\n")[1].split("\t")[0]) // line of fault in assembly (1 index)
    var offset = noOffset - data.offset                                     // line of fault in text section
    
    while(data[offset] == undefined)
    {
        offset--;
    }
    var info = data[offset];
    
    info.forEach(x => {
        var trueLine = getTrueLine(execFileLikeTrue, execFile, x.line)
        console.log("-- Compiler call stack: \033[32m\n" + x.caller.split("\n").slice(2).join("\n") + "\033[0m");

        console.log("\033[31m" + `Program faulted in file ${data.file}\n\t - line     ${trueLine + 1}\n\t - assembly ${noOffset}` + "\033[0m");
        console.log("\033[93m" + "=".repeat(process.stdout.columns) + "\033[0m")
        drawColLine(trueLine - 1)
        drawColLine(trueLine)
        drawColLine(trueLine + 1, true)
        drawColLine(trueLine + 2)
        console.log("\033[93m" + "=".repeat(process.stdout.columns) + "\033[0m")
    })

}

function drawColLine(l, isError = false)
{
    if(l - 1 < 0 || l - 1 > execFileLikeTrue.length - 1) return 
    console.log("\033[93m" + String(l).padEnd(4) + "\033[0m: ", execFileLikeTrue[l - 1], isError? "\033[33m<<HERE\033[0m" : "")
}

exec(pathStr, output);