import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import User from "../models/User";
import Transaction from "../models/Transaction";

export const getUsersByLevel = async(req: AuthRequest, res:Response) => {
     try {
        const level = parseInt(req.params.level as string);
        const users = await User.find({ level }).select('-passwordHash');
        res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const getUserDownline = async(req: AuthRequest, res:Response) => {
    try {
        const userId = req.params.id;
        const downline = await User.find({ ancestry: { $regex: new RegExp(`(^|,)${userId}(,|$)`) } }).select('-passwordHash');
        res.status(200).json(downline);

    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const getSummary = async(req:AuthRequest, res:Response) => {
    try {
        const summary = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    totalBalance: { $sum: "$balance" },
                    userCount: { $sum: 1 }
                }
            }
        ]);

        const totalSystemBalance = summary.reduce((acc, curr) => acc + curr.totalBalance, 0);

            res.status(200).json({
            roleSummary: summary,
            totalSystemBalance
        });

    } catch (err:any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const globalCredit = async(req: AuthRequest, res: Response) => {
    try {
        const { receiverId, amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required.' });
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found.' });
        }

        if (receiver.role === 'OWNER') {
            return res.status(400).json({ message: 'Cannot globally credit the owner. Use self-recharge.' });
        }

        const parent = await User.findById(receiver.parentId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent of receiver not found. Cannot deduct.' });
        }

         if (parent.balance < amount) {
            return res.status(400).json({ message: `Parent user (${parent.username}) has insufficient balance to auto-deduct.` });
        }

        try {
            parent.balance -= Number(amount);
            receiver.balance += Number(amount);

            await parent.save();
            await receiver.save();

            const transaction = new Transaction({
                senderId: parent._id,
                receiverId: receiver._id,
                amount: Number(amount),
                type: 'CREDIT'
            });
            await transaction.save();
            
            res.status(200).json({ message: `Credit successful. Deducted from ${parent.username}.`, newBalance: receiver.balance });
        } catch (err) {
            throw err;
        }

    } catch(err: any) {
        res.status(500).json({  message: 'Server error', error: err.message });
    }
}
