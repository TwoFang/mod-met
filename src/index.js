// import event from './addEvent'
const event = require('./addEvent')

const addevent = {
  install(Vue,methods){
    Vue.prototype.$event = event(Vue,methods)
  }
}

module.exports = addevent
