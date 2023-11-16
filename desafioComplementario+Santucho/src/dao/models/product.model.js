import mongoose from 'mongoose'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    name: String,
    age: { 
        type: Number, 
        unique: true
    }
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel
