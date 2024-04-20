const REMOVE = 1

basicOpsNoMove = ["add", "sub", "mul", "div", "shr", "shl"];
basicOps = [...basicOpsNoMove, "mov"];

// also do x2 shl
function isSingle(line, single)
{
    return line.slice(0, single.length) == single
}

function anyOf(line, arr, add) {
    return arr.some(x => {
        var concat = x + add;
        //if(line.includes("%esp")) console.log(line.slice(0, concat.length), concat)
        return line.slice(0, concat.length) == concat
    })
}

function single(line) {
    // remove comments
    if (line.indexOf("#") != -1)
        line.slice(line.indexOf("#"))
    if (line.indexOf("//") != -1)
        line.slice(line.indexOf("//"))

    
    if (anyOf(line, basicOpsNoMove, " $0,")) {
        return REMOVE
    } else if(anyOf(line, basicOps, " 0("))
    {
        return line.replace("0(", "(")
    }

    return false
}

module.exports = function (lines) {
    for (var lineNum = 0; lineNum < lines.length; lineNum++) {
        var offsetLine = x => lineNum + x >= 0 ? lines[lineNum + x] : null;
        var outcome = single(offsetLine(0));
        if (outcome == REMOVE) {
            lines.splice(lineNum, 1);
            //console.log("YES")
            lineNum--;
            continue;
        } else if(outcome != false) {
            //console.log(outcome)
            lines[lineNum] = outcome
        }
    }
    
}