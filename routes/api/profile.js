const express = require('express');
const config = require('config');
const request = require('request');

const auth = require('../../middleware/auth');
const {check,validationResult} = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post')

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
        await Profile.deleteMany({user:req.user.id});

        await Profile.findOneAndDelete({user : req.user.id});

        await User.findOneAndDelete({_id : req.user.id});
        
        res.json({msg : "User and Profile deleted"}); 
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  PUT api/profile/experience
// @desc   Adds experience to the profile
// @access Private

router.put('/experience',[auth,
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from', 'From date is requiresd').not().isEmpty(),
],
async (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }

    const {title,company,current,location,from,description} = req.body;

    const newExp ={
        title,
        company,
        current,
        location,
        from,
        description
    }
    try{
    const profile = await Profile.findOne({user : req.user.id});

    profile.experience.unshift(newExp);
    await profile.save();

    res.json(profile);

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}
)

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience from the profile
// @access Private

router.delete('/experience/:exp_id',auth, async(req,res)=>{
    try{
    const profile = await Profile.findOne({user : req.user.id});

    const index = profile.experience
    .map(item=>item.id)
    .indexOf(req.params.exp_id);

    profile.experience.splice(index,1);
    await profile.save();
    res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  PUT api/profile/education
// @desc   Adds education to the profile
// @access Private

router.put('/education',[auth,
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy','Field of Study is  required').not().isEmpty(),
    check('from', 'From date is requiresd').not().isEmpty(),
],
async (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }

    const {school,degree,fieldofstudy,from,to,description} = req.body;

    const newEdu ={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        description
    }
    try{
    const profile = await Profile.findOne({user : req.user.id});

    profile.education.unshift(newEdu);
    await profile.save();

    res.json(profile);

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}
)

// @route  DELETE api/profile/education/:edu_id
// @desc   Delete education from the profile
// @access Private

router.delete('/education/:edu_id',auth, async(req,res)=>{
    try{
    const profile = await Profile.findOne({user : req.user.id});

    const index = profile.education
    .map(item=>item.id)
    .indexOf(req.params.exp_id);

    profile.education.splice(index,1);
    await profile.save();
    res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  GET api/profile/github/:username
// @desc   Get user repos from github
// @access Public

router.get('/github/:username',async(req,res)=>{
    try {
        const options= {
            uri : `https://api.github.com/users/${req.params.username}
            /repos?per_page=5&sort=created:asc&client_id=${config.get
                ('githubClient')}&client_secret=${config.get('githubSecret')}`,
            method : 'GET',
            headers : {'user-agent': 'node-js'}
        };
        request(options, (error,response,body)=>{
            if(error)console.log(error);
            if(response.statusCode !==200){
                res.status(404).json({msg:'No github profile for this username'});
            }
            res.json(JSON.parse(body));
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;