const mongoose = require("mongoose")
const User = require("./User")
const Contact = require("./Contact")
const Token = require("./Token")
const mockData=require('./mockContacts')

const db_url=process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/testdb'

mongoose.connect(db_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

mongoose.connection.once("connected", () => console.log("connected to mongoDB"))
mongoose.connection.once("disconnected", () => console.log("disconnected from mongoDB"))

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        console.log("mongoose disconnected from mongodb through app termination")
        process.exit(0)
    })
})

mongoose.model("User", User)
mongoose.model("Contact", Contact)
mongoose.model("Token", Token)





(async function (){
    const contacts=await mongoose.model("Contact").findOne({})
    if (!contacts) {
      await mongoose.model("Contact").insertMany(mockData) 
     }
}())

module.exports = mongoose.connection
