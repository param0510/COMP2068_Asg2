const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

const schemaObj = {
    username: String,
    password: String,
    oauthId: String,
    oauthProvider: String,
    oauthDateCreated: Date
}

const mongooseSchema = new mongoose.Schema(schemaObj)

// adding passport local mongoose as a plugin for additional features - createStrategy(), serialize() and deserialize()
mongooseSchema.plugin(plm)

module.exports = mongoose.model('User', mongooseSchema)