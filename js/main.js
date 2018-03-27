


// 一开始代码无高亮，后来才有高亮的原理：

// index.html 引入 的顺序
//  <link rel="stylesheet" href="vendor/prism/prism.css">
// <link rel="stylesheet" href="css/default.css">

// 所以defalt.css会覆盖掉prism.css的样式
// 而defalt.css写了如下代码，所以一开始代码并没有高亮
//   .token.selector{
//     color: black;
//   }
//   .token.property{
//     color: black;
//   }
//   .token.function{
//     color: black;
//   }


//   直到输出css1中的 
// {
//   /* 我需要一点代码高亮 */

// .token.selector{ color: #690; }
// .token.property{ color: #905; }

// }

// 此时style标签里插入了
// .token.selector{ color: #690; }
// .token.property{ color: #905; }

// style标签的样式的优先级更高，所以就代码高亮了



/*把code写到pre和style标签里*/
function writeCss(prefix, code, fn){
  // 原理见https://codepen.io/ScottHuang/pen/jZmPeL
  let domCode = document.querySelector('#code')
  let n = 0




  let id = setInterval(() => {
    n += 1
    domCode.innerHTML = Prism.highlight(prefix + code.substring(0, n), Prism.languages.css); // Returns a highlighted HTML string
     // Prism.highlight会将 prefix + code.substring(0, n) 外面加span标签，然后会匹配上Prism.css的样式，所以才会代码高亮

  // let string ='html{background: red; }'
  // let html=Prism.highlight(string, Prism.languages.css); 
  // console.log(html)
  //打印出  <span class="token selector">html</span>
  // <span class="token punctuation">{</span>
  // <span class="token property">background</span>
  // <span class="token punctuation">:</span> red
  // <span class="token punctuation">;</span> 
  // <span class="token punctuation">}</span>

  // prefix的作用是例如当写css2时，要加上之前的css1，然后一起被写入页面

    styleTag.innerHTML = prefix +  code.substring(0, n)

    domCode.scrollTop = domCode.scrollHeight  //当出现垂直滚动条时会帮用户自动向下滚动
    if (n >= code.length) {
      //setInterval是一个异步代码，所有为了保证所有code写完才调用回调函数fn
      window.clearInterval(id)
      fn && fn()  //确保fn存在才调用fn
    }
  }, 10)
}



function writeMarkdown(markdown, fn){
  //原理和writeCss一样，只是不用高亮
  let domPaper = document.querySelector('#paper>.content')
  let n = 0
  let id = setInterval(() => {
    n += 1
    domPaper.innerHTML = markdown.substring(0, n)
    domPaper.scrollTop = domPaper.scrollHeight
    if (n >= markdown.length) {
      window.clearInterval(id)
      fn && fn()
    }
  }, 35)
}


function createPaper(fn){
  var paper = document.createElement('div') 
  paper.id = 'paper'
  var content = document.createElement('pre')
  content.className = 'content'
  paper.appendChild(content)
  document.body.appendChild(paper)
  fn && fn()
}

//用的一个库叫marked.js
function convertMarkdownToHtml(fn){
  var div = document.createElement('div')  
  div.className = 'html markdown-body'
  div.innerHTML = marked(md)
  let markdownContainer = document.querySelector('#paper > .content')
  markdownContainer.replaceWith(div)
  fn && fn()
}






//因为css1要被插入style标签，所以其中非css的部分要加注释
var css1 = `/* 

 * 首先准备一些样式
 */

*{
  transition: all 1s;
}
html{
  background: #eee;
}
#code{
  border: 1px solid #aaa;
  padding: 16px;
}

/* 我需要一点代码高亮 */

.token.selector{ color: #690; }
.token.property{ color: #905; }

/* 加一个呼吸效果 */

#code{
  animation: breath 0.5s infinite alternate-reverse;
}

/* 现在正式开始 */

/* 我需要一张白纸 */

#code-wrapper{
  width: 50%; left: 0; position: fixed; 
  height: 100%;
}

#paper > .content {
 display: block;
}

/* 于是我就可以在白纸上写字了，请看右边 */
`

var css2 = `
/* 接下来用一个库 marked.js
 * 把 Markdown 变成 HTML
 */



`
var md = `


# 技能介绍

熟悉 JavaScript CSS

# 项目介绍

1. XXX 轮播
2. XXX 简历
3. XXX 画板


`
let css3 = `

/* 谢谢观看
 */
`


writeCss('', css1, ()=>{ 
  createPaper(() => {
    writeMarkdown(md, ()=> {
      writeCss(css1, css2, ()=>{
        convertMarkdownToHtml(()=>{
          writeCss(css1 + css2, css3, ()=> {
            console.log('完成')
          })
        })
      })
    })
  })
})

