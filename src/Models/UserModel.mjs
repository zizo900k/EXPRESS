import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.Int32,   // أفضل تستعمل ObjectId بدل Int32
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

export const UserModel = mongoose.model("Users", UserSchema);