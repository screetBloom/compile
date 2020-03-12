const _path = require('path')
const _fs = require('fs')
const { chalk } = require('@vue/cli-shared-utils')
let { OLDPWD: cwd = './' } = process.env

/*
 * MUST中缺失: 即业务删除
 * CAN中多余: 即不符合标准的业务自定义目录文件
 */
let missingDirs = []
let extraDirs = []

/*
 * 制定规则树
 * 规则树中目录path支持模糊匹配, 例如: src/components/**\/config[这里的/需要转义]
 * 规则数据中规则value支持正则, 例如: ['src', /^\.(.+)js$/]
 */
const MUST = 'must'
const CAN = 'can'
let ruleTree = {
  './': {
    [MUST]: [
      'src',
      'index.js',
      'package.json',
      'yarn.lock',
      'README.md',
      'CHANGELOG.md',
      '.commitlintrc.js',
      '.cz-configrc.js',
      '.editorconfig',
      '.eslintrc.js',
      '.stylelintrc.js',
    ],
    [CAN]: [
      'entry',
      'public',
      'bin',
      'docs',
      'tests',
      'vue.config.js',
      'babel.config.js',
      '.npmignore',
      '.npmrc',
      /^\.(.+)/,
    ],
  },
  src: {
    [MUST]: ['components'],
    [CAN]: ['lib', 'api', 'assets'],
  },
  'src/components/**': {
    [MUST]: ['index.vue', 'config'],
  },
  'src/components/**/config': {
    [MUST]: ['component.json'],
  },
}

/*
 * 程序入口
 */
module.exports = function(type = 'component') {
  if (type === 'project') {
    // 工程级别的目录规则树
    ruleTree = {
      './': {
        [MUST]: [
          'src',
          'bin',
          'public',
          'package.json',
          'yarn.lock',
          'README.md',
          '.commitlintrc.js',
          '.cz-configrc.js',
          '.editorconfig',
          '.eslintrc.js',
          '.stylelintrc.js',
        ],
        [CAN]: ['config', 'tests', 'build', 'babel.config.js', 'vue.config.js', /^\.(.+)/],
      },
      src: {
        [MUST]: ['pages'],
        [CAN]: ['packages', 'components', 'lib', 'api', 'plugins', 'assets', 'styles'],
      },
      'src/pages/**': {
        [MUST]: ['app.vue', 'main.js'],
      },
      'src/components/**': {
        [MUST]: ['index.vue'],
      },
      public: {
        [MUST]: ['index.html'],
      },
      bin: {
        [MUST]: ['talos_build'],
      },
      'src/packages/**': {
        [MUST]: ['package.json', 'pages'],
        [CAN]: ['components', 'lib', 'api', 'plugins', 'assets', 'styles'],
      },
      'src/packages/**/pages/**': {
        [MUST]: ['app.vue', 'main.js'],
      },
      'src/packages/**/components/**': {
        [MUST]: ['index.vue'],
      },
    }
  }
  // 目录结构卡控入口函数
  return directoryControl()
}

/*
 * 利用原型链判断类型，返回小写的数据类型
 * @param obj: javascript中任意类型的数据
 */
function whatType(obj) {
  return Object.prototype.toString
    .call(obj)
    .toLowerCase()
    .replace(/(\[object\s)(\w+)(])/g, '$2')
}

/*
 * 求数组是否正则包含某个值
 * @param arr: 子元素可能为正则表达式
 * @param val: 字符串
 */
function regIncludes(arr, val) {
  let resFlag = []
  arr.forEach(i => {
    // 子元素为正则表达式
    if (whatType(i) === 'regexp') {
      resFlag.push(i.test(val))
    } else {
      // 默认为字符串
      resFlag.push(i === val)
    }
  })
  // 若有一个key判断为true, 则证明包含
  const passLength = resFlag.filter(i => i).length
  // 多个key为true, 则证明正则写的范围过大, 此时需提醒规则树优化改进正则
  if (passLength > 1) {
    console.log(`正则匹配到符合条件的文件数量为:${passLength}, 请注意正则的准确性～`)
  }
  return passLength > 0
}

/*
 * 求数组交集、差集
 * @param arr1: 不包含正则的数组,这里一般为目录数组
 * @param arr2: 包含正则的数组,这里一般是子元素可能为正则的自定义规则数组
 */
function arrDiff(arr1 = [], arr2 = []) {
  const intersection = arr1.filter(v => regIncludes(arr2, v))
  const difference = arr1.filter(x => !regIncludes(arr2, x))
  return {
    intersection,
    difference,
  }
}

/*
 * 目录path模糊匹配
 * @param fuzzyPath代表模糊路径: 即用户输入的规则
 * @param targetPath代表真实路径: 即fs读取出的路径
 * @return 模糊路径或者是false
 * 模糊匹配特征:
 * 1. path深度一致
 * 2. “**”全匹配
 * 3. 模糊路径和真实路径每个非token的key必须一致
 *
 */
function fuzzyPathMatch(fuzzyPath = '', targetPath = '') {
  // 去除模糊匹配末尾可能被错误增加的/
  if (/\/$/.test(fuzzyPath)) {
    fuzzyPath = fuzzyPath.slice(0, -1)
  }
  const fuzzyToken = '**'
  let resFlag = []
  // 解成数组
  const fuzzyPathArr = fuzzyPath.split('/')
  const targetPathArr = targetPath.split('/')
  // 判断深度
  const fuzzyDeep = fuzzyPathArr.length
  const targetDeep = targetPathArr.length
  if (fuzzyDeep !== targetDeep) return false
  // 逐个key对比, 保证每个key都一样
  for (let i = 0; i < targetPathArr.length; i++) {
    const targetKey = targetPathArr[i]
    const fuzzyKey = fuzzyPathArr[i]
    // 模糊token直接判断为通过
    if (fuzzyKey == fuzzyToken) continue
    // 非模糊token
    if (targetKey !== fuzzyKey) {
      resFlag.push(false)
    } else {
      resFlag.push(true)
    }
  }
  // 若有一个key判断为false, 则证明不是完全路径匹配
  const passFlag = resFlag.filter(i => !i).length === 0
  return passFlag ? fuzzyPath : passFlag
}

/*
 * 深度优先输出对应层级的目录结构
 * @param target: 目录path
 * @param deep: 目录层级，1代表顶层
 */
function loadTree(target, deep) {
  // 组合|显示层级关系
  const prev = new Array(deep).join(' ┃')
  const dirInfo = _fs.readdirSync(target)
  // 保存文件或者是文件夹
  let files = []
  let dirs = []
  let all = []

  //遍历将文件或者文件夹分开存储
  for (let i = 0; i < dirInfo.length; i++) {
    const state = _fs.statSync(_path.join(target, dirInfo[i]))
    const name = dirInfo[i]
    // 排除无意义的文件
    if (name == 'node_modules' || name == '.git' ) {
      continue
    }
    if (state.isFile()) {
      files.push(dirInfo[i])
    } else {
      dirs.push(dirInfo[i])
    }
    all.push(dirInfo[i])
  }

  // 递归文件夹
  for (let i = 0; i < dirs.length; i++) {
    console.log(`${prev} ┣━ ${dirs[i]}`)
    //下一级的文件目录 以及层级
    let nextPath = _path.join(target, dirs[i])
    let nextDeep = deep + 1
    //递归
    loadTree(nextPath, nextDeep)
  }

  // 输出文件
  for (let i = files.length - 1; i >= 0; i--) {
    if (i === 0) {
      console.log(`${prev} ┗━ ${files[i]}`)
    } else {
      console.log(`${prev} ┣━ ${files[i]}`)
    }
  }

  /*
   * 匹配当前目录下的规则
   */
  // 默认直接匹配, 不考虑模糊
  let currentDirRules = ruleTree[target]
  // 判断规则树key是否有**模糊匹配
  const ruleKeys = Object.keys(ruleTree)
  const fuzzyRuleKeys = ruleKeys.filter(i => i.indexOf('**') >= 0)
  if (fuzzyRuleKeys.length > 0) {
    fuzzyRuleKeys.forEach(i => {
      /*
       * 特征:
       * 1. path 深度一致
       * 2. **全匹配，其他每个路径都一致
       * 返回匹配到的模糊路径或者是false
       */
      const realPath = fuzzyPathMatch(i, target)
      if (realPath) {
        // 若模糊匹配正确, 将模糊规则赋值给当前路径
        currentDirRules = ruleTree[realPath]
      }
    })
  }
  /*
   * 规则已经确定, 进行缺失、多余目录的解析
   */
  if (currentDirRules) {
    const mustInclude = currentDirRules[MUST]
    const canInclude = currentDirRules[CAN]
    // 和MUST求交集
    const intersection = arrDiff(all, mustInclude).intersection
    // 判断是否包含全部的 MUST规则
    if (mustInclude && mustInclude.length > 0) {
      // MUST中缺少的部分: MUST - intersection
      const interDiffMust = arrDiff(mustInclude, intersection).difference
      if (interDiffMust.length > 0) {
        // 有缺少的目录文件, 记录在册
        missingDirs.push({
          [target]: interDiffMust,
        })
      }
    }
    // 不符合标准的业务自定义目录文件
    if (canInclude && canInclude.length > 0) {
      // 排除MUST部分,推出自定义文件: all - MUST
      const personalDir = arrDiff(all, mustInclude).difference
      // 自定义文件和CAN求交集
      const personalInterCan = arrDiff(personalDir, canInclude).intersection
      // 不符合标准的部分: 自定义文件 - 交集
      const nonStandardDir = arrDiff(personalDir, personalInterCan).difference
      if (nonStandardDir.length > 0) {
        // 有不符合标准的目录文件, 记录在册
        extraDirs.push({
          [target]: nonStandardDir,
        })
      }
    }
  }
}

/*
 * 目录结构卡控入口函数
 */
function directoryControl() {
  // 深度递归
  loadTree(cwd, 1)
  // 缺少的目录
  missingDirs.forEach(item => {
    const key = Object.keys(item)[0]
    const value = Object.values(item)[0].join(',')
    // 集中输出给用户看一下哪些是缺的
    console.log(chalk.white(`${key === './' ? '根目录' : key}下缺 >`), chalk.yellow(`${value}`))
  })
  // 不符合规范的目录
  extraDirs.forEach(item => {
    const key = Object.keys(item)[0]
    const value = Object.values(item)[0].join(',')
    // 集中输出给用户看一下哪些是非标准的
    console.log(chalk.white(`${key === './' ? '根目录' : key}下不符合标准 >`), chalk.yellow(`${value}`))
  })
  if (missingDirs.length > 0 || extraDirs.length > 0) {
    console.log(chalk.yellow(`----------------------目录不符合卡控标准          ----------------------`))
    return false
  }
  console.log(chalk.green(`----------------------目录符合卡控标准            ----------------------`))
  return true
}
