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

function structuralTransform(obj, parent) {
    if (_isType(obj, 'array')) {
        obj.forEach((item) => {
            let flag = _isType(item, 'array') || _isType(item, 'object');
            if (flag) {
                structuralTransform(item, obj);
            } else {
                // do nothing
            }
        })
    } else if (_isType(obj, 'object')) {
        Object.keys(obj).forEach((key) => {
            let flag = _isType(obj[key], 'array') || _isType(obj[key], 'object');
            if (flag) {
                structuralTransform(obj[key], obj);
            } else {
                let tem = (key === 'value') && (Object.keys(obj).length === 1);
                if (tem) {
                    // obj = obj[key];
                    parent.obj = obj[key];
                }
            }
        })
    } else {
        // do nothing
    }
}


let arr = [
    {
        productName: '大白菜',
        eName: 'dabaicai',
        age: 25,
        city: 'shanghai',
        height: 170,
        tag: '新品上市'
    },
    {
        productName: '大白菜',
        eName: 'dabaicai',
        age: 26,
        city: 'shanghai',
        height: 900,
        tag: '新品上市'
    },
    {
        productName: '小白菜',
        eName: 'xiaobaicai',
        age: 31,
        height: 169,
        tag: '新品上市'
    },
    {
        productName: '昨天的白菜',
        eName: 'zuotiandebaicai',
        age: 31,
        height: 167,
        tag: '特价优惠'
    },
    {
        productName: '前天的白菜',
        eName: 'qiantiandebaicai',
        age: 22,
        height: 160,
        tag: '特价优惠'
    },
    {
        productName: '内部白菜',
        eName: 'neibubaicai',
        age: 23,
        height: 159,
        tag: '线上直售'
    }
];


function sortByKey(arr, key, type) {
    if (!_isType(arr, 'array')) return;
    let tree = {};
    arr.forEach((item) => {
        let tagValue = item[key];
        if (!tree[tagValue]) {
            tree[tagValue] = [];
        }
        tree[tagValue].push(item);
    });
    if (type === '2Arr') {
        let res = [];
        Object.keys(tree).forEach((item) => {
            res.push({
                key: item,
                children: tree[item]
            });
        });
        return res;
    }
    return tree;
}

function shopListSort(arr, key, type) {
    // 分类
    let tem = sortByKey(arr, key, type), res = [];
    let keys = [];
    Object.keys(tem).forEach((item) => {
        keys.push(item);
    });
    keys.sort();
    console.log(' keys >>>  ', keys);
    keys.forEach((item) => {
        res.push(tem[item])
    });
    return res;
}
console.log(JSON.stringify(shopListSort(arr, 'eName')));



