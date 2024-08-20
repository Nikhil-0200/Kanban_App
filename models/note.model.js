import mongoose from "mongoose";

const noteSchema = mongoose.Schema({
    title: {type: String, required: true},
    status: {type: String, required: true, default: "pending", enum: ["pending", "completed"]},
    description: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}
}, {
    versionKey: false,
    timestamps: true
})

const noteModel = mongoose.model("note", noteSchema);

export default noteModel;

