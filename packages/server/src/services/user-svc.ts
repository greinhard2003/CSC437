import { Schema, Types, model } from "mongoose";
import { User } from "../models/user";

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, trim: true },
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

function get(id: string): Promise<User> {
  return UserModel.find({ _id: id })
    .then((list) => list[0])
    .catch((err) => {
      throw `${id} Not Found`;
    });
}

function create(json: User): Promise<User & { _id: Types.ObjectId }> {
  return new UserModel(json).save().then((d) => d.toObject()); // still has _id
}

function update(id: string, user: User): Promise<User> {
  return UserModel.findByIdAndUpdate(id, user, {
    new: true,
    runValidators: true,
    context: "query",
  }).then((updatedUser) => {
    if (!updatedUser) {
      throw `${id} Not Updated`;
    }
    return updatedUser as User;
  });
}

function remove(id: string): Promise<void> {
  return UserModel.findByIdAndDelete(id).then((deletedUser) => {
    if (!deletedUser) {
      throw `${id} Not Deleted`;
    }
  });
}

export default { index, get, create, update, remove };
