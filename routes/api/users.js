const express = require('express');
const { check, validationResult} = require("express-validator/check");
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();

const User = require('../../models/User');

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','Please enter a password of 6 characters or more').isLength({min:6})
],
async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {name,email,password} = req.body;
try{
    if(await User.findOne({email})){
        res.status(400).json({errors: [{ msg : 'User already exists'}]});
    }

    const avatar = gravatar.url(email,{
        s:'200',
        r: 'pg',
        d: 'mm',
    });
    user = new User({
        name,
        password,
        email,
        avatar
    })

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password,salt);

    await user.save();

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