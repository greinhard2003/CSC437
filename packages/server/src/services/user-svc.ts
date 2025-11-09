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

function create(json: User): Promise<User> {
  const user = new UserModel(json);
  return user.save();
}

function update(userid: String, user: User): Promise<User> {
  return UserModel.findOneAndUpdate({ userid }, user, {
    new: true,
  }).then((updatedUser) => {
    if (!updatedUser) {
      throw `${userid} Not Updated`;
    } else {
      return updatedUser as User;
    }
  });
}

function remove(userid: String): Promise<void> {
  return UserModel.findOneAndDelete({ userid }).then((deletedUser) => {
    if (!deletedUser) {
      throw `${userid} Not Deleted`;
    }
  });
}

export default { index, get, create, update, remove };
