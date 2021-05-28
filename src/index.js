// import event from './addEvent'
const event = require('./addEvent')

const addevent = {
  install(Vue,methods){
    if(methods){
      const { Event,ADD} = event(Vue,methods)
      Object.defineProperty(Vue.prototype,'$modMet',{
        value:Event,
        enumerable:true
      })
      Object.defineProperty(Vue.prototype,'$met',{
        value:ADD,
        enumerable:true
      })
    }else{
      Object.defineProperty(Vue.prototype,'$met',{
        value:ADD,
        enumerable:true
      })
    }
  }
}
module.exports = addevent
