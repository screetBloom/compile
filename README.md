# compile
js编译，前置parsing也会放在这个部分


编译起步，看babel挺好的
<br>
[babel中文网点击这里](https://babeljs.cn/)     
babel原理解析入门可以看这个 => [Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600)  
**举个babel的例子：**
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
**这个就是利用babel将template模板解析成自定义结构的抽象dom树**   


记录自己学习编译参考的材料
---
这里只写自己看过，实践过，然后觉得有用的    
<br>    
**列表如下：**       
- babel原理解析入门可以看这个,当然他这篇博客借鉴了一个外国人 => [Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600)
- 从零开始写一个compile => [如何使用 JavaScript 实现一门编程语言](https://www.kancloud.cn/xiaoyulive/system/606559)

<br>
<br>
<br>

