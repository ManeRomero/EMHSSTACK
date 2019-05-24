const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const procesoSchema = new Schema({
  referencia: {
    type: String,
    required: true
  },

  nombreCliente: {
    type: String,
    required: true
  },

  telefonoCliente: {
    type: String,
    required: true
  },

  creadoEn: {
    type: Date,
    default: Date.now
  },

  precioFinal: {
    type: Number,
    required: true
  },

  user: {
    type: String,
    required: true
  },

  creadoPor: {
    type: String,
    required: true
  },

  direccion: {
    type: String,
    required: true
  }
/*   tareas: [{
    titulo: {
      type: String,
      required: true
    },
    anotaciones: String,
    creadoEn: {
      type: Date,
      default: Date.now
    },
    usuario: {type: String, required: true}
  }] */
});

module.exports = mongoose.model('proceso', procesoSchema);