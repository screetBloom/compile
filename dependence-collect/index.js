
const path = require("path");
const http = require("http");
const https = require("https");
const {AWP_GIT_KEY, AWP_GIT_SLUG, AWP_OP: userName, REACT_APP_OWL_PROJECT: project = "null", AWP_DEPLOY_ENV: env = "beta", AWP_BUSINESS_TYPE} = process.env;

const LINA_HOSTS = ``;
const WHITE_LIST_LINA_KEY = ``;
const PUSH_TYPE = '';
let whiteList = [];

const fs = require("fs");

function isType(obj, type) {
    return (
        Object.prototype.toString.call(obj).toLowerCase() === '[object ' + type + ']'
    );
}

function _toString(value) {
    return isType(value, 'object') ? JSON.stringify(value) : String(value);
}

async function main(param) {
    console.log("")
    console.log("")
    console.log('当前环境>',AWP_BUSINESS_TYPE);
    // if(env != "production"){
    //   console.log("非正式环境,关闭采集");
    //   return ;
    // }
    console.log('cwd path>',path.join(cwd, "package.json"));
    try {
        let pkgPath = path.join(cwd, "package.json");
        //检测package.json是否存在
        let pkg = {};
        if (!fs.existsSync(pkgPath)) {
            console.log("项目根目录下package.json没有找到");
            return;
        } else {
            pkg = require(pkgPath);
        }
        let _dependencies = pkg.dependencies || {}
        _dependencies = Object.assign(pkg.devDependencies || {}, _dependencies)
        let source = `${AWP_GIT_KEY}~${AWP_GIT_SLUG}`
        let value = []
        if (_dependencies) {
            for (let depKey in _dependencies) {
                let dependencyObj = {}
                let target = depKey
                let text = {
                    version: _dependencies[depKey],
                    author: param.userName,
                    type: PUSH_TYPE
                }
                dependencyObj.target = target
                dependencyObj.text = JSON.stringify(text)
                value.push(dependencyObj)
            }
        }
        // 读取白名单
        let getLinaRes = await getLina();
        getLinaRes = getLinaRes && JSON.parse(getLinaRes);
        whiteList = getLinaRes && getLinaRes.data && getLinaRes.data.value && getLinaRes.data.value.whiteList;
        if (whiteList && isType(whiteList, 'array') && whiteList.length > 0) {
            console.log("白名单表:")
            console.log(JSON.stringify(whiteList))
            // 添加对yarn.lock的处理
            if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
                console.log("进入yarn.lock");
                console.log(path.join(cwd, "yarn.lock"));
                let yarnFile = fs.readFileSync(path.join(cwd, "yarn.lock"), 'utf8');

                let yarnRegStr = `(${whiteList.join('|').replace(/\//g, '\\/')})[@|"| ]([\\s\\S]+?)\\s`;
                yarnFile.replace(new RegExp(yarnRegStr, 'gm'), function (match) {
                    match = match.replace(/"/g, '').replace(/[:|,]/g, '').replace(/([^@])@/g, `$1 `);
                    if(match.split(' ').length > 1) {
                        let dependencyObj = {
                            target: match.split(' ')[0],
                            text: JSON.stringify({
                                version: match.split(' ')[1].replace(/\n/g, ''),
                                author: userName,
                                type: PUSH_TYPE
                            })
                        };
                        // 去重
                        if (JSON.stringify(value).indexOf(JSON.stringify(dependencyObj)) < 0) {
                            console.log("yarn.lock新增白名单中间件");
                            console.log(JSON.stringify(dependencyObj))
                            value.push(dependencyObj);
                        }
                    }
                });
            }
            // 添加对package-lock.json的处理
            let npmLockPath = path.join(cwd, "package-lock.json");
            if (fs.existsSync(npmLockPath)) {
                console.log("进入package-lock.lock");
                let npmLockJson = require(npmLockPath) && require(npmLockPath).dependencies;
                let npmLockDev = generateItem(npmLockJson, value, 'npm');
                console.log("package-lock.json白名单中间件:")
                console.log(JSON.stringify(npmLockDev));
                value = value.concat(npmLockDev);
            }
        }
        if (value && value.length) {
            let _env = env === 'product' ? 'product' : 'beta'
            let rpc = await push(source, value, 'ci', env)
            if (rpc) {
                rpc = JSON.parse(rpc)
                if (rpc && rpc.code === 200) {
                    console.log('--- 成功 ---')
                } else {
                    console.log(JSON.stringify(rpc))
                    console.log('--- 失败 ---')
                }
            }
        } else {
            console.log("项目下没有dependencies依赖");
        }

    } catch (e) {
        console.log(`--- 错误--:${JSON.stringify(e.stack || e)}`)
    }
}

async function getLina() {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: `${LINA_HOSTS}`,
            path: `/api/get?key=${WHITE_LIST_LINA_KEY}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let req = http.request(options, function (res) {
            res.setEncoding('utf-8');
            let responseString = '';
            res.on('data', function (data) {
                responseString += data;
            });
            res.on('end', function () {
                resolve(responseString);
            });
            req.on('error', function (e) {
                console.log(`error: can't get xx key, please contact xxx`);
                reject(false);
            });
        });
        req.end();
    })
}

// 原定兼容yarnLockFile.parse和package-lock结构
function generateItem(json, value, type) {
    let arr = Object.keys(json),
        res = [],
        commonReg = new RegExp(`${whiteList.join('|').replace(/\//g, '\\/')}`,'g');
    // 经测试:原始的for速度最快,10^6及更大数据速率遥遥领先
    for (let i = 0; i < arr.length; i++) {
        let key = arr[i];
        // 收集lock文件的一级白名单key, 同时去重
        if (commonReg.test(key)) {
            let dependencyObj = {
                target: key,
                text: JSON.stringify({
                    version: json[key].version,
                    author: userName,
                    type: PUSH_TYPE
                })
            };
            // 去重
            if (JSON.stringify(res).indexOf(JSON.stringify(dependencyObj)) < 0 && JSON.stringify(value).indexOf(JSON.stringify(dependencyObj)) < 0) {
                res.push(dependencyObj);
            }
        }
        // 继续收集lock文件dependencies白名单key
        let flag = json[key] && json[key].dependencies && JSON.stringify(json[key].dependencies).match(commonReg);
        if (!flag) continue;
        let dependencies = {};
        // 收集、整理lock文件的dependencies格式一致
        Object.keys(json[key].dependencies).map((item) => {
            dependencies[item] = json[key].dependencies[item].version;
        });
        // 循环dependencies，收集白名单
        let dependenciesKeys = Object.keys(dependencies);
        for (let index = 0;index < dependenciesKeys.length; index++) {
            let dependenciesKey = dependenciesKeys[index];
            if (!commonReg.test(dependenciesKey)) continue;
            let dependencyObj = {
                target: dependenciesKey,
                text: JSON.stringify({
                    version: dependencies[dependenciesKey],
                    author: userName,
                    type: PUSH_TYPE
                })
            };
            // 去重
            if (JSON.stringify(value).indexOf(JSON.stringify(dependencyObj)) >= 0) continue;
            if (JSON.stringify(res).indexOf(JSON.stringify(dependencyObj)) >= 0) continue;
            res.push(dependencyObj);
        }
    }
    return res;
}

main({userName});
