
let a = 123;


function f(obj, current, target) {
    let res = JSON.parse(JSON.stringify(obj));
    current.forEach((item, index) => {
        let reg =new RegExp(`"${item}":`);
        res.replace(reg, `"${target[index]}":`)
    })

}



