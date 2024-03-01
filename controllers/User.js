import User from '../models/User.js'
import jwt from 'jsonwebtoken'
export const AddResume = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { Resume: req.body.resume });
        return res.status(200).json('update with success')
    } catch (err) {
        next(err)
    }

}
export const updateUser = async (req, res, next) => {
    try {
        const getUser = await User.findById(req.user.id);
        if (getUser) {
            const UpdateUser = await User.findByIdAndUpdate(req.user.id, { name: req.body.name, email: req.body.email, path: req.body.path,location:req.body.location,About:req.body.about,$push:{certificates:req.body.certificates}})
            const token=jwt.sign({id:UpdateUser._id},process.env.JWT)
            UpdateUser.save()
            console.log(UpdateUser.Resume)
            return res.status(200).json({ name:UpdateUser.name, url: UpdateUser.url,  token ,email:UpdateUser?.email,About:UpdateUser?.About,location:UpdateUser?.location,path:UpdateUser?.path,certificates:UpdateUser?.certificates,token})
        } else {
            return res.status(404).json('No User Exist');
        }
    } catch (err) {
        next(err)
    }
}