const mongoose =require("mongoose");


const connnectdb = async ()=>{
    try {
        const conn =await mongoose.connect(process.env.MONGODB)
         
        console.log("mongo is connected ",conn.connection.host)
    } catch (error) {
        console.log(error)
    }
}

module.exports =connnectdb