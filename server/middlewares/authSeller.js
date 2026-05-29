    import jwt from 'jsonwebtoken';

    const authSeller = async (req, res, next) =>{
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({ success: false, message: 'Not Authorized' });
        }
        
        const sellerToken = authHeader.split(' ')[1]; // extract token

        try{
                const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
        
                if (tokenDecode.email === process.env.SELLER_EMAIL) {
                   next();
                }else{
                    return res.json({success: false, message: 'Not Authorized'})
                }
                
            } catch(error){
                res.json({success:false, message:error.message})
            }
    }

    export default authSeller;