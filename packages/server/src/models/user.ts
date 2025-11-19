import { Types } from "mongoose";

export interface User {
  _id?: Types.ObjectId;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  favoriteGenre: string;
}
