# mod-met
用于vue2函数模块化的解决方案

# 安装
 ```
 npm install --save mod-met
 ```
  
# 使用
``` js
// main.js
import Vue from 'vue'
import modMet from 'mod-met'

Vue.use(modMet)

```

``` js
// methods.js
function log(){
  console.log('log 事件');
}
export default{
  log
}
```


``` vue
// page.vue
<template>
  <div>
    <button @click="log">触发log事件</button>
  </div>
</template>

<script>
import met from './methods'
export default {
  created(){
    this.$met(met)
  },
  methods:{
  }
}
</script>
```


# 启用 mod
``` js
// main.js
import Vue from 'vue'
import modMet from 'mod-met'
import mod from './mod.js'
// 传入第二个参数启用mod,传入装载函数对象
Vue.use(modMet,mod)

```

``` js
//mod.js

/**
 * 每一个装载函数对象都拥有多个函数、modules、public 组成
 * modules由多个装载函数对象组成
 * public为通用函数
 *    
 */
// 此处导出一个根通用装载函数对象
const methods = {
  func1:function(){},
  func2:function(){},
  public: { 
    pub1:function(){},
    pub2:function(){},
  },
  modules:{
    modules1:{
      mod1:function(){},
      mod2:function(){},
      public: {
        mod_pub1:function(){},
        mod_pub2:function(){},
      },
      modules:{}
    },
    modules2:{
      mod3:function(){},
      mod4:function(){},
      public: {
        mod_pub3:function(){},
        mod_pub4:function(){},
      },
      modules:{}
    },
  }
}
export default methods
```

``` vue
// page.vue
<template>
  <div>
    <button @click="log">触发log事件</button>
  </div>
</template>

<script>
import met from './methods'
export default {
  created(){
    /**
     * 启用mod时，使用$modMet(),只有在启用了mod实例中才会有$moeMet()
     * 第一个参数为mod配置,剩余参数与$met()相同
     * mod配置:
     *  <Boolean> : true为启用Public,false 为禁用 Public
     *  <Array> : 每一个都作为函数配置项,此时启用 Public
     *  <Object> : 单个函数配置项 引入其中所有的函数 函数配置项不可有 'methods',此时启用Public
     *             存在 methods 时视为顶级配置
     * 
     *  顶级配置: 由 methods和public两部分组成
     *  methods：为Object时，作为单个函数配置项
     *           为数组时，数组中的每个元素作为一个函数配置项
     *  public:true时启用根目录public,false时不启用
     *  
     *  函数配置项: 由path、public和其他任意value组成
     *  path <string>:配置中所有的函数路径 没有路径时,视为顶级路径
     *  public <boolean>:启用该路径下的通用方法 默认不启用 没有路径时启用public等同于在顶级配置中启用public
     *  其他每一个 key 都会作为要引入的函数名
     *  value为给这个方法的配置:
     *    params <any>:给这个函数预设的参数 多个参数使用数组
     *    path <string>:方法所在的路径(私有路径优先)
     *  调用时的参数会在配置的预设参数后面            
     *  
     * 
    */
    this.$modMet({
      public:false, //不启用根目录public
      methods:[{
        path:'modules1', //该配置项下的公共路径,路径不匹配时会抛出错误
        public:true, //启用modules1路径下的public
        mod1:{}, //引入 mod1 方法,路径为 modules1
        mod3:{ //引入 mod3 方法,路径为 modules2
          name:'func',// 重命名为'func'
          path:'modules2' // 私有路径优先
        }
      },{
        public:true, //不设置路径时启用public视作启用根目录public,优先于顶级配置
        mod2:{
          path:'modules1',
          params:'参数' //预设参数,在有预设参数时,调用函数再传参数,则会接在后面
        },
        mod4:{
          path:'modules2',
          params:['预设参数','预设参数2'] //多预设使用数组,分别占用第一个参数和第二个参数
        },
        func1:{
          params:[[1,2,3]] // 设置一个数组为预设参数是,需要把数组作为params第一个元素
        },
      }]
      },met)
  },
  methods:{
  }
}
</script>
```

  
