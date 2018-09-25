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


