import User from "../models/User.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const Register = async (req, res, next) => {
    try {
        const user = await User.find({ name: req.body.name });
        if (user.length > 0) {
            throw new Error(`User ${req.body.name} is already registered`);
        }
        const salt = bcryptjs.genSaltSync(12);
        const hashPassword = bcryptjs.hashSync(req.body.password, salt);
        const newUser = new User({ name: req.body.name, password: hashPassword, email: req.body.email });
        newUser.save();
        const { password, ...others } = newUser._doc;
        const token = jwt.sign({ id: others._id }, process.env.JWT)
        return res.status(200).json({ token, others });
    } catch (err) {
        next(err);
    }
}
export const Login = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        console.log(req.body.name, req.body.password);
        if (!user) {
            throw new Error(`User ${req.body.name} does not exist`);
        }
        const comparePassword = bcryptjs.compareSync(req.body.password, user.password);
        if (!comparePassword) {
            throw new Error(`wrong Password`);
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc
        return res.status(200).json({ token, others })
    } catch (err) {
        next(err);
    }
}
