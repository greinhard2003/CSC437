import { Schema, model } from "mongoose";
import { User } from "../models/user";

const UserSchema = new Schema<User>(
  {
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    favoriteGenre: { type: String, required: true, trim: true },
  },
  { collection: "users" }
);

const UserModel = model<User>("Users", UserSchema);

function index(): Promise<User[]> {
  return UserModel.find();
}

function get(userid: String): Promise<User> {
  return UserModel.find({ userid })
    .then((list) => list[0])
    .catch((err) => {
      throw `${userid} Not Found`;
    });
}

export default { index, get };
