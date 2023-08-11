// Model for car
const mongoose = require('mongoose')

const schemaDefinitionObj = {
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    transmission: {
        type: String,
        required: true
    }, 
    imageName: {
        type: String
    }

}

const mongooseSchema = new mongoose.Schema(schemaDefinitionObj)

module.exports = mongoose.model('Car', mongooseSchema)