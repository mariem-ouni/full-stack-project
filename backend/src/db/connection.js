//  const mongoose=require('mongoose');
//  require('dotenv').config()

import mongoose from "mongoose"

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('database connected')
    } catch (err) {
        console.log('database connection failed', err)
    }
}
export default connection