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
    this.$event(met)
  },
  methods:{
  }
}
</script>
```

  
