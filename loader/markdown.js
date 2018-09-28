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

let test = {
    "appointUrl": "//h5.51ping.com/app/gfe-app-education-common-book/index.html?productId=867156&bookChannel=dp_product",
    "showTeacherNationality": true,
    "productItemInfoBeans": [{
        "skuId": 1469460,
        "itemName": "1",
        "classTotalHours": "2ihjf",
        "classLaw": "294",
        "classStartTime": "随到随学",
        "reduceTag": null,
        "classContentList": [{"title": "0kljasdf", "times": "1", "originPrice": {"value": "29"}}],
        "price": {"value": "29.00"},
        "originPrice": {"value": "29.00"},
        "reducePrice": null,
        "discountDetailInfo": null,
        "discountInfo": null
    }],
    "haveAppoint": true,
    "shareBean": {
        "url": "//h5.51ping.com/app/app-education-sku-all/skudetail.html?productId=867156&source=dianping&shopId=1880329",
        "image": "//p1.meituan.net/education/7d6c94e872d736a0c52743056397346f357703.jpg%40100w_100h_1e_1c_1l%7Cwatermark%3D0",
        "title": "【课程】仅售29元 | 韦博的日语考级 - 韦博英语(静安环球大厦中心)",
        "desc": "★★★☆☆\n静安寺 英语\n-09a-dfasdf",
        "content": "【课程】仅售29元 | 韦博的日语考级 - 韦博英语(静安环球大厦中心)"
    },
    "canRefund": true,
    "hasCollect": false,
    "canBuy": true,
    "productDetailLink": "//h5.51ping.com/edu/education-sku-detail/detail.html?productId=867156",
    "categoryIds": [102, 10202],
    "classDuration": "1小时",
    "phone": "4009811028",
    "hasLogin": true,
    "basicInfoBean": {
        "videoHeadpic": null,
        "videoUrl": null,
        "productName": "韦博的日语考级",
        "soldoutTotal": 6,
        "suitCrowds": "青少年",
        "suitBase": "初级",
        "classNum": "1对1",
        "teacherNationality": "外教",
        "imUrl": "dianping://web?url=https%3A%2F%2Fg.51ping.com%2Fapp%2Fbabyfe-app-baby-im%2Findex.html%3FshopId%3Dsb7td7mavw9jg1qg7%26clientType%3D100501",
        "haveIm": true,
        "classStudyTime": null,
        "classCatergoryName": "日语",
        "headpics": ["//p1.meituan.net/education/7d6c94e872d736a0c52743056397346f357703.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0", "//p1.meituan.net/education/11d1ce90f846abeac00e2a549b711d96573546.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0"],
        "minCurrentPrice": {"value": "29.00"},
        "maxCurrentPrice": {"value": "29.00"},
        "originPrice": {"value": "29.00"},
        "classHighlights": ["-09a-dfasdf"],
        "startTime": "2018-07-17T16:00:00.000Z",
        "endTime": "2099-08-15T15:59:59.000Z"
    },
    "bookingCount": 1,
    "enrollLink": "//h5.51ping.com/app/app-education-sku-all/skuorder.html?productId=867156&token=!&dpid=*",
    "categoryId": 2872
};

console.log('  >>>>  ',structuralTransform(test));


