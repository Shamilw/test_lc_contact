const { Schema } = require("mongoose")
const Token = new Schema(
    {
        user_id: {
            type:Schema.Types.ObjectId,
            required: true,
        },
        Token: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = Token
