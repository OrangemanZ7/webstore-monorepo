import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  password: string;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isTwoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
  },
  { timestamps: true }
);

export default models.Admin || model<IAdmin>("Admin", AdminSchema);
