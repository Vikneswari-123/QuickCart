import jwt from 'jsonwebtoken';

const authUser = async (req, res, next)=>{
    // Read from Authorization header instead of cookie
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ success: false, message: 'Not Authorized' });
   }

   const token = authHeader.split(' ')[1]; // extract token

    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
            req.user = { id: tokenDecode.id };
            next();
        }else{
            return res.json({success: false, message: 'Not Authorized'})
        }
        
    } catch(error){
        res.json({success:false, message:error.message})
    }
}

export default authUser;