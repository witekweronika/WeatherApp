import { Schema, model } from 'mongoose';
import { IUser } from '../models/user.model';

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        name:  { type: String, required: true, unique: true },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        isAdmin: { type: Boolean, default: false },
        active:{ type: Boolean, default: true },
        passwordHash: { type: String, required: true },


    },

    {
        collection: 'users' // 👈 tu mówisz: używaj istniejącej kolekcji "users"
    }
);

// nazwa modelu Mongoose (nie kolekcji – kolekcję już wymusiliśmy wyżej)
export default model<IUser>('User', UserSchema);
