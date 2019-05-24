const {
    Schema,
    model
} = require('mongoose')

const modeloVivienda = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    referencia: {
        type: String,
        required: true
    },
    tipoOperacion: {
        type: String,
        required: true
    },
    tipoPropiedad: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    zona: {
        type: String,
        required: true
    },
    superficie: {
        type: Number,
        required: true
    },
    altura: {
        type: Number,
        required: true
    },
    antiguedad: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    numPlantas: {
        type: Number,
        required: true
    },
    dormitorios: {
        type: Number,
        required: true
    },
    aseos: {
        type: Number,
        required: true
    },
    orientacion: {
        type: String,
        required: true
    },
    parcela: Number,
    terraza: Number,
    vistas: {
        type: String,
        required: true
    },
    suelo: {
        type: String,
        required: true
    },
    ventanas: {
        type: String,
        required: true
    },
    puertas: {
        type: String,
        required: true
    },
    tipoPuertas: String,
    extras: [{
        ascensor: {
            type: Boolean,
            default: false
        }
    }],
    otros: String,
    creadoEn: {
        type: Date,
        default: Date.now
    },

    public_id: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    }
})

module.exports = model('Vivienda', modeloVivienda)