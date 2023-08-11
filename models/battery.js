// Model for car tire
const mongoose = require('mongoose')

const schemaDefinitionObj = {
    brand: {
        type: String,
        required: true
    },
    reserveCapacity: {
        type: String,
        required: true
    },
    manufacPartNumber: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bciGrpSize: {
        type: String,
        required: true
    },
    imageName: {
        type: String
    }

}

const mongooseSchema = new mongoose.Schema(schemaDefinitionObj)

module.exports = mongoose.model('Battery', mongooseSchema)