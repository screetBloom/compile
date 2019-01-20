Transpiling
---
前端本部分的学习，会将babel作为重要学习资料
<br>
[babel中文网点击这里](https://babeljs.cn/)
<br>
**举个利用babel将template模板解析成自定义结构的抽象dom树的栗子：**
```bash
/** @jsx h */

function h(node, props, ...children) {
  return { node, props, children };
}

const a = (
  <ul class="list test">
    <li>item 1</li>
    <li>item 2</li>
  </ul>
);
console.log(a);
/*   输出如下：
{
    "node": "ul",
    "props": {
        "class": "list test"
    },
    "children": [
        {
            "node": "li",
            "props": null,
            "children": [
                "item 1"
            ]
        },
        {
            "node": "li",
            "props": null,
            "children": [
                "item 2"
            ]
        }
    ]
}
*/
````

本仓库也是我个人的一个学习历程记录，下面是具体的参考资料清单
---
这里只列举个人看过，实践过，然后觉得有用的
<br>    
**列表如下：**       
- babel原理解析入门可以看这个（这篇博客借鉴了一个外国人） => [Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600)
- 从零开始写一个compile => [如何使用 JavaScript 实现一门编程语言](https://www.kancloud.cn/xiaoyulive/system/606559)
- babel官网推荐如何实现一个微型compiler（挺不错） => [the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)
-  前端如何学习编译，编译可以做什么 => [前端要以正确的姿势学习编译原理](https://zhuanlan.zhihu.com/p/36301857?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)
- babel入门基础 => [babel用户手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)
- babel进阶插件 => [babel插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)




<br>
<br>
<br>

具体实践
---
上次写的一个例子因为涉及到自己在公司用的包，已经应安全部门要求删除
- node操作文件实现自动化
    - [ejs模板自动化生成vue组件](//github.com/screetBloom/compile/tree/master/gulp) 
- babel进行自定义语法转译
- [CSS状态切换结合有限状态机](//github.com/screetBloom/compile/tree/master/Finite-state-machine)

