import jwt from 'jsonwebtoken';

const messAuthMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    console.log(req.headers);
    
    try {
        
        if(token){    
            const token_decode =  jwt.verify(token, process.env.JWT_SECRET);
            req.body.messId = token_decode.id;
        }
        else { 
            // if(!req.query.messId){return res.json({success:false,message:'Not Authorized Login Again'});}
            req.body.messId = req.query.messId;        
        }
        next();
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export default messAuthMiddleware;