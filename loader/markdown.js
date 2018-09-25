let a = 123;


function f(obj, current, target) {
    let res = JSON.stringify(obj);
    current.forEach((item, index) => {
        let reg = new RegExp(`"${item}":`, 'gm');
        res = res.replace(reg, `"${target[index]}":`)
    });
    return JSON.parse(res);
}

let test = JSON.stringify({
    "success": true,
    "code": 200,
    "msg": "success",
    "result": {
        "productId": 867156,
        "productName": "韦博的日语考级",
        "originPrice": {
            value: 50.00
        },
        "currentPrice": {
            value: 29.00
        },
        "hasMoreExpensivePrice": null,
        "productPic": "//p1.meituan.net/education/7d6c94e872d736a0c52743056397346f357703.jpg%40120w_90h_1e_1c_1l%7Cwatermark%3D0",
        "expensiveCourse": null,
        "saleNum": null,
        "typeName": "日语考级",
        "classNature": "正式课",
        "classNumbers": "1对1",
        "classCat": null,
        "featureTag": null,
        "link": "//h5.51ping.com/app/app-education-sku-all/skudetail.html?productId=867156&shopId=b7td7mavw9jg1qg7",
        "saleTag": "已售5",
        "hasVideo": null,
        "videoTag": null,
        "hasCutPrice": {
            value: 21.00
        },
        "eduDiscountTag": null,
        "eduDiscountSlogan": null,
        "eduDiscountPrice": null,
        "reduceTag": null
    }
});

let res = f1(test, ['hasCutPrice'],[]);
console.log(' >>>  ', res);

function f1(obj, current, target) {
    let res = JSON.stringify(obj);
    current.forEach((item) => {
        let reg = new RegExp(`"${item}":{"value":(.*?)}`, 'gm');
        res = res.replace(reg, `"${item}":(.*)`);
    });
    return JSON.parse(res);
}


