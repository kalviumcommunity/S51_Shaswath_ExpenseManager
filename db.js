const mongoose = require('mongoose')

const Connect = async () => {
    try{
        await mongoose.connect(process.env.Database_URI)
    } catch(err){
        console.log("Error : ", err)
    }
}
const isConnected = () => mongoose.connection.readyState === 1 ? true:false
module.exports = {Connect, isConnected}