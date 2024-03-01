import jwt from "jsonwebtoken";


const verify=(req,res,next)=>{
    try{
        const auth=req.headers.authorization;
        if(!auth) return res.status(401).json('auth not found')
        const token=auth.split(" ")[1]
        if(!token) return res.status(404).json('token not found')
        jwt.verify(token,process.env.JWT,(err,user)=>{
            if(err) return  console.error('Invalid signature:', err.message);
            req.user=user
            next()
        })
    }catch(e){
        next(e);
    }
}
export default verify