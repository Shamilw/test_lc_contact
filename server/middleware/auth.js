const database = require("../database")
const Token = database.model("Token")

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.get("Authorizations")
        if (!authHeader) {
            res.send({ status: "error", message: "error Authorizations" })
        } else {
            const authOk = await Token.findOne({ Token: authHeader })
            if (authOk) {
                next()
            } else {
                res.send({ status: "error", message: "error Authorizations" })
            }
        }
    } catch (error) {
        res.send({ status: "error" })
    }
}
