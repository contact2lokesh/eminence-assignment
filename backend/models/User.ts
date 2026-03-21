import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    username: string;
    passwordHash: string;
    role: 'OWNER' | 'USER';
    parentId: mongoose.Types.ObjectId | null;
    ancestry: string;
    balance: number;
    level: number;
    isDownline(targetUserId: any): boolean;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['OWNER', 'USER'],
        default: 'USER'
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    ancestry: {
        type: String,
        default: ''
    },
    balance: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0 // 0 for OWNER, 1+ for USERs
    }
}, { timestamps: true });

userSchema.methods.isDownline = function(targetUserId: any) {
    return targetUserId.ancestry && targetUserId.ancestry.includes(this._id.toString());
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
