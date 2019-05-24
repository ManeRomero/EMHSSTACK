const moment = require('moment')
const fecha = {}

fecha.format = timestamp => {
   var dato = moment(timestamp).startOf('minute').fromNow()
   return dato
}

module.exports = fecha

