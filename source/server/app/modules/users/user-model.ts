import * as Mongoose from 'mongoose';

const userSchema = new Mongoose.Schema(
    {
        firstName: { type: String, min: 1, max: 30 },
        lastName: { type: String, min: 1, max: 30 },
        email: { type: String, min: 8, max: 100, unique: true, required: true },
        scope: [String],
        hashPassword: { type: String, required: true },
        sessions: [String]
    },
    { timestamps: true }
);

export const UserModel = Mongoose.model<IUser>('User', userSchema);

export interface IUser extends Mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    scope: Array<string>;
    hashPassword: string;
    sessions: Array<string>;
}
