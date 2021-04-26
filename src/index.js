// import event from './addEvent'
const event = require('./addEvent')

const addevent = {
  install(Vue,methods){
    if(methods){
      const { Event,ADD} = event(Vue,methods)
      Vue.prototype.$modMet = Event
      Vue.prototype.$met = ADD
    }else{
      Vue.prototype.$met = event(Vue)
    }
    
  }
}

module.exports = addevent
