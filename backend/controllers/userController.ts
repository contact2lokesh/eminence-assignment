import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middlewares/auth";

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getDownline = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const { all } = req.query; // ?all=true to fetch complete nested hierarchy

    let query = {};
    if (all === "true") {
      // Fetch all users whose ancestry contains this userId
      query = { ancestry: { $regex: new RegExp(`(^|,)${userId}(,|$)`) } };
    } else {
      // Fetch only direct children
      query = { parentId: userId };
    }

    const downline = await User.find(query).select("-passwordHash");
    res.status(200).json(downline);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createNextLevelUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, username, password } = req.body;

    if (!name || name.trim() === "") {
      res.status(400).json({ 
            message: "Name is required."
        });
    }

    if (!username || username.length < 6 || !/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(username)) {
      res.status(400).json({
          message: "Username must be at least 6 characters long and include both letters and numbers.",
        });
    }

    if (!password || password.length < 6) {
      res.status(400).json({ 
            message: "Password must be at least 6 characters long." 
        });
    }

    const parentId = req.user.userId;
     const parentUser = await User.findById(parentId);
        if (!parentUser) {
            return res.status(404).json({ message: 'Parent user not found.' });
        }

    const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

     // Setup new user ancestry
    const ancestry = parentUser.ancestry 
        ? `${parentUser.ancestry},${parentUser._id.toString()}` 
        : parentUser._id.toString();

    const passwordHash = await bcrypt.hash(password, 10);

     const newUser = new User({
            name,
            username,
            passwordHash,
            role: 'USER',
            parentId: parentUser._id,
            ancestry,
            level: parentUser.level + 1
        });

     await newUser.save();
        res.status(201).json({ 
            message: 'User created successfully.',
            user: { _id: newUser._id, name: newUser.name, username: newUser.username, level: newUser.level }
        });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const  changeNextLevelPassword = async(req:AuthRequest, res:Response) => {
    try {
        const childId = req.params.id;
        const parentId = req.user.userId;
        const { newPassword } = req.body;

        console.log({childId, parentId, newPassword})

        if(!newPassword || newPassword?.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long.' 
            });
        }
        const childUser = await User.findById(childId);
        
        if (!childUser) {
            return res.status(404).json({ 
                message: 'User not found.' 
            });
        }

        // check the particular user assosiated with their parent user or not //
        if (childUser?.parentId?.toString() !== parentId) {
            return res.status(403).json({ 
                message: 'You can only change the password of your direct downline.' });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        childUser.passwordHash = passwordHash;
        await childUser.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err: any) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
