const express = require('express');

const router = express.Router();

// @route  GET api/profile

router.get('/',(req,res)=> {
   // console.log(req.body);
    res.send('userProfile route');
});

module.exports = router;