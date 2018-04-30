/*

peek() - 返回下一个值，但不从流中移除它。
next() - 返回下一个值，并将其从流中丢弃。
eof() - 当且仅当流中没有更多值时才返回true。
croak(msg) - throw new Error(msg)
*/


InputStream('<div></div>')

function InputStream(input) {
    var pos = 0, line = 1, col = 0;
    return {
        next  : next,
        peek  : peek,
        eof   : eof,
        croak : croak,
    };
    function next() {
        var ch = input.charAt(pos++);
        if (ch == "\n") line++, col = 0; else col++;
        return ch;
    }
    function peek() {
        return input.charAt(pos);
    }
    function eof() {
        return peek() == "";
    }
    function croak(msg) {
        throw new Error(msg + " (" + line + ":" + col + ")");
    }
}


