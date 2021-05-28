// import Vue from 'vue'
// import moduleMethods from './methods'
let moduleMethods = {}
let Vue = {}
function event(V,mo){
  Vue = V
  if(isObject(mo)){
    moduleMethods = mo
    return {Event,ADD}
  }else{
    return ADD
  }
}
function Event(pub, ...register) {
  
/**
 * pub <boolean || Object || Array>
 * boolean : true需要通用方法  false不需要
 * Object : 最为单个函数配置项 引入其中所有的函数 函数配置项不可有 'methods'
 *          存在 methods 时pub视为顶级配置
 * Array : 每一个都作为函数配置项
 */

/**
 * 顶级配置 <Object>
 *   methods <Object || Array>:
 *      为Object时，作为单个函数配置项
 *      为数组时，数组中的每个元素作为一个函数配置项
 *   public <boolean>:
 *      是否启用通用方法:默认为启用
 *      
 */

  /**
 * 函数配置项:
 *  path <string>:配置中所有的函数路径 没有路径时,视为顶级路径
 *  public <boolean>:启用该路径下的通用方法 默认不启用 没有路径时启用public等同于在顶级配置中启用public
 *  配置项的每一个 key 会作为要引入的函数名
 *  value为给这个方法的配置:
 *    params <any>:给这个函数预设的参数 多个参数使用数组
 *    path <string>:方法所在的路径(私有路径优先)
 *    name <string>:默认会使用key作为函数名,声明name时使用name作为名称
 *  调用时的参数会在配置的预设参数后面
 *
 */

  /**
 * 
 * 调用该方法时,从第二个参数开始,都是自定义数据 会被挂载到当前vue实例中
 * register: 需要挂载到当前vue实例的对象和数据
 *  register item <any>
 *  用于向vue对象添加方法 通过this调用
 *  如果是[object Object] 这个数据是放入后拥有响应式
 *  如果为基础类型数值,null,Array，则不具备响应式
 *  需要立即执行的函数 放在 implement 下面
 */

  // 是否需要通用方法
  if (pub === true) {
    // 放在数组第一个  后续有同名方法时 ,会覆盖通用方法
      //没有定义通用方法则会放入一个undeftend,后续清除
    register.unshift(moduleMethods.public)
  } else if (pub !== false) {
    const mets = []
    if (Array.isArray(pub)) {
      register.unshift(moduleMethods.public || {})

      pub.forEach(item => {
        mets.push(...decompose(item))
      })
    } else if (pub.methods) {
      // 为数组时,把数组中的每一个配置保存进待添加
      if (Array.isArray(pub.methods)) {
        pub.methods.forEach(item => {
          mets.push(...decompose(item))
        })
      } else if (isObject(pub.methods)) {
        mets.push(...decompose(pub.methods))
      } else throw  console.warn(`不合法的 methods 配置项 ${typeof pub.methods}`);

      if (pub.public !== false) register.unshift(moduleMethods.public || {})
    } else {
      if (pub.public !== false) register.unshift(moduleMethods.public || {})
      mets.push(...decompose(pub))
    }
    // 自定义路径加载模块
    const mods = {}
    mets.forEach((item) => {
      // console.log(item)
      if (item.__name === 'modules'){
        console.warn(`预设字段 "modules" 不可使用`);
      }else if (item.path) {
        const path = item.path.split('/')
        const func = ransack({ ...moduleMethods }, [...path.filter(it => it !== '')])
        if (typeof func === 'undefined') {
          console.warn(item.path + '路径下无内容导出');
        }else{
          Object.assign(mods, fill.call(this, item.params,item.name || item.__name, func[item.__name],item.path || item.__path))
        }        
      } else if (item.__path) {
        const path = item.__path.split('/')
        const func = ransack({ ...moduleMethods }, [...path.filter(it => it !== '')])
        if (item.__name === 'public') register.unshift(file_pub(func.public))
        
        else Object.assign(mods, fill.call(this, item.params,item.name || item.__name, func[item.__name],item.path || item.__path))
        
      } else {
        if (item.__name === 'public') register.unshift(file_pub( moduleMethods.public))
        else Object.assign(mods,fill.call(this, item.params,item.name || item.__name, moduleMethods[item.__name],item.path || item.__path))
      }
    })
    register.unshift(mods)
  }
  ADD.call(this, ...register)
}

function ADD(...register){
  const registry = {}
  const implement = []
  const VolumeCollection = {}
  register.forEach((item, i) => {
    
    // 收到数组或者非对象,抛出错误
    if (!isObject(item)) {
      console.warn(item ,`register应为Object,异常数据出现位置:${i}`)
    }
    try {
      for (const key in item) {
        if (key !== 'implement' && typeof item[key] === 'function') {
          registry[key] = item[key].bind(this)
        } else if (key === 'implement') {
          // 如果有implement 则遍历
          for (const k in item.implement) {
            if(registry[k] !== undefined){
              console.warn(`${k}重复定义执行覆盖操作,请避免使用相同的名称`);
            }
            if (typeof item.implement[k] === 'function') {
            // 如果是方法  挂载后加入执行列表
              registry[k] = item.implement[k].bind(this)
              implement.push(k)
            } else {
              if(registry[k]!== undefined) console.warn(`${k}重复定义执行覆盖操作,请避免使用相同的名称`);
              registry[k] = item.implement[k]
              // 数据类型使用量收集统一处理
              VolumeCollection[k] = item.implement[k]
            }
          }
        } else {
          if(registry[key]!== undefined) console.warn(`${key}重复定义执行覆盖操作,请避免使用相同的名称`);
          registry[key] = item[key]
          VolumeCollection[key] = item[key]
        }
      }
    } catch (err) {
      console.warn(err)
    }
  })
  // 把处理完的对象添加到到this中
  Object.assign(this, registry)
  // 创建数据储存库并建立映射关系
  const _metData = Vue.observable(VolumeCollection)
  Object.defineProperty(this,'_metData',{
    // 把_metData设置为只读
    value:_metData,
    enumerable:true
  })
  for (const key in VolumeCollection) {
    
    Object.defineProperty(this,key,{
      get:function(){
        return this._metData[key]
      },
      set:function(x){
        this._metData[key] = x
      }
    })
  }

  implement.map(it => { this[it]() })
}

function decompose(params) {
  const mets = []
  for (const key in params) {
    if(params[key].name!==undefined && typeof params[key].name !== 'string' && params[key].name.length>0){
      console.warn(params[key],'name应为合法字符串,其他值无效');
      params[key].name = undefined
    }
    if (!params.path) {
      mets.push({ ...params[key], __name: key })
    } else if (key !== 'path') {
      mets.push({ ...params[key], __name: key, __path: params.path })
    }
  }
  return mets
}

// 填入查找到的内容
function fill(params, name, func,path) {
  if (typeof func === 'undefined') {
    console.warn(`未查找到可匹配的${name},路径为${path}`);
    return {}
  }
  if (typeof func === 'function') {
    if (typeof params === 'undefined') this[name] = func.bind(this)
    else if (Array.isArray(params)) this[name] = func.bind(this, ...params)
    else this[name] = func.bind(this, params)
    return {}

  } else if (typeof func === 'object') {
    return {
      [name]:JSON.parse(JSON.stringify(func))
    }
  } else {
    return {
      [name]:func
    }
  }
}

// 添入 public 的所有内容
function file_pub(params = {}) {
  for (const key in params) {
    if (typeof params[key] !== 'function') {
      params[key] = JSON.parse(JSON.stringify(params[key]))
    }
    
  }
  return params
}

function ransack(modules, params) {
  try{
    modules = modules.modules[params.shift()]
  }catch(err){
    return {}
  }
  
  if (params.length !== 0) return ransack(modules, params)
  return modules
}
function isObject(obj){
  return Object.prototype.toString.call(obj) === '[object Object]'
}

module.exports = event

