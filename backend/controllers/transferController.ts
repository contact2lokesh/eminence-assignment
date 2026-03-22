import { AuthRequest } from "../middlewares/auth";
import { Request, Response } from "express";
import User from "../models/User";
import Transaction from "../models/Transaction";


export const selfRecharge = async(req: AuthRequest, res: Response) => {
    try {
        const { amount } = req.body;

         if (req.user.role !== 'OWNER') {
            return res.status(403).json({ 
                message: 'Only Owner can self-recharge.' 
            });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                message: 'Valid amount is required.' 
            });
        }
        
        const user = await User?.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        try {
            user.balance += Number(amount);
            await user.save();

            const transaction = new Transaction({
                senderId: null,
                receiverId: user._id,
                amount: Number(amount),
                type: 'SELF_RECHARGE'
            });
            await transaction.save();

            res.status(200).json({ message: 'Recharge successful', balance: user.balance });
        } catch (err) {
            throw err;
        }
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const transferBalance = async(req: AuthRequest, res: Response) => {
    try {
        const { receiverId, amount } = req.body;
        const senderId = req.user.userId;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required.' });
        }

        const sender = await User.findById(senderId);
        
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found.' });
        }

        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found.' });
        }

        if (receiver?.parentId?.toString() !== senderId) {
            return res.status(403).json({ message: 'You can only transfer balance to your direct downline.' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

         try {
            sender.balance -= Number(amount);
            receiver.balance += Number(amount);

            await sender.save();
            await receiver.save();

            const transaction = new Transaction({
                senderId: sender._id,
                receiverId: receiver._id,
                amount: Number(amount),
                type: 'CREDIT'
            });
            await transaction.save();
            res.status(200).json({ message: 'Transfer successful', balance: sender.balance });
        } catch (err) {
            throw err;
        }
    } catch (err: any) {
            res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const getStatement = async(req:AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;

        const transactions = await Transaction.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        })
        .sort({ timestamp: -1 })
        .populate('senderId', 'username')
        .populate('receiverId', 'username');

        const statement = transactions.map(trns => {
            const trnsObj = trns as any;
            const isDebit = trnsObj.senderId && trnsObj.senderId._id.toString() === userId;
            const isSelfRecharge = trns.type === 'SELF_RECHARGE';
            
            return {
                id: trns._id,
                type: isSelfRecharge ? 'SELF RECHARGE' : isDebit ? 'DEBIT' : 'CREDIT',
                amount: trns.amount,
                timestamp: trnsObj.createdAt || trnsObj.timestamp,
                from: isSelfRecharge ? 'System' : trnsObj.senderId ? trnsObj.senderId.username : 'System',
                to: trnsObj.receiverId.username
            };
        });

        res.status(200).json(statement);
    } catch (err : any) {
        res.status(500).json({  message: 'Server error', error: err.message })
    }
}
