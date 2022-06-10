const express = require('express');
const auth = require('../../middleware/auth');
const {check,validationResult} = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const router = express.Router();

// @route  GET api/profile/me
// @desc   get current users profile
// @access Private

router.get('/me',auth, async(req,res)=> {
  try{
      const profile = await Profile.findOne({user : req.user.id}).populate('user',['name','avatar']);

      if(!profile)res.status(400).json({msg : 'No profile found for this user'});

      res.json(profile);

  }catch(err){
      console.log(err);
      res.status(500).send('Server Error');
  }
});

// @route  POST api/profile
// @desc   Create/Update user profile
// @access Private

router.post('/',[auth,
    check('skills','Skills is required').not().isEmpty(),
    check('status','Status is required').not().isEmpty()
],
async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors : errors.array()});
    }
    const {user,
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        experience,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(githubusername) profileFields.githubusername = githubusername; 
    if(status) profileFields.status = status;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(facebook) profileFields.social.facebook = facebook;

    try{
        let profile = await Profile.findOne({user : req.user.id});
        if(profile){
            await Profile.findOneAndUpdate(
                {user : req.user.id},
                {$set : profileFields},
                {new :true}
                );
            return res.json(profile);
        }
        profile = new Profile(profileFields);
        await profile.save();

        return res.json(profile);

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}
)

// @route  GET api/profile
// @desc   get all profiles
// @access Public

router.get('/',async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user', ['name','avatar']);
        res.json(profiles); 
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  GET api/profile/user/user_id
// @desc   get profile using user_id
// @access Public

router.get('/user/:user_id',async (req,res)=>{
    try {
        const profile = await Profile.findOne({
            user : req.params.user_id
        }).populate('user', ['name','avatar']);
        if(!profile){
            return res.status(400).json({msg: "There is no profile for this user"});
        }
        res.json(profile); 
        
    } catch (err) {
        console.log(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: "There is no profile for this user"});
        }
        res.status(500).send('Server Error');
    }
})

// @route  GET api/profile
// @desc   get all profiles
// @access Public

router.delete('/',auth,async (req,res)=>{
    try {
        await Profile.findOneAndDelete({user : req.user.id});

        await User.findOneAndDelete({_id : req.user.id});
        
        res.json({msg : "User and Profile deleted"}); 
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;