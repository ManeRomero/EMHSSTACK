const mongoose = require('mongoose');
const {
    Schema, model
} = mongoose;
const { ObjectId } = Schema

const tareaSchema = new Schema({
    proceso_id: { type: ObjectId },
    titulo: { type: String, required: true },
    anotaciones: { type: String, required: true },
    creadoEn: { type: Date, default: Date.now },
    creadoPor: { type: String, required: true }
})

module.exports = model('Tarea', tareaSchema);