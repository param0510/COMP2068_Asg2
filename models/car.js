// Model for car
const mongoose = require('mongoose')

// defining schema object
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
    },
    desc: {
        type: String
    }

}

// building mongoose schema from schema object
const mongooseSchema = new mongoose.Schema(schemaDefinitionObj)

// Exporting the mongoose model
module.exports = mongoose.model('Car', mongooseSchema)