// Model for car tire
const mongoose = require('mongoose')

const schemaDefinitionObj = {
    prodName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    dimensions: {
        type: String,
        required: true
    },
    modelNumber: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }

}

const mongooseSchema = new mongoose.Schema(schemaDefinitionObj)

module.exports = mongoose.model('Accessory', mongooseSchema)