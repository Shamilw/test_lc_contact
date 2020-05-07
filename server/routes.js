const express = require("express")
const router = express.Router()

const Auth = require("./middleware/auth")
const database = require("./database")
const User = database.model("User")
const Contact = database.model("Contact")
const Token = database.model("Token")

async function createToken(user) {
    const oldToken = await Token.findOne({ user_id: user._id })
    if (oldToken) {
        return oldToken.Token
    }
    const newToken =
        Date.now() +
        Math.random()
            .toString()
            .slice(-5)
    await Token.create({ user_id: user._id, Token: newToken })
    return newToken
}

// CRUD start

router.get("/allcontacts", Auth, async (req, res) => {
    try {
        const data = await Contact.find({})
        res.send({ status: "success", data })
    } catch (e) {
        res.send({ status: "error" })
    }
})

router.put("/editcontact", Auth, async (req, res) => {
    try {
        let upd = await Contact.findByIdAndUpdate(
            { _id: req.body._id },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    sex: req.body.sex,
                },
            },
            { new: true }
        )
        res.send({ status: "success", data: upd })
    } catch (e) {
        res.send({ status: "error" })
    }
})

router.delete("/delete/:_id", Auth, async (req, res) => {
    try {
        let del = await Contact.deleteOne({ _id: req.params._id })
        if (del.ok && del.deletedCount) {
            res.send({ status: "success" })
        } else {
            res.send({ status: "error" })
        }
    } catch (e) {
        res.send({ status: "error" })
    }
})
router.post("/create", Auth, async (req, res) => {
    try {
        const contact = await Contact.create({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            sex: req.body.sex,
        })
        res.send({ status: "success", data: contact })
    } catch (e) {
        res.send({ status: "error" })
    }
})

// CRUD end

router.post("/reg", async (req, res) => {
    try {
        if (req.body.login && req.body.password) {
            const oldUser = await User.findOne({ login: req.body.login })
            if (oldUser) {
                res.send({ status: "error" })
            } else {
                const user = await User.create({
                    login: req.body.login,
                    password: req.body.password,
                })
                const token = await createToken(user)
                res.send({ status: "success", data: token })
            }
        } else {
            res.send({ status: "error" })
        }
    } catch (e) {
        res.send({ status: "error" })
        console.log(e)
    }
})
router.post("/login", async (req, res) => {
    try {
        if (req.body.login && req.body.password) {
            const user = await User.findOne({
                login: req.body.login,
                password: req.body.password,
            })
            if (user) {
                const token = await createToken(user)
                res.send({ status: "success", data: token })
            } else {
                res.send({ status: "error" })
            }
        } else {
            res.send({ status: "error" })
        }
    } catch (e) {
        res.send({ status: "error" })
        console.log(e)
    }
})
router.post("/logout", Auth, async (req, res) => {
    try {
        const token = req.get("Authorizations")
        await Token.remove({ Token: token })
        res.send({ status: "success" })
    } catch (e) {
        res.send({ status: "error" })
    }
})

module.exports = router
