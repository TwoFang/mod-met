// import event from './addEvent'
const event = require('./addEvent')

const addevent = {
  install(Vue,methods){
    if(methods){
      const { Event,ADD} = event(Vue,methods)
      Object.defineProperty(Vue.prototype,'$modMet',{
        value:Event
      })
      Object.defineProperty(Vue.prototype,'$met',{
        value:ADD
      })
    }else{
      Object.defineProperty(Vue.prototype,'$met',{
        value:ADD
      })
    }
  }
}
module.exports = addevent
