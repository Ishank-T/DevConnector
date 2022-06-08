const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){

    const token = req.header('x-auth-token');

    if(!token){
        res.status(401).json({msg: 'No token, authoriation denied'})
    }

    try{
        const decoded = jwt.verify(token, config.get('jwtToken'));
        
        req.user = decoded.user;
        next();

    }catch(err){
        res.send('Invalid Token!');
    }

}