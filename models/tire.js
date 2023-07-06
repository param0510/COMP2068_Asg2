// Model for car tire
const mongoose = require('mongoose')

const schemaDefinitionObj = {
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sku: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    }

}

const mongooseSchema = new mongoose.Schema(schemaDefinitionObj)

module.exports = mongoose.model('Tire', mongooseSchema)