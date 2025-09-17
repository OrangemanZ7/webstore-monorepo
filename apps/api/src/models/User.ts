import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  provider: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    provider: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
