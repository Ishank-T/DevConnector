const express = require('express');
const { check, validationResult} = require("express-validator/check");

const router = express.Router();

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','Please enter a password of 6 characters or more').isLength({min:6})
],
(req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    console.log(req.body);
    res.send('user route');
});

module.exports = router;