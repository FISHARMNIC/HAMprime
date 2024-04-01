const { exec } = require("child_process");
const fs = require("fs");

var execFileLikeTrue;
var execFile;

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
        console.log("no segfault")
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

        console.log("\033[31mProgram faulted at assembly line: " + (trueLine + 1) + "\033[0m");
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

exec(`gdb -ex run -ex 'quit' --args ${__dirname + '/compiled/out'}`, output);