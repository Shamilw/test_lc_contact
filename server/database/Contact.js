const { Schema } = require("mongoose")
const Contact = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        sex:{
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = Contact
