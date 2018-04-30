# compile
js编译，前置parsing也会放在这个部分


编译起步，看babel挺好的
<br>
[babel中文网点击这里](https://babeljs.cn/)
[babel原理解析入门可以看这个-Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600)   
**举个babel的例子：**
```bash
/** @jsx h */

function h(type, props, ...children) {
  return { type, props, children };
}

const a = (
  <ul class="list test">
    <li>item 1</li>
    <li>item 2</li>
  </ul>
);
console.log(a);
/*
{
    "type": "ul",
    "props": {
        "class": "list test"
    },
    "children": [
        {
            "type": "li",
            "props": null,
            "children": [
                "item 1"
            ]
        },
        {
            "type": "li",
            "props": null,
            "children": [
                "item 2"
            ]
        }
    ]
}
*/
````
**这个就是利用babel将template模板解析成抽象dom树**


记录自己学习编译参考的材料
---
这里只写自己看过，时间过，然后觉得有用的
[babel原理解析入门可以看这个-Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600)
