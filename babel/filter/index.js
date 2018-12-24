// filter the str

let arr = [
    {a:1},
    {b:2},
    {a: 'tetstetstst'},
    {here: 'a'},
    {
        copy: [
            {a:55},
            {b:66},
            {c: {
                a:null
                }
            }
        ]
    }
];

let data = {
    a: 1,
    price: {
        value: 1
    },
    value: 2
};
console.log(JSON.stringify(data).replace(/(\{\"value\"\:)(\d+)(\})/g, `"$2"`));

// console.log(JSON.stringify(reDefinedKey(arr, 'a', 'name')));

/*
 *@param {} obj  目标对象
 *@param {string} init  初始属性值
 *@param {string} target 目标属性值
*/
function reDefinedKey(obj, init, target) {
    try {
        if (isType(init, 'string')) {
            const str = JSON.stringify(obj);
            return JSON.parse(str.replace(new RegExp(`\"${init}\"\:`, 'gm'), `"${target}":`));
        } else if (isType(init, 'array')) {
            let res = JSON.parse(JSON.stringify(obj));
            init.map((key, index) => {
                res = reDefinedKey(res, key, target[index]);
            });
            return res;
        }
    } catch(err) {
        throw(' the type of obj is incorrect ');
    }
}


function isType(obj, type) {
    return (
        Object.prototype.toString.call(obj).toLowerCase() === '[object ' + type + ']'
    );
}





