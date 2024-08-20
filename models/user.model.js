import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, require: true, default: "user", enum:["user", "admin"]}
}, {
    versionKey: false
})

const userModel = mongoose.model("user", userSchema);

export default userModel;

