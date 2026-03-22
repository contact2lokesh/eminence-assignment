import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    senderId: mongoose.Types.ObjectId | null;
    receiverId: mongoose.Types.ObjectId;
    amount: number;
    type: 'CREDIT' | 'SELF_RECHARGE';
}

const transactionSchema = new Schema<ITransaction>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    type: {
        type: String,
        enum: ['CREDIT', 'SELF_RECHARGE'],
        required: true
    }
}, { timestamps: true });

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
