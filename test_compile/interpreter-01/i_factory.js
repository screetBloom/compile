/*

peek() - 返回下一个值，但不从流中移除它。
next() - 返回下一个值，并将其从流中丢弃。
eof() - 当且仅当流中没有更多值时才返回true。
croak(msg) - throw new Error(msg)
*/

let input_obj = InputStream('<div><ul><li>cc</li></ul></div>\n' +
    '<span>aa</span>'),
    str = '';

while(!input_obj.eof()){
    str += input_obj.next()
}
console.log(str)



function InputStream(input) {
    var pos = 0,   // 当前所处的位置
        line = 1,  // 当前行
        col = 0;   // 当前列
    return {
        next  : next,
        peek  : peek,
        eof   : eof,
        croak : croak,
    };

    /*
    * @ 返回下一个字节，将其从字节流中丢弃
    * */
    function next() {
        var ch = input.charAt(pos++);
        if (ch == "\n") line++, col = 0; else col++;
        this.croak()
        return ch;
    }

    /*
    * @ 返回下一个字节，不丢弃，主要用于判断
    * */
    function peek() {
        return input.charAt(pos);
    }

    /*
    * @ 主要用于判断当前是否读取到字节流的末尾
    * */
    function eof() {
        return peek() == "";
    }

    /*
    * @ 主要用于抛出错误
    * */
    function croak(msg) {
        throw new Error(msg + " (" + line + ":" + col + ")");
    }
}


