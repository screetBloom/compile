let a = 123;



function f(obj, current, target) {
    let res = JSON.stringify(obj);
    current.forEach((item, index) => {
        let reg = new RegExp(`"${item}":`, 'gm');
        res = res.replace(reg, `"${target[index]}":`)
    });
    return JSON.parse(res);
}

function f1(obj, current, target) {
    let res = JSON.stringify(obj);
    current.forEach((item, index) => {
        let reg = new RegExp(`"${item}":{"value":(.*?)}`, 'gm');
        let value = JSON.parse(`{${res.match(reg)[0]}}`)[item].value;
        res = res.replace(reg, `"${item}":${value}`);
        console.log(JSON.parse(res))
    });
    return JSON.parse(res);
}

function _isType(obj, type) {
    return (
        Object.prototype.toString.call(obj).toLowerCase() === '[object ' + type + ']'
    );
}

function structuralTransform(obj, name) {
    if (_isType(obj,'array')) {
        obj.forEach((item) => {
            let flag = _isType(item,'array') || _isType(item,'object');
            if (flag) {
                structuralTransform(item)
            }else {
                // do nothing
            }
        })
    } else if (_isType(obj,'object')) {
        Object.keys(obj).forEach((key) => {
            let flag = _isType(obj[key],'array') || _isType(obj[key],'object');
            if (flag) {
                structuralTransform(obj[key])
            }else {
                let tem = (key === 'value') && (Object.keys(obj).length === 1);
                if (tem) {
                    obj = obj[key];
                }
            }
        })
    } else {
      // do nothing
    }
}

let test = ''


