const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult} = require("express-validator/check");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();

router.get('/',auth, async(req,res)=> {
   try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

   }catch(err){
        console.log(err.message);
        res.status(400).send('Server Error');
   }
});

router.post('/',[
    check('email','Please enter a valid email').isEmail(),
    check('password','Please enter a password').exists()
],
async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body;
try{
    const user = await User.findOne({email});
    if(!user){
        res.status(400).json({errors: [{ msg : 'Invalid Credentials'}]});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        res.status(400).json({errors: [{ msg : 'Invalid Credentials'}]});
    }

    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(
        payload,
        config.get('jwtToken'),
        {expiresIn :360000},
        (err,token) =>{
            if(err) throw err;
            res.json({token});
        }
        )
    

}catch(err){
    console.log(err.message);
    res.status(401).json({msg:'Invalid token!'});
}
});
module.exports = router;