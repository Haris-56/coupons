
import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'ADMIN' | 'EDITOR' | 'USER';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true }, // Will be hashed
        role: {
            type: String,
            enum: ['ADMIN', 'EDITOR', 'USER'],
            default: 'USER',
        },
    },
    { timestamps: true }
);

// Prevent overwrite on HMR
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
