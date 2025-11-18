import { Schema, model } from "mongoose";
import { User } from "../models/user";

const UserSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      immutable: true,
    },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    favoriteGenre: { type: String, required: true, trim: true },
  },
  { collection: "users" }
);

const UserModel = model<User>("Users", UserSchema);

function index(): Promise<User[]> {
  return UserModel.find();
}

function get(username: String): Promise<User> {
  return UserModel.find({ _id: username })
    .then((list) => list[0])
    .catch((err) => {
      throw `${username} Not Found`;
    });
}

function create(json: User): Promise<User> {
  const user = new UserModel(json);
  return user.save();
}

function update(username: String, user: User): Promise<User> {
  return UserModel.findOneAndUpdate({ username: username }, user, {
    new: true,
    runValidators: true,
    context: "query",
  }).then((updatedUser) => {
    if (!updatedUser) {
      throw `${username} Not Updated`;
    } else {
      return updatedUser as User;
    }
  });
}

function remove(username: String): Promise<void> {
  return UserModel.findOneAndDelete({ _id: username }).then((deletedUser) => {
    if (!deletedUser) {
      throw `${username} Not Deleted`;
    }
  });
}

export default { index, get, create, update, remove };
