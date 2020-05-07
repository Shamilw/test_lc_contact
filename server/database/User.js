const { Schema } = require("mongoose")
const User = new Schema(
    {
        login: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = User
