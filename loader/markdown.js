
let a = 123;


function f(obj, current, target) {
    let res = JSON.stringify(obj);
    current.forEach((item, index) => {
        let reg =new RegExp(`"${item}":`, 'gm');
        res = res.replace(reg, `"${target[index]}":`)
    });
    return JSON.parse(res);
}



