// import event from './addEvent'
const event = require('./addEvent')

const addevent = {
  install(Vue,methods){
    const { Event,ADD} = event(Vue,methods)
    Object.defineProperty(Vue.prototype,'$met',{
      value:ADD,
      enumerable:true
    })
    if(Event){
      Object.defineProperty(Vue.prototype,'$modMet',{
        value:Event,
        enumerable:true
      })
      
    }
  }
}
module.exports = addevent
